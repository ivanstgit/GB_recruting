import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import { useTranslation } from 'react-i18next';
import { DATA_RESOURCES, useData } from '../../hooks/DataProvider.js'

import { ErrorLabel, Loading } from '../../components/common/UICommon.js';
import { CVDetail, CVStatusIcon, CVStatuses } from '../../components/shared/CV.js';
import { ActionGroup, commonActions } from '../../components/common/Actions.js';
import { ObjectActions } from '../../routes/AppPaths.js';



const EmployeeCVDetailPage = ({ backTo }) => {

    const [item, setItem] = useState();
    const [error, setError] = useState();

    const { id } = useParams();
    const dataProvider = useData()
    const navigate = useNavigate();

    // const { t } = useTranslation("SharedCV");

    let actions = {}
    actions[commonActions.back] = () => navigate(backTo)
    actions[commonActions.copy] = () => navigate(backTo + ObjectActions.add, { state: { fromId: item.id } })
    if (item?.status?.id === CVStatuses.draft || item?.status?.id === CVStatuses.rejected) {
        actions[commonActions.edit] = () => navigate(ObjectActions.edit)
        actions[commonActions.delete] = () => {
            dataProvider.deleteOne(DATA_RESOURCES.cvs, id)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                    } else {
                        setError("")
                        navigate(backTo)
                    }
                })
        }
        actions[commonActions.publish] = () => {
            dataProvider.setStatus(DATA_RESOURCES.cvs, id, CVStatuses.pending)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                    } else {
                        setError("")
                        navigate(backTo)
                    }
                })
        }
    }

    if (item) {
        return (
            <>
                <div className="row">

                    <div className="col">
                        <ActionGroup actions={actions} size="" showText={true} />
                    </div>
                    <div className="col-md-auto fs-5">
                        <CVStatusIcon status={item.status} showText={true} /> {item.status_info}
                    </div>

                </div>
                <div className="row">
                    <CVDetail item={item} />
                </div>
            </>
        )
    } else {
        dataProvider.getOne(DATA_RESOURCES.cvs, id)
            .then(res => {
                console.log(res)
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

export default EmployeeCVDetailPage
