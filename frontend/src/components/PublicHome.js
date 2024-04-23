import { Link } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import AppPaths from "../routes/AppPaths.js"
import PublicNewsList from "./PublicNews.js"
import { userRoles } from "../hooks/AuthProvider.js";

const PublicHome = () => {
    const { t } = useTranslation("Home");

    return (
        <div className="container-xxl py-1">

            <div className="row g-3">
                <div className="col-lg-6 wow fadeIn">
                    <div className="bg-light rounded mb-0">
                        <div className="mx-3 mb-1 wow fadeInUp" data-wow-delay="0.1s">
                            <h2 className="text-center mb-3" > {t("Employee.header")} </h2>
                            <p className="mb-3">{t("Employee.text")}</p>
                            <p><i className="far fa-check-circle text-primary me-3"></i>{t("Employee.tips.1")}</p>
                            <p><i className="far fa-check-circle text-primary me-3"></i>{t("Employee.tips.2")}</p>
                            <p><i className="far fa-check-circle text-primary me-3"></i>{t("Employee.tips.3")}</p>
                            <p><i className="far fa-check-circle text-primary me-3"></i>{t("Employee.tips.4")}</p>
                            <div className="text-center col-12">
                                <Link className="btn btn-primary rounded-pill py-3 px-5 mt-1 mb-2"
                                    key="EmployeeRegister" to={AppPaths.signup + "?role=" + userRoles.employee}>
                                    {t("Employee.button")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 wow fadeIn">
                    <div className="bg-light rounded mb-0">
                        <div className="mx-3 mb-1 wow fadeInUp" data-wow-delay="0.1s">
                            <h2 className="text-center mb-3" > {t("Employer.header")} </h2>
                            <p className="mb-3">{t("Employer.text")}</p>
                            <p><i className="far fa-check-circle text-primary me-3"></i>{t("Employer.tips.1")}</p>
                            <p><i className="far fa-check-circle text-primary me-3"></i>{t("Employer.tips.2")}</p>
                            <p><i className="far fa-check-circle text-primary me-3"></i>{t("Employer.tips.3")}</p>
                            <p><i className="far fa-check-circle text-primary me-3"></i>{t("Employer.tips.4")}</p>
                            <div className="text-center col-12">
                                <Link className="btn btn-primary rounded-pill py-3 px-5 mt-1 mb-2"
                                    key="EmployeeRegister" to={AppPaths.signup + "?role=" + userRoles.employer} >
                                    {t("Employer.button")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PublicNewsList asCards={true} />
        </div>

    )
}
export default PublicHome