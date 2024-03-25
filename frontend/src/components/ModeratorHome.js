import { Link } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import AppPaths from "../routes/AppPaths.js"
import { userRoles } from "../hooks/AuthProvider.js";

const ModeratorHome = () => {
    const { t } = useTranslation("Employer");
    return (
        <div className="container-xxl py-1">
            <h2> Moderator home </h2>
        </div>

    )
}
export default ModeratorHome