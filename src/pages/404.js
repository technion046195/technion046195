import React from "react"

import Layout from "../components/layout"

const NotFoundPage = ({ location }) => {
  return (
    <Layout pageTitle="404: עמוד לא קיים" location={location}>
      <h1>404: Not Found</h1>
      <p>העמוד שהגעת אליו אינו קיים</p>
    </Layout>
  )
}

export default NotFoundPage