const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const { execSync, spawnSync } = require('child_process');

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
        index: markdownRemark(frontmatter: {type: {eq: "index"}}) {
          frontmatter {
            subjects {
              slugs
            }
          }
        }
        allMarkdownRemark(filter: {frontmatter: {template: {ne: null}}}) {
          nodes {
            fields {
              slug
            }
            frontmatter {
              template
              type
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


  let slugsData = {};
  data.allMarkdownRemark.nodes.forEach((node) => {
    slug = node.fields.slug;
    let type = node.frontmatter.type;
    let template = node.frontmatter.template;
    slugsData[slug] = {type, template,  prev: 'disable', next: 'disable'};
  });

  let lastByType = {}
  data.index.frontmatter.subjects.map(subject => {
    subject.slugs.map(function(slug) { 
      slug = '/' + slug + '/page/';
      if (slugsData[slug] == null) {
        console.log(`!!!! Missing slug: ${slug}`)
      } else {
        let type = slugsData[slug].type;
        if (lastByType[type] != null) {
          slugsData[lastByType[type]].next = slug;
          slugsData[slug].prev = lastByType[type];
        }
        lastByType[type] = slug;
      }
    })
  })

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