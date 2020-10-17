const express = require('express')
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const { spawnSync } = require('child_process');

exports.onCreateDevServer=({app})=>{
    app.use(express.static('public'))
}

exports.onPreInit = (_, pluginOptions) => {
  const spawn = spawnSync(`./prebuild.sh`, [], {stdio: ['inherit', 'inherit', 'pipe']});
  if (spawn.stderr.length) {
    console.log(`Error: stderr:  ${spawn.stderr.toString()}`);
    process.exit(1)
  }
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
          sort: { order: ASC, fields: [frontmatter___order] },
          filter: {frontmatter: {template: {ne: null}}}
          ) {
            nodes {
              fields {
                slug
              }
              frontmatter {
                template
                type
                order
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
    let type = node.frontmatter.type;
    let order = node.frontmatter.order;
    let template = node.frontmatter.template;
    slugsData[slug] = {type, template,  prev: 'disable', next: 'disable'};

    if (order != null) {
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