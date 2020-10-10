import React from "react"
import { Link } from "gatsby"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <Link to={`/attrib`}>Attributions</Link>
      </div>
    </footer>
  )
}

export default Footer