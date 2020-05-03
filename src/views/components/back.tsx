import { useHistory } from "react-router-dom"
import React from "react";

const Back = () => {
  let history = useHistory();
  return (
    <a className="back-link" onClick={() => {
      let pathname = history.location.pathname;
      history.push(pathname.substring(0, pathname.lastIndexOf('/'))) }}>
      Back
    </a>
  )
}
export default Back;
