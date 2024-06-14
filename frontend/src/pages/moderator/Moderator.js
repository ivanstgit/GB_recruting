import { useEffect, useMemo, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { ObjectActions } from "../../routes/AppPaths.js"
import { DATA_RESOURCES, PrivateDataContext, dataStatuses, useData } from "../../hooks/DataProvider.js"
import NavLocal from "../../components/NavigationLocal.js"
import { ErrorLabel } from "../../components/common/UICommon.js"

import ModeratorHomePage from "./ModeratorHome.js"

import ModeratorNewsPage from "./ModeratorNews.js"
import ModeratorNewsForm from "./ModeratorNewsForm.js"
import ModeratorNewsDetailPage from "./ModeratorNewsDetail.js"

import ModeratorCVListPage from "./ModeratorCVList.js"
import ModeratorCVDetailPage from "./ModeratorCVDetail.js"
import ModeratorCVRejectForm from "./ModeratorCVRejectForm.js"
import ModeratorEmployerListPage from "./ModeratorEmployerList.js"
import ModeratorEmployerDetailPage from "./ModeratorEmployerDetail.js"
import ModeratorEmployerRejectForm from "./ModeratorEmployerRejectForm.js"
import ModeratorVacancyListPage from "./ModeratorVacancyList.js"
import ModeratorVacancyDetailPage from "./ModeratorVacancyDetail.js"
import ModeratorVacancyRejectForm from "./ModeratorVacancyRejectForm.js"

export const ModeratorPaths = {
    home: "home/",
    news: "news/",
    cvs: "cv/",
    employers: "employers/",
    vacancies: "vacancies/",
}

const ModeratorPage = () => {
    const { t } = useTranslation("Navigation");
    const dataProvider = useData();

    const [status, setStatus] = useState(dataStatuses.initial)
    const [error, setError] = useState("")
    const [CVCount, setCVCount] = useState(0)
    const [CVList, setCVList] = useState([])
    const [employerCount, setEmployerCount] = useState(0)
    const [employerList, setEmployerList] = useState([])
    const [vacancyCount, setVacancyCount] = useState(0)
    const [vacancyList, setVacancyList] = useState([])

    const refreshTimeout = 5000

    const navLocalItems = [
        {
            link: ModeratorPaths.home,
            text: t("Moderator.Home"),
        },
        {
            link: ModeratorPaths.news,
            text: t("Moderator.News"),
        },
        {
            link: ModeratorPaths.cvs,
            text: t("Moderator.CVs"),
            badge: (CVCount > 0) ? CVCount.toString() : ""
        },
        {
            link: ModeratorPaths.employers,
            text: t("Moderator.Employers"),
            badge: (employerCount > 0) ? employerCount.toString() : ""
        },
        {
            link: ModeratorPaths.vacancies,
            text: t("Moderator.Vacancies"),
            badge: (vacancyCount > 0) ? vacancyCount.toString() : ""
        },
    ]

    const refreshCVList = () => {
        setStatus(dataStatuses.loading)
        dataProvider.getList(DATA_RESOURCES.cvs)
            .then((res) => {
                if (res.error) {
                    setCVCount(0)
                    setCVList([])
                    setError(res.error)
                    setStatus(dataStatuses.error)
                } else {
                    setCVCount(res.count)
                    setCVList(res.data)
                    setError("")
                    setStatus(dataStatuses.success)
                }
            })
    }
    const refreshEmployerList = () => {
        setStatus(dataStatuses.loading)
        dataProvider.getList(DATA_RESOURCES.employer)
            .then((res) => {
                if (res.error) {
                    setEmployerCount(0)
                    setEmployerList([])
                    setError(res.error)
                    setStatus(dataStatuses.error)
                } else {
                    setEmployerCount(res.count)
                    setEmployerList(res.data)
                    setError("")
                    setStatus(dataStatuses.success)
                }
            })
    }
    const refreshVacancyList = () => {
        setStatus(dataStatuses.loading)
        dataProvider.getList(DATA_RESOURCES.vacancies)
            .then((res) => {
                if (res.error) {
                    setVacancyCount(0)
                    setVacancyList([])
                    setError(res.error)
                    setStatus(dataStatuses.error)
                } else {
                    setVacancyCount(res.count)
                    setVacancyList(res.data)
                    setError("")
                    setStatus(dataStatuses.success)
                }
            })
    }

    useEffect(() => {
        if (status === dataStatuses.initial) {
            refreshCVList()
            refreshEmployerList()
            refreshVacancyList()
        }

        let timer = setTimeout(() => {
            refreshCVList()
            refreshEmployerList()
            refreshVacancyList()
        }, refreshTimeout);
        return () => {
            clearTimeout(timer);
        };
    });
    const privateDataContextValue = useMemo(() => ({
        CVList,
        refreshCVList,
        employerList,
        refreshEmployerList,
        vacancyList,
        refreshVacancyList,
        // eslint-disable-next-line
    }), [CVList, employerList, vacancyList]);

    return (
        <PrivateDataContext.Provider value={privateDataContextValue}>
            <div className="container-xxl py-0">
                <div className="row">
                    <NavLocal items={navLocalItems} />
                    <div className="col p-3">
                        <ErrorLabel errorText={error} />
                        <Routes>
                            <Route index element={<Navigate to={ModeratorPaths.home} />} />
                            <Route exact path={ModeratorPaths.home} element={<ModeratorHomePage />} />

                            <Route exact path={ModeratorPaths.news} element={<ModeratorNewsPage />} />
                            <Route exact path={ModeratorPaths.news + ":id/"} element={<ModeratorNewsDetailPage
                                backTo={"../" + ModeratorPaths.news} />} />
                            <Route exact path={ModeratorPaths.news + ObjectActions.add} element={<ModeratorNewsForm
                                backTo={"../" + ModeratorPaths.news} />} />
                            <Route exact path={ModeratorPaths.news + ":id/" + ObjectActions.edit} element={<ModeratorNewsForm
                                backTo={"../" + ModeratorPaths.news} />} />

                            <Route exact path={ModeratorPaths.cvs} element={<ModeratorCVListPage />} />
                            <Route exact path={ModeratorPaths.cvs + ":id/"} element={<ModeratorCVDetailPage
                                backTo={"../" + ModeratorPaths.cvs} />} />
                            <Route exact path={ModeratorPaths.cvs + ":id/" + ObjectActions.reject} element={<ModeratorCVRejectForm
                                backTo={"../" + ModeratorPaths.cvs} />} />

                            <Route exact path={ModeratorPaths.employers} element={<ModeratorEmployerListPage />} />
                            <Route exact path={ModeratorPaths.employers + ":id/"} element={<ModeratorEmployerDetailPage
                                backTo={"../" + ModeratorPaths.employers} />} />
                            <Route exact path={ModeratorPaths.employers + ":id/" + ObjectActions.reject} element={<ModeratorEmployerRejectForm
                                backTo={"../" + ModeratorPaths.employers} />} />

                            <Route exact path={ModeratorPaths.vacancies} element={<ModeratorVacancyListPage />} />
                            <Route exact path={ModeratorPaths.vacancies + ":id/"} element={<ModeratorVacancyDetailPage
                                backTo={"../" + ModeratorPaths.vacancies} />} />
                            <Route exact path={ModeratorPaths.vacancies + ":id/" + ObjectActions.reject} element={<ModeratorVacancyRejectForm
                                backTo={"../" + ModeratorPaths.vacancies} />} />

                            <Route element={<Navigate to={ModeratorPaths.home} />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </PrivateDataContext.Provider>
    )
}

export default ModeratorPage

