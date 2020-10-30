module.exports = {
  siteMetadata: {
    courseNumber: `046195`,
    title: `Technion 046195`,
    description: `Technion course 046195 - Introduction to machine learning`,
    author: `The stuff of 046195`,
    lang:  `he`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `technion046195-intro-to-ml`,
        short_name: `technion046195`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: ` #006992`,
        display: `minimal-ui`,
        icon: `content/assets/technion046195_logo.png`
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
        ignore: [`**/\.*`]
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-katex`,
            options: {
              throwOnError: false,
            }
          },
          `gatsby-remark-external-links`,
          `gatsby-remark-static-images`,
          `gatsby-remark-responsive-iframe`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
        ],
      },
    }
  ],
}

          // {
          //   resolve: `gatsby-remark-images`,
          //   maxWidth: 900,
          //   linkImagesToOriginal: false,
          //   quality: 90,
          // }