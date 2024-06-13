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
import EmployerVacancyPage from "./EmployerVacancy.js"
import EmployerVacancyDetailPage from "./EmployerVacancyDetail.js"
import EmployerVacancyForm from "./EmployerVacancyForm.js"

export const EmployerPaths = {
    home: "home/",
    profile: "profile/",
    vacancies: "vacancies/",
}

const EmployerPage = () => {
    const { t } = useTranslation("Navigation");
    const dataProvider = useData();

    const [status, setStatus] = useState(dataStatuses.initial)
    const [error, setError] = useState("")
    const [vacancyCount, setVacancyCount] = useState(0)
    const [vacancyList, setVacancyList] = useState([])

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
        },
    ]
    const refreshVacancyList = async () => {
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
    const privateDataContextValue = useMemo(() => ({
        vacancyList,
        vacancyCount,
        refreshVacancyList,
        // eslint-disable-next-line
    }), [vacancyList]);

    useEffect(() => {
        if (status === dataStatuses.initial) {
            refreshVacancyList()
        }
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

                            <Route exact path={EmployerPaths.vacancies} element={<EmployerVacancyPage />} />
                            <Route exact path={EmployerPaths.vacancies + ":id/"} element={<EmployerVacancyDetailPage
                                backTo={"../" + EmployerPaths.vacancies} />} />
                            <Route exact path={EmployerPaths.vacancies + ObjectActions.add} element={<EmployerVacancyForm
                                backTo={"../" + EmployerPaths.vacancies} />} />
                            <Route exact path={EmployerPaths.vacancies + ":id/" + ObjectActions.edit} element={<EmployerVacancyForm
                                backTo={"../" + EmployerPaths.vacancies} />} />

                            <Route element={<EmployerHomePage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </PrivateDataContext.Provider>
    )
}

export default EmployerPage
