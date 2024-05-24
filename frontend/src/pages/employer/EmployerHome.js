

import { useTranslation } from 'react-i18next';

import { useData } from "../../hooks/DataProvider.js";
import { EmployerProfileCard } from "../../components/shared/Employer.js";
import { WarningLabel } from "../../components/common/UICommon.js";

const EmployerHomePage = () => {
    const { t } = useTranslation("Employer");

    const dataProvider = useData()

    const profile = dataProvider.employerProfile?.[0] ?? null
    const emptyProfileText = profile ? "" : t("Profile.emptyWarning")

    return (
        <div>
            <h3> {t("Profile.header")} </h3>

            <div className="row">
                <WarningLabel text={emptyProfileText} />
            </div>

            <EmployerProfileCard profile={profile} />
        </div>

    )
}
export default EmployerHomePage
