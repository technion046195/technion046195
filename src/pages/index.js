import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

const Home = ({ data }) => {
  return (
    <Layout type="index" pageTitle='Main'>
      <article dangerouslySetInnerHTML={{ __html: data.data_site.html }}/>
      <article dangerouslySetInnerHTML={{ __html: data.toc.html }}/>
    </Layout>
  )
}

export const query = graphql`
  query {
    data_site: markdownRemark(fields: { slug: { eq: "/data_site/" } }) {
      html
    }
    toc: markdownRemark(fields: { slug: { eq: "/toc/" } }) {
      html
    }
  }
`

export default Home