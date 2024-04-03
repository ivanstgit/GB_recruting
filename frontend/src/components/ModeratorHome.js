import { Link } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import AppPaths from "../routes/AppPaths.js"
import NavLocal from "./NavigationLocal.js";

const ModeratorHome = () => {
    const { t } = useTranslation("Moderator");
    return (
        <NavLocal>
            <h3> {t("Home.header")} </h3>
            <p> {t("Home.content")} </p>
        </NavLocal>

    )
}
export default ModeratorHome