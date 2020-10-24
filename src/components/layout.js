import React from "react"
import SEO from "./seo"
import Header from "./header"
import Footer from "./footer"

const Layout = ({ children, type, pageTitle, prev, next }) => {
  return (
    <div className={`site-style site-content ${type}-page`}>
      <SEO title={pageTitle} />
      <Header prev={prev} next={next}/>
      <div className="main-content">
        {children}
      </div>
      <Footer/>
    </div>
  )
}

Layout.defaultProps = {
  type: 'base',
  prev: 'hide',
  next: 'hide',
}

export default Layout;