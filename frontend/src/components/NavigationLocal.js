import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useResolvedPath, useMatch } from "react-router-dom";

const NavItem = ({ item, index }) => {
  const resolvedPath = useResolvedPath(item.link + "*")
  const isActive = useMatch({ path: resolvedPath.pathname }) ? " active" : " link-dark"
  console.log(resolvedPath.pathname + isActive)

  return (<Link key={"NLL" + index} to={item.link} className={"nav-link" + isActive}>{item.text}</Link>)
}

const NavLocal = ({ items, label }) => {

  const { t } = useTranslation("Navigation")
  const lbl = label ?? t("Personal")

  return (
    <div className="navbarlocal col-md-auto bg-light p-3 mb-0">
      <span className="fs-5 fw-semibold link-dark">{lbl}</span>
      <nav className="nav-pills d-flex flex-column">
        {items.map((item, index) => <NavItem key={'NavLocItem' + index} item={item} index={index} />)}
      </nav>
    </div>
  );
}

export default NavLocal
