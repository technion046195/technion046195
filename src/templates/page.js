import React from "react"
import { graphql } from "gatsby"
import "katex/dist/katex.min.css"

import Layout from "../components/layout"

const Page = ({ data, pageContext }) => {
  const title = data.page.headings[0].value;
  const type = data.page.frontmatter.type;
  const { prev, next } = pageContext;
  return (
    <Layout pageTitle={title} type={type} prev={prev} next={next}>
      <article dangerouslySetInnerHTML={{ __html: data.page.html }} />
    </Layout>
  )
}

export default Page;

export const query = graphql`
  query($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        type
      }
      headings(depth: h1) {
        value
      }
      html
    }
  }
`