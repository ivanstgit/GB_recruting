import { Link } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import { useData } from "../../hooks/DataProvider.js";
import { EmployerProfileCard } from "../../components/shared/Employer.js";
import { WarningLabel } from "../../components/common/UICommon.js";
import { EmployerPaths } from "./Employer.js";
import { ObjectActions } from "../../routes/AppPaths.js";

const EmployerProfilePage = () => {
    const { t } = useTranslation("Employer");

    const dataProvider = useData()

    const profile = dataProvider.employerProfile?.[0] ?? null
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
                    <Link to={"../" + EmployerPaths.profile + ObjectActions.edit} className="btn btn-primary">{linkTextProfileAdd}</Link>
                </div>
            </div>
            <EmployerProfileCard profile={profile} />
        </div>

    )
}
export default EmployerProfilePage
