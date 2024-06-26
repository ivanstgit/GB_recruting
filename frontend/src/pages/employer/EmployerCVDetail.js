import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// import { useTranslation } from 'react-i18next';
import { DATA_RESOURCES, PrivateDataContext, useData } from '../../hooks/DataProvider.js'

import { ErrorLabel, Loading } from '../../components/common/UICommon.js';
import { CVDetail } from '../../components/shared/CV.js';
import { ActionGroup, commonActions } from '../../components/common/Actions.js';
import { useTranslation } from 'react-i18next';

const EmployerCVDetailPage = ({ backTo, respondTo }) => {

    const [item, setItem] = useState();
    const [error, setError] = useState();

    const { id } = useParams();
    const dataProvider = useData();
    const privateData = useContext(PrivateDataContext);
    const navigate = useNavigate();

    const { t } = useTranslation("Employer");

    const refresh = () => {
        dataProvider.getOne(DATA_RESOURCES.cvs, id)
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
                dataProvider.setFavorite(DATA_RESOURCES.cvs, item.id, false)
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
                dataProvider.setFavorite(DATA_RESOURCES.cvs, item.id, true)
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
        actions[commonActions.respond] = () => {
            if (privateData.vacancyApprovedCount > 0) {
                navigate(respondTo, { state: { CVId: item.id } })
            } else {
                setError(t("Errors.NoVacancyExist"))
            }
        }

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
                    <ErrorLabel errorText={error} />
                    <CVDetail item={item} />
                </div>
            </>
        )
    } else {
        refresh()
        if (error) return (<ErrorLabel errorText={error} />)

        return (<Loading />)
    }
}

export default EmployerCVDetailPage
