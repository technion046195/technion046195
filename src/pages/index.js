import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

const Home = ({ data }) => {
  return (
    <Layout type="index" pageTitle='Main'>
      <article dangerouslySetInnerHTML={{ __html: data.index.html }}/>
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