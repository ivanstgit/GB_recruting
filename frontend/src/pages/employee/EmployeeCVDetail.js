import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { DATA_RESOURCES, useData } from '../../hooks/DataProvider.js'

import { ErrorLabel, Loading } from '../../components/common/UICommon.js';
import { CVDetail } from '../../components/shared/CV.js';
import { commonActions } from '../../components/common/Actions.js';
import { ObjectActions } from '../../routes/AppPaths.js';



const EmployeeCVDetailPage = ({ backTo }) => {

    const [item, setItem] = useState();
    const [error, setError] = useState();

    const { id } = useParams();
    const dataProvider = useData()
    const navigate = useNavigate();

    const { t } = useTranslation("SharedCV");

    let actions = {}
    actions[commonActions.copy] = () => navigate(backTo + ObjectActions.add, { state: { fromId: item.id } })
    actions[commonActions.edit] = () => navigate(ObjectActions.edit)

    if (item) {
        return (
            <>
                <div className="row">
                    <div className="col-6">
                        <Link to={backTo} className="btn btn-link">{t("actions.back")}</Link>
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
