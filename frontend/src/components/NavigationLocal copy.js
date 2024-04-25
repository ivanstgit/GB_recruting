import React from "react";
import { Link, useResolvedPath, useMatch } from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { useAuth, userRoles } from "../hooks/AuthProvider.js";
import AppPaths from "../routes/AppPaths.js"


const NavItem = ({ key, item, index }) => {
  const resolvedPath = useResolvedPath(item.link)
  const isActive = useMatch({ path: resolvedPath.pathname }) ? " active" : " link-dark"
  console.log(resolvedPath.pathname + isActive)

  return (<Link key={key} to={item.link} className={"nav-link" + isActive}>{item.text}</Link>)
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

  const itemsEmployee = [
    {
      link: AppPaths.employee.home,
      text: t("Employee.Home"),
    },
    {
      link: AppPaths.employee.cvs,
      text: t("Employee.CVs"),
    },
  ]

  const auth = useAuth()

  let items = []
  if (auth.user.role === userRoles.moderator) {
    items = itemsModerator
  } else if (auth.user.role === userRoles.employee) {
    items = itemsEmployee
  }

  return (
    <div className="container-xxl py-0">
      {/* <div className="row bg-light">
        <div className="text-center mx-auto mb-1 wow fadeInUp" data-wow-delay="0.1s">
          <h2> {t("Personal")} </h2>
        </div>
      </div> */}
      <div className="row">
        <div className="navbarlocal col-md-auto bg-light p-3 mb-0">
          <span className="fs-5 fw-semibold link-dark">{t("Personal")}</span>
          <nav className="nav-pills d-flex flex-column">
            {items.map((item, index) => <NavItem key={'NavLocItem' + index} item={item} index={index} />)}
          </nav>
        </div>
        <div className="col p-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export default NavLocal
