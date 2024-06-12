import { Navigate, Route, Routes } from "react-router-dom"

import { useTranslation } from "react-i18next"

import NavLocal from "../../components/NavigationLocal"
import { ObjectActions } from "../../routes/AppPaths.js"

import EmployerHomePage from "./EmployerHome.js"
import EmployerProfileForm from "./EmployerProfileForm.js"
import EmployerProfilePage from "./EmployerProfile.js"
import { DATA_RESOURCES, PrivateDataContext, dataStatuses, useData } from "../../hooks/DataProvider.js"
import { useMemo, useState } from "react"
import { EmployerStatuses } from "../../components/shared/Employer.js"
// import EmployerCVsPage from "./EmployerCV.js"
// import EmployerCVForm from "./EmployerCVForm.js"
// import EmployerCVDetailPage from "./EmployerCVDetail.js"

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
    const [CVCount, setCVCount] = useState(0)
    const [CVList, setCVList] = useState([])

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
    const privateDataContextValue = useMemo(() => ({
        CVList,
        refreshCVList,
        // eslint-disable-next-line
    }), [CVList]);

    return (
        <PrivateDataContext.Provider value={privateDataContextValue}>
            <div className="container-xxl py-0">
                <div className="row">
                    <NavLocal items={navLocalItems} />
                    <div className="col p-3">
                        <Routes>
                            <Route index element={<Navigate to={EmployerPaths.home} />} />
                            <Route exact path={EmployerPaths.home} element={<EmployerHomePage />} />
                            <Route exact path={EmployerPaths.profile} element={<EmployerProfilePage />} />
                            <Route exact path={EmployerPaths.profile + ObjectActions.edit} element={<EmployerProfileForm
                                backTo={"../" + EmployerPaths.profile} />} />
                            {/* <Route exact path={EmployerPaths.cvs} element={<EmployerCVsPage />} />
                        <Route exact path={EmployerPaths.cvs + ":id/"} element={<EmployerCVDetailPage
                            backTo={"../" + EmployerPaths.cvs} />} />
                        <Route exact path={EmployerPaths.cvs + ObjectActions.add} element={<EmployerCVForm
                            backTo={"../" + EmployerPaths.cvs} />} />
                        <Route exact path={EmployerPaths.cvs + ":id/" + ObjectActions.edit} element={<EmployerCVForm
                            backTo={"../" + EmployerPaths.cvs} />} /> */}
                            <Route element={<EmployerHomePage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </PrivateDataContext.Provider>
    )
}

export default EmployerPage
