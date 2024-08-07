const express = require('express')
const path = require(`path`)
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const crypto = require('crypto');
const objectHash = require('object-hash');
const puppeteer = require('puppeteer')
const { createFilePath } = require(`gatsby-source-filesystem`)

var pagesToPrintList = [];

// require('events').EventEmitter.prototype._maxListeners = 70;
// require('events').defaultMaxListeners = 70;

exports.onCreateDevServer = ({ app }) => {
    app.use(express.static('public'));
    printToPDF(pagesToPrintList, 5, true);
}

exports.onPreInit = async () => {
  await setJupyterCSS();
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  let typeDefs;

  typeDefs = `
    type File implements Node {
      fields: Fields
    }
    type Fields {
      slug: String
      code_copy_filename: String
      code_html_filename: String
    }
  `
  createTypes(typeDefs)
  
  typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: FrontMatter
    }
    type FrontMatter {
      make_docx: Boolean!
      print_pdf: Boolean!
      slides_pdf: Boolean!
    }
  `
  createTypes(typeDefs)

  typeDefs = `
    type MarkdownRemark implements Node {
      fields: Fields
    }
    type Fields {
      slug: String
      docx_filename: String
      print_pdf_filename: String
      slides_pdf_filename: String
      slides_compact_pdf_filename: String
    }
  `
  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `File` & node.ext == '.ipynb') {
    try {
      const slug = createFilePath({ node, getNode })
      let codeCopyFilename = `${__dirname}/public/assets/${slug.slice(1, -1).replace(/\//g,'_')}.ipynb`
      createNodeField({
        node,
        name: `code_copy_filename`,
        value: codeCopyFilename
      })
      let codeHTMLFilename = `${__dirname}/public${slug}index.html`
      createNodeField({
        node,
        name: `code_html_filename`,
        value: codeHTMLFilename
      })
    } catch(error) {
      console.log(`Got an error when trying to read ${node.absolutePath}`);
      console.log(error);
    }
  }

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode })
    createNodeField({
      node,
      name: `slug`,
      value: slug
    })
    if ((node.frontmatter.make_docx != null) & node.frontmatter.make_docx){
      let docxFilename = `${__dirname}/public/assets/${slug.slice(1,-1).replace(/\//g,'_')}.docx`
      createNodeField({
        node,
        name: `docx_filename`,
        value: docxFilename
      })
    }
    if ((node.frontmatter.print_pdf != null) & node.frontmatter.print_pdf){
      let printPDFFilename = `${__dirname}/public/assets/${slug.slice(1,-1).replace(/\//g,'_')}.pdf`
      createNodeField({
        node,
        name: `print_pdf_filename`,
        value: printPDFFilename
      })
    }
    if ((node.frontmatter.slides_pdf != null) & node.frontmatter.slides_pdf){
      let slidesPDFFilename = `${__dirname}/public/assets/${slug.slice(1,-1).replace(/\//g,'_')}_deck.pdf`
      createNodeField({
        node,
        name: `slides_pdf_filename`,
        value: slidesPDFFilename
      })
      let slidesCompactPDFFilename = `${__dirname}/public/assets/${slug.slice(1,-1).replace(/\//g,'_')}.pdf`
      createNodeField({
        node,
        name: `slides_compact_pdf_filename`,
        value: slidesCompactPDFFilename
      })
    }
  }
}

