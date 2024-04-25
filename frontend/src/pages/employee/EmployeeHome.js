

import { useTranslation } from 'react-i18next';

import { useData } from "../../hooks/DataProvider.js";
import EmployeeProfileCard from "../../components/EmployeeProfileCard.js";
import { WarningLabel } from "../../components/LibUICommon.js";

const EmployeeHomePage = () => {
    const { t } = useTranslation("Employee");

    const dataProvider = useData()

    const profile = dataProvider.employeeProfile?.[0] ?? null
    const emptyProfileText = profile ? "" : t("Profile.emptyWarning")

    return (
        <div>
            <h3> {t("Profile.header")} </h3>

            <div className="row">
                <WarningLabel text={emptyProfileText} />
            </div>

            <EmployeeProfileCard profile={profile} />
        </div>

    )
}
export default EmployeeHomePage
