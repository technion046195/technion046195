import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

const SEO = ({ title }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            lang
          }
        }
      }
    `
  )

  return (
    <Helmet
      titleTemplate={`${site.siteMetadata.title} | %s`}
      title={title}
    >
      {/* General tags */}
      <meta name="description" content={site.siteMetadata.description} />

      {/* OpenGraph tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={site.siteMetadata.description} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={site.siteMetadata.author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={site.siteMetadata.description} />
      <html lang={site.siteMetadata.lang} dir="rtl" />
    </Helmet>
  )
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
}

export default SEO