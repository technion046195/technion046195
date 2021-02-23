import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

const CheatSheet = ({ data }) => {
  return (
    <Layout type="cheat-sheet" pageTitle='Cheat Sheet'>
      <div dangerouslySetInnerHTML={{ __html: data.cheat_sheet.html }}/>
    </Layout>
  )
}

export const query = graphql`
  query {
    cheat_sheet: markdownRemark(frontmatter: {type: {eq: "cheat-sheet"}}) {
      html
    }
  }
`

export default CheatSheet