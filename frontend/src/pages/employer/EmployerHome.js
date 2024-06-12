

import { useTranslation } from 'react-i18next';

import { useData } from "../../hooks/DataProvider.js";
import { EmployerProfileCard, EmployerStatuses } from "../../components/shared/Employer.js";
import { WarningLabel } from "../../components/common/UICommon.js";

const EmployerHomePage = () => {
    const { t } = useTranslation("Employer");

    const dataProvider = useData()

    const profile = dataProvider.employerProfile?.[0] ?? null
    const emptyProfileText = profile ? "" : t("Profile.emptyWarning")
    const rejectedProfileText = (profile?.status?.id === EmployerStatuses.rejected) ? t("Profile.rejectedWarning") : ""

    return (
        <div>
            <h3> {t("Profile.header")} </h3>

            <div className="row">
                <WarningLabel text={emptyProfileText} />
                <WarningLabel text={rejectedProfileText} />
            </div>

            <EmployerProfileCard profile={profile} />
        </div>

    )
}
export default EmployerHomePage
