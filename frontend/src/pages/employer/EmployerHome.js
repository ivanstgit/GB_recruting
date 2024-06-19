import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { PrivateDataContext, useData } from "../../hooks/DataProvider.js";
import { EmployerStatuses } from "../../components/shared/Employer.js";
import { SuccessIcon, WarningLabel } from "../../components/common/UICommon.js";
import { VacancyStatuses } from '../../components/shared/Vacancy.js';
import { CVResponseStatuses } from '../../components/shared/CVResponse.js';


const EmployerHomePage = () => {
    const { t } = useTranslation("Employer");

    const dataProvider = useData()
    const privateData = useContext(PrivateDataContext)

    const profile = dataProvider.employerProfile?.[0] ?? null
    const emptyProfileText = profile ? "" : t("Profile.emptyWarning")
    const rejectedProfileText = (profile?.status?.id === EmployerStatuses.rejected) ? t("Profile.rejectedWarning") : ""

    const vacancyPublishedCount = privateData?.vacancyList.filter(v => (v?.status?.id === VacancyStatuses.approved)).length ?? 0
    const vacancyRejectedCount = privateData?.vacancyRejectedCount ?? 0
    const vacancyPendingCount = privateData?.vacancyList.filter(v => (v?.status?.id === VacancyStatuses.pending)).length ?? 0
    const rejectedVacancyText = (vacancyRejectedCount > 0) ? t("Vacancies.rejectedWarning") : ""

    const vacancyResponseCount = privateData?.vacancyResponseCount ?? 0
    const vacancyResponsePendingCount = privateData?.vacancyResponsePendingCount ?? 0
    const pendingVacancyResponseText = (vacancyResponsePendingCount) ? t("VacancyResponses.pendingWarning") : ""

    const CVResponseCount = privateData?.CVResponseCount ?? 0
    const CVResponsePendingCount = privateData?.CVResponseList.filter(v => (v?.status?.id === CVResponseStatuses.pending)).length ?? 0


    return (
        <div>
            <h3> {t("Home.header")} </h3>
            <p className="text-ws-pre">{t("Home.description")}</p>

            {/* Profile */}
            <div className="row">
                <div className="col-md-auto">
                    <h4>{t("Profile.header")} </h4>
                </div>
                <div className="col">
                    <SuccessIcon isSuccess={profile?.status?.id === EmployerStatuses.approved} />
                </div>
            </div>
            <WarningLabel text={emptyProfileText} />
            <WarningLabel text={rejectedProfileText} />
            <p className="text-ws-pre">{t("Profile.description")}</p>

            {/* Vacancies */}
            <div className="row">
                <div className="col-md-auto">
                    <h4>{t("Vacancies.header")} </h4>
                </div>
                <div className="col">
                    <SuccessIcon isSuccess={(vacancyPublishedCount) > 0} />
                </div>
            </div>
            <WarningLabel text={rejectedVacancyText} />
            <p className="">
                {t("Home.Vacancies.published")}: {vacancyPublishedCount}
                , {t("Home.Vacancies.pending")}: {vacancyPendingCount}
                , {t("Home.Vacancies.rejected")}: {vacancyRejectedCount}</p>
            <p className="text-ws-pre">{t("Vacancies.description")}</p>

            {/* VacancyResponses */}
            <div className="row">
                <div className="col-md-auto">
                    <h4>{t("VacancyResponses.header")} </h4>
                </div>
                <div className="col">
                </div>
            </div>
            <WarningLabel text={pendingVacancyResponseText} />
            <p className=""> {t("Home.VacancyResponses.received")}: {vacancyResponseCount}
                , {t("Home.VacancyResponses.pending")}: {vacancyResponsePendingCount} </p>
            <p className="text-ws-pre">{t("VacancyResponses.description")}</p>

            {/* CVs */}
            <div className="row">
                <div className="col-md-auto">
                    <h4>{t("CVs.header")} </h4>
                </div>
                <div className="col">
                </div>
            </div>
            <p className="text-ws-pre">{t("CVs.description")}</p>

            {/* CVResponses */}
            <div className="row">
                <div className="col-md-auto">
                    <h4>{t("CVResponses.header")} </h4>
                </div>
                <div className="col">
                </div>
            </div>
            <p className=""> {t("Home.CVResponses.sent")}: {CVResponseCount}
                , {t("Home.CVResponses.pending")}: {CVResponsePendingCount} </p>
            <p className="text-ws-pre">{t("CVResponses.description")}</p>

        </div>

    )
}
export default EmployerHomePage
