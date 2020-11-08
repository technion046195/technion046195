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
      htmlAttributes={{ lang: site.siteMetadata.lang, dir: 'rtl' }}
      title={title}
      titleTemplate={`${site.siteMetadata.title} | %s`}
      meta={[
        {
          name: `description`,
          content: site.siteMetadata.description,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: site.siteMetadata.description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: site.siteMetadata.description,
        },
        {
          name: `Cache-Control"`,
          content: `no-cache, no-store, must-revalidate`
        },
        {
          name: `Pragma`,
          content: `no-cache`
        },
        {
          name: `Expires`,
          content: `0`
        },
      ]}
    />
  )
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
}

export default SEO