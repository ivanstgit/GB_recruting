import { Navigate, Route, Routes } from "react-router-dom"

import { useTranslation } from "react-i18next"

import NavLocal from "../../components/NavigationLocal"
import { ObjectActions } from "../../routes/AppPaths.js"

import EmployerHomePage from "./EmployerHome.js"
import EmployerProfileForm from "./EmployerProfileForm.js"
import EmployerProfilePage from "./EmployerProfile.js"
import { DATA_RESOURCES, PrivateDataContext, dataStatuses, useData } from "../../hooks/DataProvider.js"
import { useEffect, useMemo, useState } from "react"
import { EmployerStatuses } from "../../components/shared/Employer.js"
import { ErrorLabel } from "../../components/common/UICommon.js"
import EmployerVacancyListPage from "./EmployerVacancyList.js"
import EmployerVacancyDetailPage from "./EmployerVacancyDetail.js"
import EmployerVacancyForm from "./EmployerVacancyForm.js"
import { VacancyStatuses } from "../../components/shared/Vacancy.js"
import EmployerCVResponseDetailPage from "./EmployerCVResponseDetail.js"
import EmployerCVResponseForm from "./EmployerCVResponseForm.js"
import EmployerCVResponseListPage from "./EmployerCVResponseList.js"
import EmployerCVListPage from "./EmployerCVList.js"
import EmployerCVDetailPage from "./EmployerCVDetail.js"
import EmployerVacancyResponseListPage from "./EmployerVacancyResponseList.js"
import EmployerVacancyResponseDetailPage from "./EmployerVacancyResponseDetail.js"
import { VacancyResponseStatuses } from "../../components/shared/VacancyResponse.js"

export const EmployerPaths = {
    home: "home/",
    profile: "profile/",
    vacancies: "vacancies/",
    CVs: "cvbase/",
    CVResponses: "cvresponses/",
    vacancyResponses: "vacancyresponse/",
}

