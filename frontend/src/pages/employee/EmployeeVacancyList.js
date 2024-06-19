import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { DATA_RESOURCES, dataStatuses, useData } from '../../hooks/DataProvider.js'

import { VacancyCard, VacancySearchForm } from "../../components/shared/Vacancy.js";
import { commonActions } from "../../components/common/Actions.js";
import { ErrorLabel } from "../../components/common/UICommon.js";


const EmployeeVacancyListPage = ({ respondTo }) => {
    const { t } = useTranslation("Employee");
    const navigate = useNavigate();
    const dataProvider = useData();

    const [status, setStatus] = useState(dataStatuses.initial)
    const [error, setError] = useState("")
    const [items, setItems] = useState([])
    const [searchParams, setSearchParams] = useState({})

    const refreshData = () => {
        setStatus(dataStatuses.loading)
        dataProvider.getList(DATA_RESOURCES.vacancies, searchParams)
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
        dataProvider.setFavorite(DATA_RESOURCES.vacancies, id, true)
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
        dataProvider.setFavorite(DATA_RESOURCES.vacancies, id, false)
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
        navigate(respondTo, { state: { vacancyId: id } })
    }

    useEffect(() => {
        if (status === dataStatuses.initial) {
            refreshData()
        }
    });
    return (

        <div className="">
            <div className="row g-1 mt-1">
                <div className="mb-1 wow fadeInUp" data-wow-delay="0.1s">
                    <h2>{t("Vacancies.header")}</h2>
                </div>
                <ErrorLabel errorText={error} />
            </div>

            <div className="row g-3"><VacancySearchForm onApply={handleSearchParamsChanged} /></div>
            <div className="row g-3 mt-1"><EmployeeVacancyList items={items}
                onFavoriteAdd={handleFavoriteAdd} onFavoriteRemove={handleFavoriteRemove}
                onRespond={handleRespond} />
            </div>
        </div>
    )

}
export default EmployeeVacancyListPage


const EmployeeVacancyListItem = ({ item, onFavoriteAdd, onFavoriteRemove, onRespond }) => {
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
        <VacancyCard item={item} actions={actions} />
    )
}

const EmployeeVacancyList = ({ items, onFavoriteAdd, onFavoriteRemove, onRespond }) => {

    // const { t } = useTranslation("SharedVacancy");

    return (
        <div>
            <div className="row g-3">
                {items.map((item, index) => <EmployeeVacancyListItem key={'VacancyLI' + index} item={item}
                    onFavoriteAdd={onFavoriteAdd} onFavoriteRemove={onFavoriteRemove} onRespond={onRespond} />)}
            </div>
        </div>
    )

}