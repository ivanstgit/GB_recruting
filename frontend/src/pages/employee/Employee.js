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


export const EmployeePaths = {
    home: "home/",
    profile: "profile/",
    cvs: "cv/",
}

const EmployeePage = () => {
    const { t } = useTranslation("Navigation");

    const dataProvider = useData();

    const [status, setStatus] = useState(dataStatuses.initial)
    const [error, setError] = useState("")
    const [CVCount, setCVCount] = useState(0)
    const [CVRejectedCount, setCVRejectedCount] = useState(0)
    const [CVList, setCVList] = useState([])

    const refreshTimeout = 5000

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
            link: EmployeePaths.cvs,
            text: t("Employee.CVs"),
            badge: ((CVRejectedCount > 0)) ? "!" : ""
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

    const privateDataContextValue = useMemo(() => ({
        CVList,
        CVCount,
        CVRejectedCount,
        refreshCVList,
        // eslint-disable-next-line
    }), [CVList]);

    useEffect(() => {
        if (status === dataStatuses.initial) {
            refreshCVList()
        }
        let timer = setTimeout(() => {
            refreshCVList()
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
                            <Route exact path={EmployeePaths.cvs} element={<EmployeeCVListPage />} />
                            <Route exact path={EmployeePaths.cvs + ":id/"} element={<EmployeeCVDetailPage
                                backTo={"../" + EmployeePaths.cvs} />} />
                            <Route exact path={EmployeePaths.cvs + ObjectActions.add} element={<EmployeeCVForm
                                backTo={"../" + EmployeePaths.cvs} />} />
                            <Route exact path={EmployeePaths.cvs + ":id/" + ObjectActions.edit} element={<EmployeeCVForm
                                backTo={"../" + EmployeePaths.cvs} />} />
                            <Route element={<EmployeeHomePage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </PrivateDataContext.Provider>
    )
}

export default EmployeePage
