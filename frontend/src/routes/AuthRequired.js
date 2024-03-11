import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const AuthRequired = (props) => {
    const auth = useAuth();
    if (!auth.isAuthenticated) return <Navigate to={props.redirectPath} />;
    return <Outlet />;
};

export default AuthRequired;
