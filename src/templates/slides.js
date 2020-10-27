import React, { useEffect } from "react"
import SEO from "../components/seo"
import { withPrefix, graphql } from "gatsby"
import { Helmet } from "react-helmet"

const Slides = ({ data }) => {
  useEffect(() => {
    if(typeof window !== 'undefined' && window.document) {
      function revealWrap() {
        if(window.Reveal == null) {
          window.setTimeout(revealWrap, 100); /* this checks the flag every 100 milliseconds*/
        } else {
          window.Reveal.initialize({
            width: 900,
            height: 750,
            // rtl: true,
            center: false,
            slideNumber: true,
            transition: 'fade',
            history: true
          });
        }
      }
      revealWrap();
    }
    // const initReveal = require('./init_reveal.js')
  }, [])

  const title = data.slides.headings[0].value;
  const type = data.slides.frontmatter.type;
  return (
    <div className={`site-slides ${type}-slides`}>
      <SEO title={title} />
      <Helmet>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/github.min.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.1.0/reveal.js"></script>
        <script src={withPrefix('init_reveal.js')} type="text/javascript"></script>
      </Helmet>
      <div className="reveal" id="reveal-top">
        <div className="slides site-style" dangerouslySetInnerHTML={{ __html: data.slides.html }} />
      </div>
    </div>
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