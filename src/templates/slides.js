import React from "react"
import SEO from "../components/seo"
import { graphql, withPrefix } from "gatsby"
import { Helmet } from "react-helmet"

class RevealJS extends React.Component {
  componentDidMount() {
    if(typeof window !== 'undefined' && window.document) {
      function revealWrap() {
        if(window.Reveal == null) {
          console.log('Reveal is not loaded. Waiting 0.1s');
          window.setTimeout(revealWrap, 100);
        } else {
          console.log('Running reveal');
          window.Reveal.initialize({
            width: 900,
            height: 750,
            // rtl: true,
            center: false,
            slideNumber: true,
            transition: 'fade',
            // history: true
          });
        }
      }
      revealWrap();
    }
  }

  render() {
    return (
      <div className="reveal site-style" dangerouslySetInnerHTML={{ __html: this.props.html }} />
    )
  }
}

const Slides = ({ data }) => {
  const title = data.slides.headings[0].value;
  const type = data.slides.frontmatter.type;
  return (
    <div className={`site-slides ${type}-slides`}>
      <SEO title={title} />
      <Helmet>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/github.min.css" />
        <script src={withPrefix('reveal.js')} type="text/javascript"></script>
      </Helmet>
      <RevealJS html={data.slides.html}/>
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