exports.createPages = async ({ cache, graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
      query {
        files: allFile{
          nodes {
            absolutePath
            fields {
              code_html_filename
              code_copy_filename
            }
          }
        }
        md_pages: allMarkdownRemark(
          sort: { order: ASC, fields: [frontmatter___index] },
          filter: {frontmatter: {template: {ne: null}}}
          ) {
            nodes {
              fileAbsolutePath
              fields {
                slug
                docx_filename
                print_pdf_filename
                slides_pdf_filename
                slides_compact_pdf_filename
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

  if (result.errors) { throw result.errors; }
  const data = result.data;

  let tasks = [];
  for (const node of data.files.nodes){ 
    if ((node.fields != null) && (node.fields.code_copy_filename != null)) {
      tasks.push(async () => {
        const src = node.absolutePath;
        const dist = node.fields.code_copy_filename;
        await copyFileCache({src, dist, cache});
      });
    }
  }
  await runJobsQueue(tasks, nWorkers=10);

  tasks = [];
  for (const node of data.files.nodes){ 
    if ((node.fields != null) && (node.fields.code_html_filename != null)) {
      tasks.push(async () => {
        const codeFilename = node.absolutePath;
        const codeHTMLFilename = node.fields.code_html_filename;
        await codeToHTML({codeFilename, codeHTMLFilename, cache});
      });
    }
  }
  await runJobsQueue(tasks, nWorkers=10);

  tasks = [];
  for (const node of data.md_pages.nodes){ 
    if ((node.fields != null) && (node.fields.docx_filename != null)) {
      tasks.push(async () => {
        const mdFilename = node.fileAbsolutePath;
        const docxFilename = node.fields.docx_filename;
        await mdToDocx({mdFilename, docxFilename, cache});
      });
    }
  }
  await runJobsQueue(tasks, nWorkers=5);

  for (const node of data.md_pages.nodes){ 
    if (node.fields != null) {
      if (node.fields.print_pdf_filename != null) {
        const args = {'slug': node.fields.slug, 'pdfFilename': node.fields.print_pdf_filename, 'profile': 'page'};
        addPageToPrint(args, node.fileAbsolutePath , cache);
      }
      if (node.fields.slides_pdf_filename != null) {
        const args = {'slug': node.fields.slug + '?print-pdf', 'pdfFilename': node.fields.slides_pdf_filename, 'profile': 'slides'};
        addPageToPrint(args, node.fileAbsolutePath , cache);
      }
      if (node.fields.slides_compact_pdf_filename != null) {
        const args = {'slug': node.fields.slug + '?print-pdf&compact', 'pdfFilename': node.fields.slides_compact_pdf_filename, 'profile': 'slides'};
        addPageToPrint(args, node.fileAbsolutePath , cache);
      }
    }
  }

  let slug;
  let lastByType = {}
  let slugsData = {};
  data.md_pages.nodes.forEach((node) => {
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
  });
}

exports.onPostBuild = async () => {
  const port = 8000;
  const app = express();
  app.use(express.static('public'));
  const server = await new Promise(resolve => {
    console.log(`Temporarily serving site on ${port}`);
    const server = app.listen(port, () => {
      console.log(`Server up`);
      resolve(server);
    })
  });

  await printToPDF(pagesToPrintList);
  
  server.close();
  console.log('Server down')
}

// # Auxiliary functions
// =====================
const getChecksum = (path) => {
  return new Promise(function (resolve, reject) {
    const hash = crypto.createHash('md5');
    const input = fs.createReadStream(path);

    input.on('error', reject);

    input.on('data', function (chunk) {
      hash.update(chunk);
    });

    input.on('close', function () {
      resolve(hash.digest('hex'));
    });
  });
}

const cacheAndRun = async (cache, key, hash, force=True, func) => {
  let obj = await cache.get(key);
  if (force || (obj == null) || (obj.hash != hash)) {
    await func();
    await cache.set(key, {hash})
  }
}

const runJobsQueue = async (tasks, nWorkers=5) => {
  const runWorker = async () => {
    while (tasks.length > 0) {
        task = tasks.shift();
        await task();
    }
  }

  let promisesArray = [];
  for (let i = 0; i < nWorkers; i++) {
    promisesArray.push(runWorker());
  }
  await Promise.all(promisesArray);
}

const copyFile = async ({src, dist}) => {
  console.log(`-> Copying: ${src} -> ${dist}`);
  fs.mkdirSync(path.dirname(dist), { recursive: true });
  fs.copyFile(src, dist, (err) => {if (err) throw err});
}

const copyFileCache = async ({src, dist, cache}) => {
  const cacheKey = `code_to_copy-${src}`;
  const hash = objectHash({src, dist}) + (await getChecksum(src));
  const force = !fs.existsSync(dist);
  await cacheAndRun(cache, cacheKey, hash, force, async () => {await copyFile({src, dist})});
}

const setJupyterCSS = async () => {
  copyFile({'src': `${__dirname}/src/styles/style.css`, 'dist': `${os.homedir()}/.jupyter/custom/custom.css`});
}

const codeToHTML = async ({codeFilename, codeHTMLFilename, cache}) => {
  console.log(`-> Converting: ${codeFilename} -> ${codeHTMLFilename}`);
  const cacheKey = `code_to_html-${codeHTMLFilename}`;
  const hash = objectHash({codeFilename, codeHTMLFilename}) + (await getChecksum(codeFilename));
  const force = !fs.existsSync(codeHTMLFilename);
  await cacheAndRun(cache, cacheKey, hash, force, async () => {
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
  })
}

const mdToDocx = async ({mdFilename, docxFilename, cache}) => {
  console.log(`-> Converting: ${mdFilename} -> ${docxFilename}`);
  const cacheKey = `md_to_docx-${docxFilename}`;
  const hash = objectHash({mdFilename, docxFilename}) + (await getChecksum(mdFilename));
  const force = !fs.existsSync(docxFilename);
  await cacheAndRun(cache, cacheKey, hash, force, async () => {
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
  })
}

const mdToPDF = async ({mdFilename, pdfFilename}) => {
  console.log(`-> Converting: ${mdFilename} -> ${pdfFilename}`);
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

const addPageToPrint = async (args, sourceFilename , cache) => {
  const cacheKey = `print_pdf-${args.pdfFilename}`;
  const hash = objectHash(args) + (await getChecksum(sourceFilename));
  const force = !fs.existsSync(args.pdfFilename);
  await cacheAndRun(cache, cacheKey, hash, force, async () => {await pagesToPrintList.push(args);})
}

const printToPDF = async (pagesToPrintList, nWorkers=1, continuos=false) => {
  await new Promise(resolve => setTimeout(resolve, 10000))
  const runWorker = async () => {
    console.log("Opening browser");
    let browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        headless: true
      });
    let page = await browser.newPage()
    // page.on('error', err => { if (!page.isClosed()) { page.close(); }});

    let url;
    let args;
    let trail;
    while (true) {
      if (pagesToPrintList.length == 0) {
        if (continuos) {
          await new Promise(resolve => setTimeout(resolve, 3000))
          continue;
        } else {
          break;
        }
      }
      args = pagesToPrintList.shift();
      url = 'http://localhost:8000' + args.slug;
      console.log(`-> Printing: ${url} -> ${args.pdfFilename}`);
      fs.mkdirSync(path.dirname(args.pdfFilename), { recursive: true });
      trail=1;
      while(true) {
        try {
          await page.goto(url, { waitUntil: 'networkidle2' });
          await new Promise(resolve => setTimeout(resolve, 3000))
          if (args.profile == 'slides') {
            await page.pdf({
              width: "9.75in",
              height: "8.13in",
              path: args.pdfFilename,
              margin: 0,
              preferCSSPageSize: true,
              printBackground: true
            })
          } else if (args.profile == 'page') {
            await page.pdf({
              format: 'A4',
              path: args.pdfFilename,
              scale: 0.75,
              margin: { left: '0.75in', top: '0.75in', right: '0.75in', bottom: '0.75in' },
              displayHeaderFooter: true,
              headerTemplate: '<div></div>',
              footerTemplate: '<div style="width:100%;margin:0;text-align:center;font-size:12px;font-style:italic;color:#c0c0c0"><span class="pageNumber"></span></div>'
            })
          } else {
            console.log(`-> Unknown print profile ${args.profile}`);
          }
          break;
        } catch(error) {
          try {await browser.close();} catch(error){console.log(`Unable to close the browser`);}
          let browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
            headless: true
          });
          page = await browser.newPage()
          if (trail < 5) {
            trail++;
            console.log(`Error loading "${url}". Trying again. Trail: ${trail}`);
            await new Promise(resolve => setTimeout(resolve, 1000))
          } else {
            console.log(`Error loading "${url}". Will not try again`);
          }
        }
      }
    }
    console.log("Closing browser");
    await browser.close();
  }

  let promisesArray = [];
  for (let i = 0; i < nWorkers; i++) {
    promisesArray.push(runWorker());
  }
  await Promise.all(promisesArray);
  console.log("Finished printing");
}
