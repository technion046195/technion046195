const express = require('express')
const http = require('http')
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const puppeteer = require('puppeteer')
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

exports.onCreateDevServer=({ app })=>{
    app.use(express.static('public'));
    generateExtras({runServer: false}).then((res) => {console.log('Extras were generated')});
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const result = await graphql(`
      query {
        allMarkdownRemark(
          sort: { order: ASC, fields: [frontmatter___index] },
          filter: {frontmatter: {template: {ne: null}}}
          ) {
            nodes {
              fields {
                slug
              }
              frontmatter {
                template
                type
                index
              }
          }
        }
      }
    `)

  var slug;

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }
  const data = result.data;


  let lastByType = {}
  let slugsData = {};
  data.allMarkdownRemark.nodes.forEach((node) => {
    slug = node.fields.slug;
    const type = node.frontmatter.type;
    const index = node.frontmatter.index;
    const template = node.frontmatter.template;
    slugsData[slug] = {type, template,  prev: 'disable', next: 'disable'};

    if (index != null) {
      if (lastByType[type] != null) {
        slugsData[lastByType[type]].next = slug;
        slugsData[slug].prev = lastByType[type];
      }
      lastByType[type] = slug;
    }
  });

  Object.keys(slugsData).forEach(slug => {
    createPage({
      path: slug,
      component: path.resolve(`./src/templates/${slugsData[slug].template}.js`),
      context: {
        slug,
        prev: slugsData[slug].prev,
        next: slugsData[slug].next,
      }
    })
  })
}

exports.onPostBuild = async ({ graphql }) => {
  await generateExtras({ graphql });
}

generateExtras = async ({ graphql=null, runServer=true }) => {
  jupyterCSSPromise = setJupyterCSS();

  let serverPromise = null
  if (runServer) {
    const port = 8000;
    const app = express();
    app.use(express.static('public'));
    serverPromise = new Promise(resolve => {
      console.log('Temporarily serving site');
      const server = app.listen(port, () => {
        console.log(`Server up`);
        resolve(server);
      })
    });
  } else {
    serverPromise = new Promise(resolve => setTimeout(resolve, 6000))
  }

  let queryPromise = null
  query = `
    query {
      allMarkdownRemark(
        filter: {frontmatter: {generate: {ne: null}}}
        ) {
          nodes {
            fields {
              slug
            }
            frontmatter {
              generate
            }
            fileAbsolutePath
        }
      }
    }
  `
  if ( graphql == null ) {
    queryPromise = new Promise((resolve) => {
      const req = http.request(
        {
          hostname: 'localhost',
          port: 8000,
          path: '/__graphql',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }, resp => {
          const chunks = [];
          resp.on('data', chunk => chunks.push(chunk))
          resp.on('end', () => {
            let res = JSON.parse(Buffer.concat(chunks));
            resolve(res);
          });
        });
      req.on('error', error => {
        console.error(error)
      })
      req.write(JSON.stringify({query}));
      req.end()
    });
  } else {
    queryPromise = graphql(query)
  }

  const results = await Promise.all([serverPromise, queryPromise, jupyterCSSPromise]);
  const server = results[0];
  const data = results[1].data;

  let promisesArray = [];
  data.allMarkdownRemark.nodes.forEach((node) => {
    const generate = node.frontmatter.generate;
    const mdFilename = node.fileAbsolutePath;
    const slug = node.fields.slug;

    const url = `http://localhost:8000${slug}`

    if (generate.includes('code-html')){
      promisesArray.push(codeToHtml({
        codeFilename: `${path.dirname(mdFilename)}/code.ipynb`,
        codeHTMLFilename: `${__dirname}/public${slug}code/index.html`,
        outputCodeFilename: `${__dirname}/public${slug.slice(0, -1)}.ipynb`,
        }));
    }

    if (generate.includes('docx')){
      promisesArray.push(mdToDoc({
        mdFilename,
        docxFilename: `${__dirname}/public/${slug.slice(1, -1).replace("/", "_")}.docx`,
        }));
    }

    // // Netlify does not support texlive (via homebrew): https://github.com/netlify/build-image/pull/474
    // if (generate.includes('pdf')){
    //   promisesArray.push(mdToPDF({
    //     mdFilename,
    //     pdfFilename: `${__dirname}/public/${slug.slice(1, -1).replace("/", "_")}.pdf`,
    //     }));
    // }

    if (generate.includes('print-pdf')){
      promisesArray.push(printToPDF({
        url,
        pdfFilename: `${__dirname}/public/${slug.slice(1, -1).replace("/", "_")}.pdf`,
        }));
    }

    if (generate.includes('slides-pdf')){
      promisesArray.push(printToPDF({
        url :`${url}?print-pdf`,
        pdfFilename: `${__dirname}/public/${slug.slice(1, -1).replace("/", "_")}_deck.pdf`,
        slides: true,
        }));
      promisesArray.push(printToPDF({
        url :`${url}?print-pdf&compact`,
        pdfFilename: `${__dirname}/public/${slug.slice(1, -1).replace("/", "_")}.pdf`,
        slides: true,
        }));
    }
  })

  await Promise.all(promisesArray);
  
  if (server != null){
    server.close();
    console.log('Server down')
  }
}

