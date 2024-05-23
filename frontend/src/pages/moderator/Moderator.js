import { useMemo, useState } from "react"
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

import ModeratorCVsPage from "./ModeratorCV.js"
import ModeratorCVDetailPage from "./ModeratorCVDetail.js"
import ModeratorCVRejectForm from "./ModeratorCVRejectForm.js"

export const ModeratorPaths = {
    home: "home/",
    news: "news/",
    cvs: "cv/",
}

const ModeratorPage = () => {
    const { t } = useTranslation("Navigation");
    const dataProvider = useData();

    const [status, setStatus] = useState(dataStatuses.initial)
    const [error, setError] = useState("")
    const [CVCount, setCVCount] = useState(0)
    const [CVList, setCVList] = useState([])

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

    if (status === dataStatuses.initial) {
        refreshCVList()
    }
    const privateDataContextValue = useMemo(() => ({
        CVList,
        refreshCVList
        // eslint-disable-next-line
    }), [CVList]);

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

                            <Route exact path={ModeratorPaths.cvs} element={<ModeratorCVsPage />} />
                            <Route exact path={ModeratorPaths.cvs + ":id/"} element={<ModeratorCVDetailPage
                                backTo={"../" + ModeratorPaths.cvs} />} />
                            <Route exact path={ModeratorPaths.cvs + ":id/" + ObjectActions.reject} element={<ModeratorCVRejectForm
                                backTo={"../" + ModeratorPaths.cvs} />} />

                            <Route element={<Navigate to={ModeratorPaths.home} />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </PrivateDataContext.Provider>
    )
}

export default ModeratorPage

