

import { useTranslation } from 'react-i18next';

import { PrivateDataContext, useData } from "../../hooks/DataProvider.js";
import { SuccessIcon, WarningLabel } from "../../components/common/UICommon.js";
import { useContext } from 'react';
import { CVStatuses } from '../../components/shared/CV.js';
import { VacancyResponseStatuses } from '../../components/shared/VacancyResponse.js';

const EmployeeHomePage = () => {
    const { t } = useTranslation("Employee");

    const dataProvider = useData()
    const privateData = useContext(PrivateDataContext)

    const profile = dataProvider.employeeProfile?.[0] ?? null
    const emptyProfileText = profile ? "" : t("Profile.emptyWarning")

    const CVPublishedCount = privateData?.CVList.filter(v => (v?.status?.id === CVStatuses.approved)).length ?? 0
    const CVRejectedCount = privateData?.CVRejectedCount ?? 0
    const CVPendingCount = privateData?.CVList.filter(v => (v?.status?.id === CVStatuses.pending)).length ?? 0
    const CVRejectedText = (CVRejectedCount > 0) ? t("CVs.rejectedWarning") : ""

    const CVResponseCount = privateData?.CVResponseCount ?? 0
    const CVResponsePendingCount = privateData?.CVResponsePendingCount ?? 0
    const pendingCVResponseText = (CVResponsePendingCount) ? t("CVResponses.pendingWarning") : ""

    const vacancyResponseCount = privateData?.vacancyResponseCount ?? 0
    const vacancyResponsePendingCount = privateData?.vacancyResponseList.filter(v => (v?.status?.id === VacancyResponseStatuses.pending)).length ?? 0

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
                    <SuccessIcon isSuccess={profile?.status?.id} />
                </div>
                <WarningLabel text={emptyProfileText} />
                <p className="text-ws-pre">{t("Profile.description")}</p>
            </div>

            {/* CVs */}
            <div className="row">
                <div className="col-md-auto">
                    <h4>{t("CVs.header")} </h4>
                </div>
                <div className="col">
                    <SuccessIcon isSuccess={(CVPublishedCount) > 0} />
                </div>
            </div>
            <WarningLabel text={CVRejectedText} />
            <p className="">
                {t("Home.CVs.published")}: {CVPublishedCount}
                , {t("Home.CVs.pending")}: {CVPendingCount}
                , {t("Home.CVs.rejected")}: {CVRejectedCount}</p>
            <p className="text-ws-pre">{t("CVs.description")}</p>

            {/* CVResponses */}
            <div className="row">
                <div className="col-md-auto">
                    <h4>{t("CVResponses.header")} </h4>
                </div>
                <div className="col">
                </div>
            </div>
            <WarningLabel text={pendingCVResponseText} />
            <p className=""> {t("Home.CVResponses.received")}: {CVResponseCount}
                , {t("Home.CVResponses.pending")}: {CVResponsePendingCount} </p>
            <p className="text-ws-pre">{t("CVResponses.description")}</p>

            {/* Vacancies */}
            <div className="row">
                <div className="col-md-auto">
                    <h4>{t("Vacancies.header")} </h4>
                </div>
                <div className="col">
                </div>
            </div>
            <p className="text-ws-pre">{t("Vacancies.description")}</p>

            {/* VacancyResponses */}
            <div className="row">
                <div className="col-md-auto">
                    <h4>{t("VacancyResponses.header")} </h4>
                </div>
                <div className="col">
                </div>
            </div>
            <p className=""> {t("Home.VacancyResponses.sent")}: {vacancyResponseCount}
                , {t("Home.VacancyResponses.pending")}: {vacancyResponsePendingCount} </p>
            <p className="text-ws-pre">{t("VacancyResponses.description")}</p>

        </div>

    )
}
export default EmployeeHomePage
