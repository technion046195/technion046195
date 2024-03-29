import React from "react"
import SEO from "../components/seo"
import { graphql, withPrefix } from "gatsby"
import { Helmet } from "react-helmet"

const updateViewSize = () => {
  const adjustedViewHeight = window.innerHeight;
  document.documentElement.style.setProperty('--avh', `${adjustedViewHeight}px`);
}

class RevealJS extends React.Component {
  constructor(props) {
    super(props);
    this.deck = null;
    this.deckRef = React.createRef()
  }

  componentDidUpdate() {
    if (this.deck != null) {
      console.log('Syncing Reveal');
      // this.deck.layout()
      // this.deck.sync()
      this.deck.initialize();
      const indices = this.deck.getIndices()
      this.deck.slide(indices.h, indices.v, indices.f);
    }
  }

  componentDidMount() {
    const component = this
    if(typeof window !== 'undefined' && window.document) {
      updateViewSize();
      window.addEventListener('resize', updateViewSize);
      var compact = window.location.search.substring(1).split("&").includes('compact')
      if (compact) {
        component.deckRef.current.classList.add('compact');
      }

      function revealWrap() {
        if(window.Reveal == null) {
          console.log('Reveal is not loaded. Waiting 0.1s');
          window.setTimeout(revealWrap, 100);
        } else {
          console.log('Running reveal');
          component.deck = new window.Reveal(component.deckRef.current, {})
          component.deck.initialize({
            width: 900,
            height: 750,
            // rtl: true,
            center: false,
            slideNumber: true,
            transition: 'fade',
            // history: true,
            hash: true,
            pdfMaxPagesPerSlide: 1,
            pdfSeparateFragments: (!compact),
            plugins: [ window.RevealNotes ]
          });
        }
      }
      revealWrap();
    }
  }

  render() {
    return (
      <div className="reveal site-style" ref={this.deckRef} dangerouslySetInnerHTML={{ __html: this.props.html }} />
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
        <script src={withPrefix('/reveal.js')} type="text/javascript"></script>
        <script src={withPrefix('/plugin/notes/notes.js')} type="text/javascript"></script>
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