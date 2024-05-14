import { Navigate, Route, Routes } from "react-router-dom"

import { useTranslation } from "react-i18next"

import NavLocal from "../../components/NavigationLocal"
import { ObjectActions } from "../../routes/AppPaths.js"

import EmployeeHomePage from "./EmployeeHome.js"
import EmployeeProfileForm from "./EmployeeProfileForm.js"
import EmployeeProfilePage from "./EmployeeProfile.js"
import EmployeeCVsPage from "./EmployeeCV.js"
import EmployeeCVForm from "./EmployeeCVForm.js"
import EmployeeCVDetailPage from "./EmployeeCVDetail.js"

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
                        <Route exact path={EmployeePaths.cvs} element={<EmployeeCVsPage />} />
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
    )
}

export default EmployeePage