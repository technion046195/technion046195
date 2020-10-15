import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

const Attributions = ({ data }) => {
  return (
    <Layout type="attrib" pageTitle='Attributions'>
      <div dangerouslySetInnerHTML={{ __html: data.attrib.html }}/>
    </Layout>
  )
}

export const query = graphql`
  query {
    attrib: markdownRemark(frontmatter: {type: {eq: "attrib"}}) {
      html
    }
  }
`

export default Attributions