import { Link } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import AppPaths from "../routes/AppPaths.js"
import { userRoles } from "../hooks/AuthProvider.js";

const EmployeeHome = () => {
    const { t } = useTranslation("Employee");
    return (
        <div className="container-xxl py-1">
            <h2> Employee home </h2>
        </div>

    )
}
export default EmployeeHome
