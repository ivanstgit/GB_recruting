import { Navigate, Route, Routes } from "react-router-dom"

import { useTranslation } from "react-i18next"

import { ObjectActions } from "../../routes/AppPaths.js"
import NavLocal from "../../components/NavigationLocal.js"

import ModeratorHomePage from "./ModeratorHome.js"
import ModeratorNewsPage from "./ModeratorNews.js"
import ModeratorNewsForm from "./ModeratorNewsForm.js"
import ModeratorNewsDetailPage from "./ModeratorNewsDetail.js"

export const ModeratorPaths = {
    home: "home/",
    news: "news/",
}

const ModeratorPage = () => {
    const { t } = useTranslation("Navigation");

    const navLocalItems = [
        {
            link: ModeratorPaths.home,
            text: t("Moderator.Home"),
        },
        {
            link: ModeratorPaths.news,
            text: t("Moderator.News"),
        },
    ]

    return (
        <div className="container-xxl py-0">
            <div className="row">
                <NavLocal items={navLocalItems} />
                <div className="col p-3">
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
                        <Route element={<Navigate to={ModeratorPaths.home} />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default ModeratorPage
