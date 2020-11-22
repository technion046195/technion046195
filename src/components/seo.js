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

      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png"/>
      <link rel="manifest" href="/icons/site.webmanifest"/>
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#006992"/>
      <link rel="shortcut icon" href="/icons/favicon.ico"/>
      <meta name="apple-mobile-web-app-title" content="Technion 046195"/>
      <meta name="application-name" content="Technion 046195"/>
      <meta name="msapplication-TileColor" content="#006699"/>
      <meta name="msapplication-config" content="/icons/browserconfig.xml"/>
      <meta name="theme-color" content="#006992"/>
    </Helmet>
  )
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
}

export default SEO