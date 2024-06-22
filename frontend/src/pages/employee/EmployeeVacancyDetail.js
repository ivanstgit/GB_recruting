import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import { useTranslation } from 'react-i18next';
import { DATA_RESOURCES, useData } from '../../hooks/DataProvider.js'

import { ErrorLabel, Loading } from '../../components/common/UICommon.js';
import { VacancyDetail } from '../../components/shared/Vacancy.js';
import { ActionGroup, commonActions } from '../../components/common/Actions.js';

const EmployeeVacancyDetailPage = ({ backTo, respondTo }) => {

    const [item, setItem] = useState();
    const [error, setError] = useState();

    const { id } = useParams();
    const dataProvider = useData();
    const navigate = useNavigate();

    // const { t } = useTranslation("SharedVacancy");

    const refresh = () => {
        dataProvider.getOne(DATA_RESOURCES.vacancies, id)
            .then(res => {
                // console.log(res)
                if (res.error) {
                    setError(res.error)
                } else {
                    setItem(res.data)
                }
            })
    }

    let actions = {}
    actions[commonActions.back] = () => navigate(backTo)

    if (item) {
        if (item.is_favorite) {
            actions[commonActions.favoriteRemove] = () => {
                dataProvider.setFavorite(DATA_RESOURCES.vacancies, item.id, false)
                    .then((res) => {
                        if (res.error) {
                            setError(res.error)
                        } else {
                            setError("")
                            refresh()
                        }
                    })
            }
        } else {
            actions[commonActions.favoriteAdd] = () => {
                dataProvider.setFavorite(DATA_RESOURCES.vacancies, item.id, true)
                    .then((res) => {
                        if (res.error) {
                            setError(res.error)
                        } else {
                            setError("")
                            refresh()
                        }
                    })
            }
        }
        actions[commonActions.respond] = () => navigate(respondTo, { state: { vacancyId: item.id } })

        return (
            <>
                <div className="row">
                    <div className="col">
                        <ActionGroup actions={actions} size="" showText={true} />
                    </div>
                    <div className="col-md-auto fs-5">
                        <div />
                    </div>

                </div>
                <div className="row">
                    <VacancyDetail item={item} />
                </div>
            </>
        )
    } else {
        refresh()
        if (error) return (<ErrorLabel errorText={error} />)

        return (<Loading />)
    }
}

export default EmployeeVacancyDetailPage
