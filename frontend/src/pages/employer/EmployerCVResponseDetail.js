import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import { useTranslation } from 'react-i18next';
import { DATA_RESOURCES, PrivateDataContext, useData } from '../../hooks/DataProvider.js'

import { ErrorLabel, Loading } from '../../components/common/UICommon.js';
import { CVResponseChat, CVResponseDetail, CVResponseStatusIcon, CVResponseStatuses } from '../../components/shared/CVResponse.js';
import { ActionGroup, commonActions } from '../../components/common/Actions.js';


const EmployerCVResponseDetailPage = ({ backTo, CVTo, vacancyTo }) => {

    const [item, setItem] = useState();
    const [error, setError] = useState();

    const { id } = useParams();
    const dataProvider = useData();
    const privateData = useContext(PrivateDataContext);
    const navigate = useNavigate();

    let actions = {}
    actions[commonActions.back] = () => navigate(backTo)
    if (item?.status?.id === CVResponseStatuses.draft) {

        actions[commonActions.publish] = () => {
            dataProvider.setStatus(DATA_RESOURCES.cvResponses, id, CVResponseStatuses.pending)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                    } else {
                        setError("")
                        privateData.refreshCVResponseList().then(navigate(backTo))
                    }
                })
        }
    }
    actions[commonActions.delete] = () => {
        dataProvider.deleteOne(DATA_RESOURCES.cvResponses, id)
            .then((res) => {
                if (res.error) {
                    setError(res.error)
                } else {
                    setError("")
                    privateData.refreshCVResponseList().then(navigate(backTo))
                }
            })
    }
    let CVActions = {}
    CVActions[commonActions.detail] = () => navigate(CVTo + item?.cv?.id)
    let vacancyActions = {}
    vacancyActions[commonActions.detail] = () => navigate(vacancyTo + item?.vacancy?.id)

    const refreshItem = () => {
        dataProvider.getOne(DATA_RESOURCES.cvResponses, id)
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
        const res = await dataProvider.addMessage(DATA_RESOURCES.cvResponses, id, msgText)
        if (!res.error) {
            refreshItem()
        }
        return res
    }

    useEffect(() => {
        if (!item) {
            refreshItem()
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
                        <CVResponseStatusIcon status={item.status} showText={true} /> {item.status_info}
                    </div>

                </div>
                <div className="row">
                    <CVResponseDetail item={item} CVActions={CVActions} vacancyActions={vacancyActions} />
                </div>
                <div className="row">
                    <CVResponseChat item={item} onMessageSubmit={addMessage} />
                </div>
            </>
        )
    } else {

        if (error) return (<ErrorLabel errorText={error} />)
        return (<Loading />)
    }
}

export default EmployerCVResponseDetailPage
