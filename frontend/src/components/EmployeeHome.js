import { Link } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import NavLocal from "./NavigationLocal.js";
import EmployeeProfileCard from "./EmployeeProfileCard.js";
import { useData } from "../hooks/DataProvider.js";
import { WarningLabel } from "./LibUICommon.js";
import AppPaths from "../routes/AppPaths.js";

const EmployeeHome = () => {
    const { t } = useTranslation("Employee");

    const dataProvider = useData()

    const profile = dataProvider.employeeProfile?.[0] ?? null
    const emptyProfileText = profile ? "" : t("Profile.emptyWarning")
    const linkTextProfileAdd = profile ? t("Profile.actions.edit") : t("Profile.actions.create")

    return (
        <NavLocal>
            <h3> {t("Profile.header")} </h3>

            <div className="row">
                <WarningLabel text={emptyProfileText} />
            </div>

            <div className="row">
                <div className="col-6">
                    <Link to={AppPaths.employee.profile} className="btn btn-primary">{linkTextProfileAdd}</Link>
                </div>
            </div>
            <EmployeeProfileCard profile={profile} />
        </NavLocal>

    )
}
export default EmployeeHome
