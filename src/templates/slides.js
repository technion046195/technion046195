import React from "react"
import Reveal from "reveal.js"
import SEO from "../components/seo"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"

class RevealJS extends React.Component {
  componentDidMount() {
    Reveal.initialize({
      width: 900,
      height: 750,
      // rtl: true,
      center: false,
      slideNumber: true,
      transition: 'fade',
      history: true
    });
  }

  render() {
    return (
      <div className={`site-slides ${this.props.type}-slides`}>
        <SEO title={this.props.title} />
        <Helmet>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/github.min.css" />
        </Helmet>
        <div className="reveal" id="reveal-top">
          {this.props.children}
        </div>
      </div>
    )
  }
}

const Slides = ({ data }) => {
  console.log(data);
  const title = data.slides.headings[0].value;
  const type = data.slides.frontmatter.type;
  return (
    <RevealJS title={title} type={type}>
      <div className="slides site-style" dangerouslySetInnerHTML={{ __html: data.slides.html }} />
    </RevealJS>
  )
}

export default Slides

export const query = graphql`
  query($slug: String!) {
    slides: markdownRemark(fields: { slug: { eq: $slug } }) {
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