const EmployerPage = () => {
    const { t } = useTranslation("Navigation");
    const dataProvider = useData();

    const [status, setStatus] = useState(dataStatuses.initial)
    const [error, setError] = useState("")
    const [vacancyCount, setVacancyCount] = useState(0)
    const [vacancyRejectedCount, setVacancyRejectedCount] = useState(0)
    const [vacancyList, setVacancyList] = useState([])
    const [CVResponseCount, setCVResponseCount] = useState(0)
    const [CVResponseList, setCVResponseList] = useState([])
    const [vacancyResponseCount, setVacancyResponseCount] = useState(0)
    const [vacancyResponsePendingCount, setVacancyResponsePendingCount] = useState(0)
    const [vacancyResponseList, setVacancyResponseList] = useState([])

    const refreshTimeout = 60000

    const profile = dataProvider.employerProfile?.[0] ?? null

    const navLocalItems = [
        {
            link: EmployerPaths.home,
            text: t("Employer.Home"),
        },
        {
            link: EmployerPaths.profile,
            text: t("Employer.Profile"),
            badge: ((profile?.status?.id === EmployerStatuses.rejected)) ? "!" : ""
        },
        {
            link: EmployerPaths.vacancies,
            text: t("Employer.Vacancies"),
            badge: ((vacancyRejectedCount > 0)) ? "!" : ""
        },
        {
            link: EmployerPaths.vacancyResponses,
            text: t("Employer.VacancyResponses"),
            badge: ((vacancyResponsePendingCount > 0)) ? "!" : ""
        },
        {
            link: EmployerPaths.CVs,
            text: t("Employer.CVs"),
        },
        {
            link: EmployerPaths.CVResponses,
            text: t("Employer.CVResponses"),
        },
    ]
    const refreshVacancyList = async () => {
        setStatus(dataStatuses.loading)
        dataProvider.getList(DATA_RESOURCES.vacancies)
            .then((res) => {
                if (res.error) {
                    setVacancyCount(0)
                    setVacancyRejectedCount(0)
                    setVacancyList([])
                    setError(res.error)
                    setStatus(dataStatuses.error)
                } else {
                    setVacancyCount(res.count)
                    setVacancyRejectedCount(res.data.filter(v => (v?.status?.id === VacancyStatuses.rejected)).length)
                    setVacancyList(res.data)
                    setError("")
                    setStatus(dataStatuses.success)
                }
            })
    }
    const refreshCVResponseList = async () => {
        setStatus(dataStatuses.loading)
        dataProvider.getList(DATA_RESOURCES.cvResponses)
            .then((res) => {
                if (res.error) {
                    setCVResponseCount(0)
                    setCVResponseList([])
                    setError(res.error)
                    setStatus(dataStatuses.error)
                } else {
                    setCVResponseCount(res.count)
                    setCVResponseList(res.data)
                    setError("")
                    setStatus(dataStatuses.success)
                }
            })
    }
    const refreshVacancyResponseList = async () => {
        setStatus(dataStatuses.loading)
        dataProvider.getList(DATA_RESOURCES.vacancyResponses)
            .then((res) => {
                if (res.error) {
                    setVacancyResponseCount(0)
                    setVacancyResponsePendingCount(0)
                    setVacancyResponseList([])
                    setError(res.error)
                    setStatus(dataStatuses.error)
                } else {
                    setVacancyResponseCount(res.count)
                    setVacancyResponsePendingCount(res.data.filter(v => (v?.status?.id === VacancyResponseStatuses.pending)).length)
                    setVacancyResponseList(res.data)
                    setError("")
                    setStatus(dataStatuses.success)
                }
            })
    }

    const privateDataContextValue = useMemo(() => ({
        vacancyList,
        vacancyCount,
        vacancyRejectedCount,
        refreshVacancyList,
        vacancyResponseList,
        vacancyResponseCount,
        vacancyResponsePendingCount,
        refreshVacancyResponseList,
        CVResponseList,
        CVResponseCount,
        refreshCVResponseList
        // eslint-disable-next-line
    }), [vacancyList, CVResponseList, vacancyResponseList]);

    useEffect(() => {
        if (status === dataStatuses.initial) {
            refreshVacancyList();
            refreshCVResponseList();
            refreshVacancyResponseList();
        }
        let timer = setTimeout(() => {
            refreshVacancyList();
            refreshCVResponseList();
            refreshVacancyResponseList();
        }, refreshTimeout);
        return () => {
            clearTimeout(timer);
        };
    });

    return (
        <PrivateDataContext.Provider value={privateDataContextValue}>
            <div className="container-xxl py-0">
                <div className="row">
                    <NavLocal items={navLocalItems} />
                    <div className="col p-3">
                        <ErrorLabel errorText={error} />
                        <Routes>
                            <Route index element={<Navigate to={EmployerPaths.home} />} />
                            <Route exact path={EmployerPaths.home} element={<EmployerHomePage />} />

                            <Route exact path={EmployerPaths.profile} element={<EmployerProfilePage />} />
                            <Route exact path={EmployerPaths.profile + ObjectActions.edit} element={<EmployerProfileForm
                                backTo={"../" + EmployerPaths.profile} />} />

                            <Route exact path={EmployerPaths.vacancies} element={<EmployerVacancyListPage />} />
                            <Route exact path={EmployerPaths.vacancies + ":id/"} element={<EmployerVacancyDetailPage
                                backTo={"../" + EmployerPaths.vacancies} />} />
                            <Route exact path={EmployerPaths.vacancies + ObjectActions.add} element={<EmployerVacancyForm
                                backTo={"../" + EmployerPaths.vacancies} />} />
                            <Route exact path={EmployerPaths.vacancies + ":id/" + ObjectActions.edit} element={<EmployerVacancyForm
                                backTo={"../" + EmployerPaths.vacancies} />} />

                            <Route exact path={EmployerPaths.vacancyResponses} element={<EmployerVacancyResponseListPage
                                CVTo={"../" + EmployerPaths.CVs} vacancyTo={"../" + EmployerPaths.vacancies} />} />
                            <Route exact path={EmployerPaths.vacancyResponses + ":id/"} element={<EmployerVacancyResponseDetailPage
                                backTo={"../" + EmployerPaths.vacancyResponses}
                                CVTo={"../" + EmployerPaths.CVs} vacancyTo={"../" + EmployerPaths.vacancies} />} />

                            <Route exact path={EmployerPaths.CVs} element={<EmployerCVListPage
                                respondTo={"../" + EmployerPaths.CVResponses + ObjectActions.add} />} />
                            <Route exact path={EmployerPaths.CVs + ":id/"} element={<EmployerCVDetailPage
                                backTo={"../" + EmployerPaths.CVs} respondTo={"../" + EmployerPaths.CVResponses + ObjectActions.add} />} />

                            <Route exact path={EmployerPaths.CVResponses} element={<EmployerCVResponseListPage
                                CVTo={"../" + EmployerPaths.CVs} vacancyTo={"../" + EmployerPaths.vacancies} />} />
                            <Route exact path={EmployerPaths.CVResponses + ":id/"} element={<EmployerCVResponseDetailPage
                                backTo={"../" + EmployerPaths.CVResponses}
                                CVTo={"../" + EmployerPaths.CVs} vacancyTo={"../" + EmployerPaths.vacancies} />} />
                            <Route exact path={EmployerPaths.CVResponses + ObjectActions.add} element={<EmployerCVResponseForm
                                backTo={"../" + EmployerPaths.CVResponses} />} />

                            <Route element={<EmployerHomePage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </PrivateDataContext.Provider>
    )
}

export default EmployerPage
