import { useEffect, useMemo, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { useTranslation } from "react-i18next"

import NavLocal from "../../components/NavigationLocal"
import { ObjectActions } from "../../routes/AppPaths.js"
import { DATA_RESOURCES, PrivateDataContext, dataStatuses, useData } from "../../hooks/DataProvider.js"

import EmployeeHomePage from "./EmployeeHome.js"
import EmployeeProfileForm from "./EmployeeProfileForm.js"
import EmployeeProfilePage from "./EmployeeProfile.js"
import EmployeeCVListPage from "./EmployeeCVList.js"
import EmployeeCVForm from "./EmployeeCVForm.js"
import EmployeeCVDetailPage from "./EmployeeCVDetail.js"
import { CVStatuses } from "../../components/shared/CV.js"
import { ErrorLabel } from "../../components/common/UICommon.js"
import EmployeeVacancyListPage from "./EmployeeVacancyList.js"
import EmployeeVacancyDetailPage from "./EmployeeVacancyDetail.js"
import EmployeeCVResponseListPage from "./EmployeeCVResponseList.js"
import EmployeeCVResponseDetailPage from "./EmployeeCVResponseDetail.js"
import EmployeeVacancyResponseListPage from "./EmployeeVacancyResponseList.js"
import EmployeeVacancyResponseDetailPage from "./EmployeeVacancyResponseDetail.js"
import EmployeeVacancyResponseForm from "./EmployeeVacancyResponseForm.js"
import { CVResponseStatuses } from "../../components/shared/CVResponse.js"


export const EmployeePaths = {
    home: "home/",
    profile: "profile/",
    CVs: "cv/",
    CVResponses: "cvresponse/",
    vacancies: "vacancybase/",
    vacancyResponses: "vacancyresponse/",
}

const EmployeePage = () => {
    const { t } = useTranslation("Navigation");

    const dataProvider = useData();

    const [status, setStatus] = useState(dataStatuses.initial)
    const [error, setError] = useState("")
    const [CVCount, setCVCount] = useState(0)
    const [CVRejectedCount, setCVRejectedCount] = useState(0)
    const [CVList, setCVList] = useState([])
    const [CVResponseCount, setCVResponseCount] = useState(0)
    const [CVResponsePendingCount, setCVResponsePendingCount] = useState(0)
    const [CVResponseList, setCVResponseList] = useState([])
    const [vacancyResponseCount, setVacancyResponseCount] = useState(0)
    const [vacancyResponseList, setVacancyResponseList] = useState([])

    const refreshTimeout = 600000

    const navLocalItems = [
        {
            link: EmployeePaths.home,
            text: t("Employee.Home"),
        },
        {
            link: EmployeePaths.profile,
            text: t("Employee.Profile"),
        },
        {
            link: EmployeePaths.CVs,
            text: t("Employee.CVs"),
            badge: ((CVRejectedCount > 0)) ? "!" : ""
        },
        {
            link: EmployeePaths.CVResponses,
            text: t("Employee.CVResponses"),
            badge: ((CVResponsePendingCount > 0)) ? "!" : ""
        },
        {
            link: EmployeePaths.vacancies,
            text: t("Employee.Vacancies"),
        },
        {
            link: EmployeePaths.vacancyResponses,
            text: t("Employee.VacancyResponses"),
        },
    ]

    const refreshCVList = async () => {
        setStatus(dataStatuses.loading)
        dataProvider.getList(DATA_RESOURCES.cvs)
            .then((res) => {
                if (res.error) {
                    setCVList([])
                    setCVCount(0)
                    setCVRejectedCount(0)
                    setError(res.error)
                    setStatus(dataStatuses.error)
                } else {
                    setCVList(res.data)
                    setCVRejectedCount(res.data.filter(v => (v?.status?.id === CVStatuses.rejected)).length)
                    setCVList(res.data)
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
                    setCVResponsePendingCount(0)
                    setCVResponseList([])
                    setError(res.error)
                    setStatus(dataStatuses.error)
                } else {
                    setCVResponseCount(res.count)
                    setCVResponsePendingCount(res.data.filter(v => (v?.status?.id === CVResponseStatuses.pending)).length)
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
                    setVacancyResponseList([])
                    setError(res.error)
                    setStatus(dataStatuses.error)
                } else {
                    setVacancyResponseCount(res.count)
                    setVacancyResponseList(res.data)
                    setError("")
                    setStatus(dataStatuses.success)
                }
            })
    }

    const privateDataContextValue = useMemo(() => ({
        CVList,
        CVCount,
        CVRejectedCount,
        refreshCVList,
        CVResponseList,
        CVResponseCount,
        CVResponsePendingCount,
        refreshCVResponseList,
        vacancyResponseList,
        vacancyResponseCount,
        refreshVacancyResponseList,
        // eslint-disable-next-line
    }), [CVList, CVResponseList, vacancyResponseList]);

    useEffect(() => {
        if (status === dataStatuses.initial) {
            refreshCVList();
            refreshCVResponseList();
            refreshVacancyResponseList();
        }
        let timer = setTimeout(() => {
            refreshCVList();
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
                            <Route index element={<Navigate to={EmployeePaths.home} />} />
                            <Route exact path={EmployeePaths.home} element={<EmployeeHomePage />} />
                            <Route exact path={EmployeePaths.profile} element={<EmployeeProfilePage />} />
                            <Route exact path={EmployeePaths.profile + ObjectActions.edit} element={<EmployeeProfileForm />} />

                            <Route exact path={EmployeePaths.CVs} element={<EmployeeCVListPage />} />
                            <Route exact path={EmployeePaths.CVs + ":id/"} element={<EmployeeCVDetailPage
                                backTo={"../" + EmployeePaths.CVs} />} />
                            <Route exact path={EmployeePaths.CVs + ObjectActions.add} element={<EmployeeCVForm
                                backTo={"../" + EmployeePaths.CVs} />} />
                            <Route exact path={EmployeePaths.CVs + ":id/" + ObjectActions.edit} element={<EmployeeCVForm
                                backTo={"../" + EmployeePaths.CVs} />} />

                            <Route exact path={EmployeePaths.CVResponses} element={<EmployeeCVResponseListPage
                                CVTo={"../" + EmployeePaths.CVs} vacancyTo={"../" + EmployeePaths.vacancies} />} />
                            <Route exact path={EmployeePaths.CVResponses + ":id/"} element={<EmployeeCVResponseDetailPage
                                backTo={"../" + EmployeePaths.CVResponses}
                                CVTo={"../" + EmployeePaths.CVs} vacancyTo={"../" + EmployeePaths.vacancies} />} />

                            <Route exact path={EmployeePaths.vacancies} element={<EmployeeVacancyListPage
                                respondTo={"../" + EmployeePaths.vacancyResponses + ObjectActions.add} />} />
                            <Route exact path={EmployeePaths.vacancies + ":id/"} element={<EmployeeVacancyDetailPage
                                backTo={"../" + EmployeePaths.vacancies}
                                respondTo={"../" + EmployeePaths.vacancyResponses + ObjectActions.add} />} />

                            <Route exact path={EmployeePaths.vacancyResponses} element={<EmployeeVacancyResponseListPage
                                CVTo={"../" + EmployeePaths.CVs} vacancyTo={"../" + EmployeePaths.vacancies} />} />
                            <Route exact path={EmployeePaths.vacancyResponses + ":id/"} element={<EmployeeVacancyResponseDetailPage
                                backTo={"../" + EmployeePaths.vacancyResponses}
                                CVTo={"../" + EmployeePaths.CVs} vacancyTo={"../" + EmployeePaths.vacancies} />} />
                            <Route exact path={EmployeePaths.vacancyResponses + ObjectActions.add} element={<EmployeeVacancyResponseForm
                                backTo={"../" + EmployeePaths.vacancyResponses} />} />

                            <Route element={<EmployeeHomePage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </PrivateDataContext.Provider>
    )
}

export default EmployeePage
