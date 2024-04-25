import { Navigate, Route, Routes } from "react-router-dom"

import { useTranslation } from "react-i18next"

import NavLocal from "../../components/NavigationLocal"
import EmployeeHomePage from "./EmployeeHome.js"
import EmployeeProfileForm from "./EmployeeProfileForm.js"
import EmployeeProfilePage from "./EmployeeProfile.js"
import { ObjectActions } from "../../routes/AppPaths.js"

export const EmployeePaths = {
    home: "home/",
    profile: "profile/",
    cvs: "cv/",
}

const EmployeePage = () => {
    const { t } = useTranslation("Navigation");

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
        },
    ]
    return (
        <div className="container-xxl py-0">
            <div className="row">
                <NavLocal items={navLocalItems} />
                <div className="col p-3">
                    <Routes>
                        <Route index element={<Navigate to={EmployeePaths.home} />} />
                        <Route exact path={EmployeePaths.home} element={<EmployeeHomePage />} />
                        <Route exact path={EmployeePaths.profile} element={<EmployeeProfilePage />} />
                        <Route exact path={EmployeePaths.profile + ObjectActions.edit} element={<EmployeeProfileForm />} />
                        <Route element={<EmployeeHomePage />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default EmployeePage
