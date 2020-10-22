import React from "react"
import SEO from "../components/seo"
// import { graphql } from "gatsby"

class MoodlePage extends React.Component {
  componentDidMount() {
    var links = document.getElementsByTagName('a');
    var len = links.length;

    for(var i=0; i<len; i++)
    {
      links[i].target = "_blank";
    }
  }

  render() {
    console.log('Render lifecycle')
    return (
      <div className="site-content moodle-data">
        <SEO title="Moodle data" />
        <article dangerouslySetInnerHTML={{ __html: this.props.data.data_moodle.html }}/>
        <article dangerouslySetInnerHTML={{ __html: this.props.data.data_all.html }}/>
      </div>
    )
  }

}

const Home = ({ data }) => {
  return (<MoodlePage data={data}/>)
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