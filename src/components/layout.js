import React from "react"
import SEO from "./seo"
import Header from "./header"
import Footer from "./footer"

const Layout = ({ children, type, pageTitle, prev, next, slides }) => {
  return (
    <div className={`content-page ${type}-page`}>
      <SEO title={pageTitle} />
      <Header prev={prev} next={next} slides={slides}/>
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
  slides: 'hide',
}

export default Layout;