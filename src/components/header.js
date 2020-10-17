import React from "react"
import { useStaticQuery, Link, graphql } from "gatsby"
import { Nav, Navbar } from 'react-bootstrap';

import TechnionLogo from "../../content/assets/technion_logo_white.svg"

const CondNavItem = ({ children, to }) => {
  if (to === 'hide') {
    return (<></>)
  } else if (to === 'disable') {
    return (
      <Nav.Item as="li">
        <Link className="nav-link disabled" to={`/404`}>
          {children}
        </Link>
      </Nav.Item>
    )
  } else {
    return (
      <Nav.Item as="li">
        <Link className="nav-link" to={`${to}`}>
          {children}
        </Link>
      </Nav.Item>
    )
  }
}

const Header = ({prev, next}) => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            courseNumber
          }
        }
      }
    `
  )
  return (
    <Navbar id="site-navbar" expand="md" variant="dark" bg="dark">
      <Link to={`/`}>
        <Navbar.Brand>
          <img src={TechnionLogo} height="30" alt=""/> {data.site.siteMetadata.courseNumber}
        </Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav as="ul" className="ml-auto">
            <CondNavItem to={prev}>&laquo;הקודם</CondNavItem>
            <CondNavItem to={next}>הבא&raquo;</CondNavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

Header.defaultProps = {
  prev: 'hide',
  next: 'hide',
}

export default Header