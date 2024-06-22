import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import { useTranslation } from 'react-i18next';
import { DATA_RESOURCES, PrivateDataContext, useData } from '../../hooks/DataProvider.js'

import { ErrorLabel, Loading } from '../../components/common/UICommon.js';
import { VacancyDetail, VacancyStatusIcon, VacancyStatuses } from '../../components/shared/Vacancy.js';
import { ActionGroup, commonActions } from '../../components/common/Actions.js';
import { ObjectActions } from '../../routes/AppPaths.js';



const EmployerVacancyDetailPage = ({ backTo }) => {

    const [item, setItem] = useState();
    const [error, setError] = useState();

    const { id } = useParams();
    const dataProvider = useData();
    const privateData = useContext(PrivateDataContext);
    const navigate = useNavigate();

    let actions = {}
    actions[commonActions.back] = () => navigate(backTo)
    actions[commonActions.copy] = () => navigate(backTo + ObjectActions.add, { state: { fromId: item.id } })
    if (item?.status?.id === VacancyStatuses.draft || item?.status?.id === VacancyStatuses.rejected) {
        actions[commonActions.edit] = () => navigate(ObjectActions.edit)
        actions[commonActions.publish] = () => {
            dataProvider.setStatus(DATA_RESOURCES.vacancies, id, VacancyStatuses.pending)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                    } else {
                        setError("")
                        privateData.refreshVacancyList().then(navigate(backTo))
                    }
                })
        }
    }
    actions[commonActions.delete] = () => {
        dataProvider.deleteOne(DATA_RESOURCES.vacancies, id)
            .then((res) => {
                if (res.error) {
                    setError(res.error)
                } else {
                    setError("")
                    privateData.refreshVacancyList().then(navigate(backTo))
                }
            })
    }


    useEffect(() => {
        if (!item) {
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
    });

    if (item) {
        return (
            <>
                <div className="row">

                    <div className="col">
                        <ActionGroup actions={actions} size="" showText={true} />
                    </div>
                    <div className="col-md-auto fs-5">
                        <VacancyStatusIcon status={item.status} showText={true} /> {item.status_info}
                    </div>

                </div>
                <div className="row">
                    <VacancyDetail item={item} />
                </div>
            </>
        )
    } else {

        if (error) return (<ErrorLabel errorText={error} />)
        return (<Loading />)
    }
}

export default EmployerVacancyDetailPage
