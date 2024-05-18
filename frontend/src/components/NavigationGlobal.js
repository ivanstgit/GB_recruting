import React from "react";
import { Link, useResolvedPath, useMatch } from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { useAuth } from "../hooks/AuthProvider.js";
import AppPaths from "../routes/AppPaths.js"

const LoginArea = () => {
  const auth = useAuth();
  const { t } = useTranslation("Navigation");

  if (auth.isAuthenticated) {
    return (
      <div>
        <button className="btn btn-primary rounded-0 py-4 px-lg-5 d-none d-lg-block"
          onClick={auth.logOutFunc} >{auth.user.username} <u>{t("SignOut")}</u>
        </button>
      </div>
    )
  } else {
    return (
      <div>
        <Link className="btn btn-primary rounded-0 py-4 px-lg-5 d-none d-lg-block border-bottom"
          key="MenuLogout" to={AppPaths.signin}>{t("Sign In")}</Link>
      </div>
    )
  }

}
const NavItem = ({ index, item }) => {
  const resolvedPath = useResolvedPath(item.link)
  const isActive = useMatch({ path: resolvedPath.pathname }) ? " active" : ""
  // const isActive = useMatch({ path: resolvedPath.pathname, pattern: item.pattern }) ? " active" : ""
  // console.log(resolvedPath.pathname + isActive)

  return (<Link key={"GN" + index} to={item.link} className={"nav-item nav-link" + isActive}>{item.text}</Link>)
}

const NavGlobal = () => {
  // console.log("renders menu")
  const { t } = useTranslation("Navigation");

  const auth = useAuth()
  const personalPath = auth.personalPathFunc()

  const items = [
    {
      link: AppPaths.news,
      text: t("News"),
      pattern: AppPaths.news,
    },
    {
      link: AppPaths.cvs,
      text: t("CVs"),
      pattern: AppPaths.cvs
    },
    {
      link: AppPaths.vacancies,
      text: t("Vacancies"),
      pattern: AppPaths.vacancies,
    },
    {
      link: personalPath,
      text: t("Personal"),
      pattern: personalPath + '*',
    }
  ]

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0 wow fadeIn shadow-sm">

      <Link className="navbar-brand d-flex align-items-center px-4 px-lg-5" key={'MenuLogo'} to={AppPaths.home}>
        <h2 className="m-0 text-primary">{t('Recruting')}</h2>
      </Link>
      <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto p-4 p-lg-0">

          {items.map((item, index) => <NavItem key={'NavGlobItem' + index} item={item} index={index} />)}

        </div>
        <LoginArea />
      </div>
    </nav>
  );
}

export default NavGlobal
