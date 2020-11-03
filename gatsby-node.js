const express = require('express')
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const puppeteer = require('puppeteer')
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

var codeToCopyList = [];
var codeToHTMLList = [];
var pagesToDocxList = [];
var pagesToPrintList = [];

require('events').EventEmitter.prototype._maxListeners = 70;
require('events').defaultMaxListeners = 70;

exports.onCreateDevServer = ({ app }) => {
    app.use(express.static('public'));
    generateExtras();
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
      slug: String!
      code_copy_filename: String!
      code_html_filename: String!
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
      slug: String!
      docx_filename: String!
      print_pdf_filename: String!
      slides_pdf_filename: String!
      slides_compact_pdf_filename: String!
    }
  `
  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `File` & node.ext == '.ipynb') {
    try {
      const gatsby_data = JSON.parse(fs.readFileSync(node.absolutePath)).metadata.gatsby_data;
      if (gatsby_data != null) {
        const slug = createFilePath({ node, getNode })
        createNodeField({
          node,
          name: `slug`,
          value: slug
        })
        if ((gatsby_data.make_public != null) & gatsby_data.make_public){
          let codeCopyFilename = `${__dirname}/public/assets/${slug.slice(1, -1).replace(/\//g,'_')}.ipynb`
          createNodeField({
            node,
            name: `code_copy_filename`,
            value: codeCopyFilename
          })
          codeToCopyList.push({'src': node.absolutePath, 'dist': codeCopyFilename})
        }
        if ((gatsby_data.make_html != null) & gatsby_data.make_html){
          let codeHTMLFilename = `${__dirname}/public${slug}index.html`
          createNodeField({
            node,
            name: `code_html_filename`,
            value: codeHTMLFilename
          })
          codeToHTMLList.push({'codeFilename': node.absolutePath, codeHTMLFilename});
        }
      }
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
      pagesToDocxList.push({'mdFilename': node.fileAbsolutePath, docxFilename})
    }
    if ((node.frontmatter.print_pdf != null) & node.frontmatter.print_pdf){
      let printPDFFilename = `${__dirname}/public/assets/${slug.slice(1,-1).replace(/\//g,'_')}.pdf`
      createNodeField({
        node,
        name: `print_pdf_filename`,
        value: printPDFFilename
      })
      pagesToPrintList.push({'slug': slug, 'pdfFilename': printPDFFilename, 'profile': 'page'})
    }
    if ((node.frontmatter.slides_pdf != null) & node.frontmatter.slides_pdf){
      let slidesPDFFilename = `${__dirname}/public/assets/${slug.slice(1,-1).replace(/\//g,'_')}_deck.pdf`
      createNodeField({
        node,
        name: `slides_pdf_filename`,
        value: slidesPDFFilename
      })
      pagesToPrintList.push({'slug': slug + '?print-pdf', 'pdfFilename': slidesPDFFilename, 'profile': 'slides'})
      let slidesCompactPDFFilename = `${__dirname}/public/assets/${slug.slice(1,-1).replace(/\//g,'_')}.pdf`
      createNodeField({
        node,
        name: `slides_compact_pdf_filename`,
        value: slidesCompactPDFFilename
      })
      pagesToPrintList.push({'slug': slug + '?print-pdf&compact', 'pdfFilename': slidesCompactPDFFilename, 'profile': 'slides'})
    }
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
    if (result.errors) { throw result.errors; }
  const data = result.data;
  let slug;
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

  await generateExtras();
  
  if (server != null){
    server.close();
    console.log('Server down')
  }
}

// # Auxiliary functions
// =====================
generateExtras = async () => {
  console.log('-> Generating extras');
  await new Promise(resolve => setTimeout(resolve, 10000))
  let promisesArray = [];
  let args;
  while (codeToCopyList.length>0) {
    args = codeToCopyList.pop()
    promisesArray.push(copyFile(args))
  }
  while (codeToHTMLList.length>0) {
    args = codeToHTMLList.pop()
    promisesArray.push(codeToHTML(args))
  }
  while (pagesToDocxList.length>0) {
    args = pagesToDocxList.pop()
    promisesArray.push(mdToDocx(args))
  }
  while (pagesToPrintList.length>0) {
    args = pagesToPrintList.pop()
    promisesArray.push(printToPDF(args))
  }
  await Promise.all(promisesArray);
  console.log('-> Extras generated');
}

const copyFile = async ({src, dist}) => {
  console.log(`-> Copying: ${src} -> ${dist}`);
  fs.mkdirSync(path.dirname(dist), { recursive: true });
  fs.copyFile(src, dist, (err) => {if (err) throw err});
}

const setJupyterCSS = async () => {
  copyFile({'src': `${__dirname}/src/styles/style.css`, 'dist': `${os.homedir()}/.jupyter/custom/custom.css`});
}

const codeToHTML = async ({codeFilename, codeHTMLFilename}) => {
  console.log(`-> Converting: ${codeFilename} -> ${codeHTMLFilename}`);
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
}

const mdToDocx = async ({mdFilename, docxFilename}) => {
  console.log(`-> Converting: ${mdFilename} -> ${docxFilename}`);
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

const printToPDF = async ({slug, pdfFilename, profile='page'}) => {
  const url = 'http://localhost:8000' + slug;
  console.log(`-> Printing: ${url} -> ${pdfFilename}`);
  fs.mkdirSync(path.dirname(pdfFilename), { recursive: true });
  let trail = 1
  while(true) {
    let browser;
    try {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
      });
      const page = await browser.newPage()
      console.log(`    -> Going to: ${url}`);
      // page.on('error', err => { 
      //   try {
      //     if (!page.isClosed()) { page.close(); }
      //   } catch(error){
      //     console.log(`Unable to close page`);
      //   }
      // });
      await page.goto(url, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 20000))
      console.log(`    -> Printing: ${url}`);
      if (profile == 'slides') {
        await page.pdf({
          width: "9.75in",
          height: "8.13in",
          path: pdfFilename,
          margin: 0,
          preferCSSPageSize: true,
          printBackground: true
        })
      } else if (profile == 'page') {
        await page.pdf({
          format: 'A4',
          path: pdfFilename,
          scale: 0.75,
          margin: { left: '0.75in', top: '0.75in', right: '0.75in', bottom: '0.75in' },
          displayHeaderFooter: true,
          headerTemplate: '<div></div>',
          footerTemplate: '<div style="width:100%;margin:0;text-align:center;font-size:12px;font-style:italic;color:#c0c0c0"><span class="pageNumber"></span></div>'
        })
      } else {
        console.log(`-> Unknown print profile ${profile}`);
      }
      await browser.close();
      break;
    }
    catch(error){
      try {
        await browser.close();
      } catch(error){
        console.log(`Unable to close the browser`);
      }
      if (trail < 10) {
        trail++;
        console.log(`Error loading "${url}". Trying again. Trail: ${trail}`);
        await new Promise(resolve => setTimeout(resolve, 1000))
      } else {
        console.log(`Error loading "${url}". Will not try again`);
        break;
      }
    }
  }
}
