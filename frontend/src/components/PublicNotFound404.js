import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import AppPaths from "../routes/AppPaths.js"

const PublicNotFound404 = () => {
    const { t } = useTranslation("NotFound404");
    return (
        <div className="container-xxl py-5 wow fadeInUp">
            <div className="container text-center">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <i className="bi bi-exclamation-triangle display-1 text-primary"></i>
                        <h1 className="display-1">404</h1>
                        <h1 className="mb-4">{t("Page Not Found")}</h1>
                        <p className="mb-4">{t("Requested page not found")}</p>

                        <Link className="btn btn-primary rounded-pill py-3 px-5" to={AppPaths.home}>{t("Go Back To Home")}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicNotFound404
