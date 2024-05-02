import { Link } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import { useData } from "../../hooks/DataProvider.js";
import EmployeeProfileCard from "../../components/shared/Employee.js";
import { WarningLabel } from "../../components/common/UICommon.js";
import { EmployeePaths } from "./Employee.js";
import { ObjectActions } from "../../routes/AppPaths.js";

const EmployeeProfilePage = () => {
    const { t } = useTranslation("Employee");

    const dataProvider = useData()

    const profile = dataProvider.employeeProfile?.[0] ?? null
    const emptyProfileText = profile ? "" : t("Profile.emptyWarning")
    const linkTextProfileAdd = profile ? t("Profile.actions.edit") : t("Profile.actions.create")

    return (
        <div>
            <h3> {t("Profile.header")} </h3>

            <div className="row">
                <WarningLabel text={emptyProfileText} />
            </div>

            <div className="row">
                <div className="col-6">
                    <Link to={"../" + EmployeePaths.profile + ObjectActions.edit} className="btn btn-primary">{linkTextProfileAdd}</Link>
                </div>
            </div>
            <EmployeeProfileCard profile={profile} />
        </div>

    )
}
export default EmployeeProfilePage
