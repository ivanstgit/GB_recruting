import React from "react";
import { Link, useResolvedPath, useMatch } from "react-router-dom";

import { useAuth } from "../hooks/AuthProvider";
import AppPaths from "../routes/AppPaths.js"

const LoginArea = () => {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return (
      <div>
        <button className="btn btn-primary rounded-0 py-4 px-lg-5 d-none d-lg-block"
          onClick={auth.logOutFunc} >{auth.login} <u>(logout)</u>
        </button>
      </div>
    )
  } else {
    return (
      <div>
        <Link className="btn btn-primary rounded-0 py-4 px-lg-5 d-none d-lg-block border-bottom"
          key="MenuLogout" to={AppPaths.login}>Sign in</Link>
      </div>
    )
  }

}
const MenuItem = ({ item, index }) => {
  const resolvedPath = useResolvedPath(item.link)
  const isActive = useMatch({ path: resolvedPath.pathname }) ? " active" : ""
  // console.log(resolvedPath.pathname + isActive)

  return (<Link key={'MenuItem_' + index} to={item.link} className={"nav-item nav-link" + isActive}>{item.text}</Link>)
}

const MenuItems = () => {

  const items = [
    {
      link: AppPaths.users,
      text: 'Users',
    },
    {
      link: AppPaths.cvs,
      text: 'CVs',
    },
    {
      link: AppPaths.vacancies,
      text: 'Vacancies',
    }
  ]

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0 wow fadeIn shadow-sm">

      <Link className="navbar-brand d-flex align-items-center px-4 px-lg-5" key={'MenuLogo'} to={"/"}>
        <h1 className="m-0 text-primary">Recruting</h1>
      </Link>
      <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto p-4 p-lg-0">

          {items.map((item, index) => <MenuItem key={'MenuItem' + index} item={item} index={index} />)}

        </div>
        <LoginArea />
      </div>
    </nav>
  );
}

export default MenuItems