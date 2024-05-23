import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const AuthRequired = ({ redirectPath, role }) => {
    const auth = useAuth();
    // const location = useLocation();
    // console.log(location)
    if (!auth.isAuthenticated) return <Navigate to={redirectPath} />;
    if (role && (role !== auth.user.role)) return <Navigate to={redirectPath} />;
    return <Outlet />;
};

export default AuthRequired;
