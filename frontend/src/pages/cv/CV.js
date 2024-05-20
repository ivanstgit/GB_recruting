import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { DATA_RESOURCES, dataStatuses, useData } from '../../hooks/DataProvider.js'

import CVDetailPage from "./CVDetail.js";
import { CVCard, CVSearchForm } from "../../components/shared/CV.js";
import NotFound404 from "../../components/NotFound404.js";
import { commonActions } from "../../components/common/Actions.js";


const CVPage = () => {
    const { t } = useTranslation("SharedCV");
    const dataProvider = useData();

    const [status, setStatus] = useState(dataStatuses.initial)
    const [error, setError] = useState("")
    const [items, setItems] = useState([])

    const refreshData = (params) => {
        setStatus(dataStatuses.loading)
        dataProvider.getList(DATA_RESOURCES.cvs, params)
            .then((res) => {
                if (res.error) {
                    setItems([])
                    setError(res.error)
                    setStatus(dataStatuses.error)
                } else {
                    setItems(res.data)
                    setError("")
                    setStatus(dataStatuses.success)
                }
            })
    }

    if (status === dataStatuses.initial) {
        refreshData({})
    }

    return (
        <div className="container-xxl py-0">
            <Routes>
                <Route index element={
                    <div className="">
                        <div className="row g-3 mt-1">
                            <div className="text-center mx-auto mb-1 wow fadeInUp" data-wow-delay="0.1s">
                                <h2>{t("CVs.header")}</h2>
                            </div>
                        </div>

                        <div className="row g-3"><CVSearchForm onApply={refreshData} /></div>
                        <div className="row g-3 mt-1"><CVList items={items} /></div>
                    </div>
                } />
                <Route path={":id"} element={<CVDetailPage backTo={"../"} />} />
                <Route element={<NotFound404 />} />
            </Routes>
        </div>
    )

}
export default CVPage



const CVListItem = ({ item }) => {
    const navigate = useNavigate()

    let actions = {}
    actions[commonActions.detail] = () => navigate(item.id + "/")

    return (
        <CVCard item={item} actions={actions} />
    )
}

const CVList = ({ items }) => {

    const { t } = useTranslation("SharedCV");

    return (
        <div>
            <div className="row g-3">
                {items.map((item, index) => <CVListItem key={'CVLI' + index} item={item} />)}
            </div>
        </div>
    )

}