import React from "react";
import { Link, useResolvedPath, useMatch } from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { useAuth, userRoles } from "../hooks/AuthProvider.js";
import AppPaths from "../routes/AppPaths.js"


const NavItem = ({ key, item, index }) => {
  const resolvedPath = useResolvedPath(item.link)
  const isActive = useMatch({ path: resolvedPath.pathname }) ? " active" : ""
  console.log(resolvedPath.pathname + isActive)

  return (<Link key={key} to={item.link} className={"nav-link " + isActive}>{item.text}</Link>)
}

const NavLocal = ({ children }) => {
  console.log("renders private menu")
  const { t } = useTranslation("Navigation");

  const itemsModerator = [
    {
      link: AppPaths.moderator.home,
      text: t("Moderator.Home"),
    },
    {
      link: AppPaths.moderator.news,
      text: t("Moderator.News"),
    },
  ]

  const auth = useAuth()

  let items = []
  if (auth.user.role === userRoles.moderator) {
    items = itemsModerator
  }

  return (
    <div className="container-xxl py-0">
      <div className="row bg-light">
        <div className="text-center mx-auto mb-1 wow fadeInUp" data-wow-delay="0.1s">
          <h2> {t("Personal")} </h2>
        </div>
      </div>
      <div className="row">
        <div className="col-md-auto bg-light">
          <nav className="nav-pills flex-column">
            {items.map((item, index) => <NavItem key={'NavLocItem' + index} item={item} index={index} />)}
          </nav>
        </div>
        <div className="col">
          {children}
        </div>
      </div>
    </div>
  );
}

export default NavLocal
