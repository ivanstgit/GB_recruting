import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import { useTranslation } from 'react-i18next';
import { DATA_RESOURCES, PrivateDataContext, useData } from '../../hooks/DataProvider.js'

import { ErrorLabel, Loading } from '../../components/common/UICommon.js';
import { EmployerProfileCard, EmployerPublicCard, EmployerStatusIcon, EmployerStatuses } from '../../components/shared/Employer.js';
import { ActionGroup, commonActions } from '../../components/common/Actions.js';
import { ObjectActions } from '../../routes/AppPaths.js';



const ModeratorEmployerDetailPage = ({ backTo }) => {

    const [item, setItem] = useState();
    const [error, setError] = useState();

    const { id } = useParams();
    const dataProvider = useData();
    const privateData = useContext(PrivateDataContext);
    const navigate = useNavigate();

    let actions = {}
    actions[commonActions.back] = () => navigate(backTo)
    actions[commonActions.accept] = () => {
        dataProvider.setStatus(DATA_RESOURCES.employer, id, EmployerStatuses.approved)
            .then((res) => {
                if (res.error) {
                    setError(res.error)
                } else {
                    setError("")
                    privateData.refreshEmployerList()
                    navigate(backTo)
                }
            })
    }
    actions[commonActions.reject] = () => navigate(ObjectActions.reject)

    if (item) {
        return (
            <>
                <div className="row">

                    <div className="col">
                        <ActionGroup actions={actions} size="" showText={true} />
                    </div>
                    <div className="col-md-auto fs-5">
                        <EmployerStatusIcon status={item.status} showText={true} />
                    </div>

                </div>
                <div className="row">
                    <EmployerProfileCard profile={item} />
                    <EmployerPublicCard item={item} />
                </div>
            </>
        )
    } else {
        dataProvider.getOne(DATA_RESOURCES.employer, id)
            .then(res => {
                // console.log(res)
                if (res.error) {
                    setError(res.error)
                } else {
                    setItem(res.data)
                }
            })
        if (error) return (<ErrorLabel errorText={error} />)

        return (<Loading />)
    }
}

export default ModeratorEmployerDetailPage
