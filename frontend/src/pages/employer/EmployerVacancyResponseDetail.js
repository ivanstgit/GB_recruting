import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import { useTranslation } from 'react-i18next';
import { DATA_RESOURCES, PrivateDataContext, useData } from '../../hooks/DataProvider.js'

import { ErrorLabel, Loading } from '../../components/common/UICommon.js';
import { VacancyResponseChat, VacancyResponseDetail, VacancyResponseStatusIcon, VacancyResponseStatuses } from '../../components/shared/VacancyResponse.js';
import { ActionGroup, commonActions } from '../../components/common/Actions.js';


const EmployerVacancyResponseDetailPage = ({ backTo, CVTo, vacancyTo }) => {

    const [item, setItem] = useState();
    const [error, setError] = useState();

    const { id } = useParams();
    const dataProvider = useData();
    const privateData = useContext(PrivateDataContext);
    const navigate = useNavigate();

    let actions = {}
    actions[commonActions.back] = () => navigate(backTo)
    if (item?.status?.id === VacancyResponseStatuses.pending) {

        actions[commonActions.accept] = () => {
            dataProvider.setStatus(DATA_RESOURCES.vacancyResponses, id, VacancyResponseStatuses.approved)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                    } else {
                        setError("")
                        privateData.refreshVacancyResponseList().then(navigate(backTo))
                    }
                })
        }
        actions[commonActions.reject] = () => {
            dataProvider.setStatus(DATA_RESOURCES.vacancyResponses, id, VacancyResponseStatuses.rejected)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                    } else {
                        setError("")
                        privateData.refreshVacancyResponseList().then(navigate(backTo))
                    }
                })
        }
    }
    let CVActions = {};
    CVActions[commonActions.detail] = () => navigate(CVTo + item?.cv?.id);
    let vacancyActions = {};
    vacancyActions[commonActions.detail] = () => navigate(vacancyTo + item?.vacancy?.id);

    const refreshItem = () => {
        dataProvider.getOne(DATA_RESOURCES.vacancyResponses, id)
            .then(res => {
                // console.log(res)
                if (res.error) {
                    setError(res.error)
                } else {
                    setItem(res.data)
                }
            })
    }

    const addMessage = async (msgText) => {
        const res = await dataProvider.addMessage(DATA_RESOURCES.vacancyResponses, id, msgText)
        if (!res.error) {
            refreshItem()
        }
        return res
    }

    useEffect(() => {
        if (!item) {
            refreshItem();
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
                        <VacancyResponseStatusIcon status={item.status} showText={true} /> {item.status_info}
                    </div>

                </div>
                <div className="row">
                    <VacancyResponseDetail item={item} CVActions={CVActions} vacancyActions={vacancyActions} />
                </div>
                <div className="row">
                    <VacancyResponseChat item={item} onMessageSubmit={addMessage} />
                </div>
            </>
        )
    } else {

        if (error) return (<ErrorLabel errorText={error} />)
        return (<Loading />)
    }
}

export default EmployerVacancyResponseDetailPage
