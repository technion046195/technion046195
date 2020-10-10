import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"

const Home = ({ data }) => {
  return (
    <Layout type="index" pageTitle='Main'>
      <article dangerouslySetInnerHTML={{ __html: data.index.html }}/>
      <h2>תוכן</h2>
      {data.index.frontmatter.subjects.map(subject => ( 
        <div>
          <h3>{subject.title}</h3>
          <ul>
            {subject.slugs.map(function(slug) { 
              slug = '/' + slug + '/page/'
              const node = data.content.nodes.find(node => node.fields.slug === slug);
              return (
                <li className="content-item">
                  <Link to={node.fields.slug}>{node.headings[0].value}</Link>
                </li>
              )
              })}
          </ul>
        </div>
      ))}
    </Layout>
  )
}

export const query = graphql`
  query {
    index: markdownRemark(frontmatter: {type: {eq: "index"}}) {
      frontmatter {
        subjects {
          title
          slugs
        }
      }
      html
    }
    content: allMarkdownRemark(filter: {frontmatter: {type: {ne: "index"}}}) {
      nodes {
        fields {
          slug
        }
        headings(depth: h1) {
          value
        }
      }
    }
  }
`

export default Home