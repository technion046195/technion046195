import React from "react"
import SEO from "../components/seo"
// import { graphql } from "gatsby"

const Home = ({ data }) => {
  return (
    <div className="site-content moodle-data">
      <SEO title="Moodle data" />
      <article dangerouslySetInnerHTML={{ __html: data.data_moodle.html }}/>
      <article dangerouslySetInnerHTML={{ __html: data.data_all.html }}/>
    </div>
  )
}

export const query = graphql`
  query {
    data_moodle: markdownRemark(fields: { slug: { eq: "/data_moodle/" } }) {
      html
    }
    data_all: markdownRemark(fields: { slug: { eq: "/data_all/" } }) {
      html
    }
  }
`
export default Home