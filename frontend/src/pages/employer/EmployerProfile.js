import { useNavigate } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import { DATA_RESOURCES, useData } from "../../hooks/DataProvider.js";
import { EmployerProfileCard, EmployerStatusIcon, EmployerStatuses } from "../../components/shared/Employer.js";
import { ErrorLabel, WarningLabel } from "../../components/common/UICommon.js";
import { ObjectActions } from "../../routes/AppPaths.js";
import { ActionGroup, commonActions } from "../../components/common/Actions.js";
import { useEffect, useState } from "react";

const EmployerProfilePage = () => {

    const [error, setError] = useState();
    const [actions, setActions] = useState({});

    const { t } = useTranslation("Employer");
    const navigate = useNavigate();
    const dataProvider = useData();

    const profile = dataProvider.employerProfile?.[0] ?? null
    const emptyProfileText = profile ? "" : t("Profile.emptyWarning")

    useEffect(() => {
        let newActions = {}

        if (profile?.status?.id === EmployerStatuses.draft || profile?.status?.id === EmployerStatuses.rejected) {
            newActions[commonActions.edit] = () => navigate(ObjectActions.edit)
            newActions[commonActions.delete] = () => {
                dataProvider.deleteOne(DATA_RESOURCES.employer, profile.id)
                    .then((res) => {
                        if (res.error) {
                            setError(res.error)
                        } else {
                            setError("")
                            dataProvider.refreshDelayed(DATA_RESOURCES.employer)
                        }
                    })
            }
            newActions[commonActions.publish] = () => {
                dataProvider.setStatus(DATA_RESOURCES.employer, profile.id, EmployerStatuses.pending)
                    .then((res) => {
                        if (res.error) {
                            setError(res.error)
                        } else {
                            setError("")
                            dataProvider.refreshDelayed(DATA_RESOURCES.employer)
                        }
                    })
            }
        }
        if (profile?.status?.id === EmployerStatuses.pending || profile?.status?.id === EmployerStatuses.approved) {
            newActions[commonActions.recall] = () => {
                dataProvider.setStatus(DATA_RESOURCES.employer, profile.id, EmployerStatuses.draft)
                    .then((res) => {
                        if (res.error) {
                            setError(res.error)
                        } else {
                            setError("")
                            dataProvider.refreshDelayed(DATA_RESOURCES.employer)
                        }
                    })
            }
        }
        setActions(newActions)
    }, [profile]);

    return (
        <div>
            <h3> {t("Profile.header")} </h3>

            <div className="row">
                <WarningLabel text={emptyProfileText} />
                <ErrorLabel errorText={error} />
            </div>
            <div className="row">
                <div className="col">
                    <ActionGroup actions={actions} size="" showText={true} />
                </div>
                <div className="col-md-auto fs-5">
                    <EmployerStatusIcon status={profile?.status} showText={true} /> {profile?.status_info}
                </div>
            </div>
            <div className="row">
                <div className="col-6">

                </div>
            </div>
            <EmployerProfileCard profile={profile} />
        </div>

    )
}
export default EmployerProfilePage
