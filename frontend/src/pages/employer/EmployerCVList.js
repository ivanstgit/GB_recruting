import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { DATA_RESOURCES, dataStatuses, useData } from '../../hooks/DataProvider.js'

import { CVCard, CVSearchForm } from "../../components/shared/CV.js";
import { commonActions } from "../../components/common/Actions.js";
import { ErrorLabel } from "../../components/common/UICommon.js";


const EmployerCVListPage = ({ respondTo }) => {
    const { t } = useTranslation("SharedCV");
    const navigate = useNavigate();
    const dataProvider = useData();

    const [status, setStatus] = useState(dataStatuses.initial)
    const [error, setError] = useState("")
    const [items, setItems] = useState([])
    const [searchParams, setSearchParams] = useState({})

    const refreshData = () => {
        setStatus(dataStatuses.loading)
        dataProvider.getList(DATA_RESOURCES.cvs, searchParams)
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

    const handleSearchParamsChanged = (params) => {
        setSearchParams(params)
        setStatus(dataStatuses.initial)
    }

    const handleFavoriteAdd = (id) => {
        dataProvider.setFavorite(DATA_RESOURCES.cvs, id, true)
            .then((res) => {
                if (res.error) {
                    setError(res.error)
                } else {
                    setError("")
                    refreshData()
                }
            })
    }

    const handleFavoriteRemove = (id) => {
        dataProvider.setFavorite(DATA_RESOURCES.cvs, id, false)
            .then((res) => {
                if (res.error) {
                    setError(res.error)
                } else {
                    setError("")
                    refreshData()
                }
            })
    }

    const handleRespond = (id) => {
        navigate(respondTo, { state: { CVId: id } })
    }

    useEffect(() => {
        if (status === dataStatuses.initial) {
            refreshData()
        }
    });
    return (
        <div className="">
            <div className="row g-3 mt-1">
                <div className="text-center mx-auto mb-1 wow fadeInUp" data-wow-delay="0.1s">
                    <h2>{t("CVs.header")}</h2>
                </div>
                <ErrorLabel errorText={error} />
            </div>

            <div className="row g-3"><CVSearchForm onApply={handleSearchParamsChanged} /></div>
            <div className="row g-3 mt-1"><EmployerCVList items={items} respondTo={respondTo}
                onFavoriteAdd={handleFavoriteAdd} onFavoriteRemove={handleFavoriteRemove}
                onRespond={handleRespond} />
            </div>
        </div>
    )
}
export default EmployerCVListPage



const EmployerCVListItem = ({ item, onFavoriteAdd, onFavoriteRemove, onRespond }) => {
    const navigate = useNavigate()

    let actions = {}
    actions[commonActions.detail] = () => navigate(item.id + "/")

    if (item.is_favorite) {
        actions[commonActions.favoriteRemove] = () => onFavoriteRemove(item.id)
    } else {
        actions[commonActions.favoriteAdd] = () => onFavoriteAdd(item.id)
    }
    actions[commonActions.respond] = () => onRespond(item.id)


    return (
        <CVCard item={item} actions={actions} />
    )
}

const EmployerCVList = ({ items, onFavoriteAdd, onFavoriteRemove, onRespond }) => {


    // const { t } = useTranslation("SharedCV");

    return (
        <div>
            <div className="row g-3">
                {items.map((item, index) => <EmployerCVListItem key={'CVLI' + index} item={item}
                    onFavoriteAdd={onFavoriteAdd} onFavoriteRemove={onFavoriteRemove} onRespond={onRespond} />)}
            </div>
        </div>
    )

}