const setJupyterCSS = async () => {
  fs.mkdirSync(`${os.homedir()}/jupyter/custom`, { recursive: true });
  console.log(`Copying Jupyter CSS`);
  fs.copyFile(`${__dirname}/src/styles/style.css`, `${os.homedir()}/.jupyter/custom/custom.css`, (err) => {if (err) throw err});
}

const codeToHtml = async ({codeFilename, codeHTMLFilename, outputCodeFilename}) => {
  console.log(`Converting: ${codeFilename} -> ${codeHTMLFilename}`);
  fs.mkdirSync(path.dirname(codeHTMLFilename), { recursive: true });
  const cmd_args = [
    'nbconvert',
    '--to=html_embed',
    '--template=classic',
    '--log-level=WARN',
    '--output-dir=public',
    `--output=${codeHTMLFilename}`,
    codeFilename]
  
  await new Promise(resolve => {
    const run = spawn('jupyter', cmd_args)
    run.stdout.on('data', (data) => {console.log(`  ${data}`);});
    run.stderr.on('data', (data) => {console.log(`  !! error: ${data}`);});
    run.on('close', (code) => {resolve(code);})
  });

  console.log(`Copying: ${codeFilename} -> ${outputCodeFilename}`);
  fs.mkdirSync(path.dirname(outputCodeFilename), { recursive: true });
  fs.copyFile(codeFilename, outputCodeFilename, (err) => {if (err) throw err});
}

const mdToDoc = async ({mdFilename, docxFilename}) => {
  console.log(`Converting: ${mdFilename} -> ${docxFilename}`);
  fs.mkdirSync(path.dirname(docxFilename), { recursive: true });
  const cmd_args = [
    mdFilename,
    `--resource-path=${path.dirname(mdFilename)}`,
    '-f', 'markdown+tex_math_dollars',
    '-t', 'docx',
    '-o', docxFilename]
  await new Promise(resolve => {
    const run = spawn('pandoc', cmd_args)
    run.stdout.on('data', (data) => {console.log(`  ${data}`);});
    run.stderr.on('data', (data) => {console.log(`  !! error: ${data}`);});
    run.on('close', (code) => {resolve(code);})
  });
}

const mdToPDF = async ({mdFilename, pdfFilename}) => {
  console.log(`Converting: ${mdFilename} -> ${pdfFilename}`);
  fs.mkdirSync(path.dirname(pdfFilename), { recursive: true });
  const cmd_args = [
    mdFilename,
    `--resource-path=${path.dirname(mdFilename)}`,
    '-f', 'markdown',
    '-t', 'latex',
    '--pdf-engine=xelatex',
    '-V', 'dir:rtl',
    '-V', 'mainfont:DejaVu Sans',
    '-V', 'monofont:DejaVu Sans Mono',
    '-V', 'geometry:margin=2cm',
    '-V', 'linkcolor:blue',
    '-o', pdfFilename]
  await new Promise(resolve => {
    const run = spawn('pandoc', cmd_args)
    run.stdout.on('data', (data) => {console.log(`  ${data}`);});
    run.stderr.on('data', (data) => {console.log(`  !! error: ${data}`);});
    run.on('close', (code) => {resolve(code);})
  });
}

const printToPDF = async ({url, pdfFilename, slides=false}) => {
  console.log(`Printing: ${url} -> ${pdfFilename}`);
  fs.mkdirSync(path.dirname(pdfFilename), { recursive: true });
  let trail = 1
  while(true) {
    let browser = null
    try {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
      });
      const page = await browser.newPage()
      page.on('error', err => { if (!page.isClosed()) { page.close(); }});
      await page.goto(url, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 10000))
      if (slides) {
        await page.pdf({
          width: "9.75in",
          height: "8.13in",
          path: pdfFilename,
          margin: 0,
          preferCSSPageSize: true,
          printBackground: true
        })
      } else {
        await page.pdf({
          format: 'A4',
          path: pdfFilename,
          scale: 0.75,
          margin: { left: '0.75in', top: '0.75in', right: '0.75in', bottom: '0.75in' },
          displayHeaderFooter: true,
          headerTemplate: '<div></div>',
          footerTemplate: '<div style="width:100%;margin:0;text-align:center;font-size:12px;font-style:italic;color:#c0c0c0"><span class="pageNumber"></span></div>'
        })
      }
      await browser.close();
      break;
    }
    catch(error){
      await browser.close();
      if (trail < 5) {
        trail++;
        console.log(`Error loading ${url}. Trying again. Trail: ${trail}`);
        await new Promise(resolve => setTimeout(resolve, 1000))
      } else {
        console.log(`Error loading ${url}.`);
        break;
      }
    }
  }
}
