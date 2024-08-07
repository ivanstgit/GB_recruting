import React, { useContext, useState } from 'react';
import { Navigate, useParams } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import { useData, DATA_RESOURCES, PrivateDataContext } from '../../hooks/DataProvider.js'

import {
    FormContainer, formStatuses,
    HeaderText, InputText, SubmitButton,
} from "../../components/common/FormFields.js";
import { ErrorLabel } from '../../components/common/UICommon.js';
import { CVStatuses } from '../../components/shared/CV.js';

const initialState = {
    info: ""
}

const ModeratorCVRejectForm = ({ backTo }) => {
    const [input, setInput] = useState(initialState);
    const [error, setError] = useState("")
    const [status, setStatus] = useState(formStatuses.initial)
    const [validationErrors, setValidationErrors] = useState({});

    const { t } = useTranslation("Moderator");
    const { id } = useParams();
    const dataProvider = useData();
    const privateData = useContext(PrivateDataContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const validateInput = () => {
        const res = {}

        const fields = Object.keys(initialState)

        for (const index in fields) {
            let field = fields[index]

            if (input[field] === initialState[field]) {
                res[field] = t("CVs.form.emptyField")
            }
        }

        return res
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = validateInput()

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            setStatus(formStatuses.error)
        } else {
            setStatus(formStatuses.pending)
            dataProvider.setStatus(DATA_RESOURCES.cvs, id, CVStatuses.rejected, input.info)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                        setStatus(formStatuses.error)
                    } else {
                        setError("")
                        privateData.refreshCVList()
                        setStatus(formStatuses.success)
                    }
                })
        }
    }

    if (status === formStatuses.success) {
        return (<Navigate to={backTo} />)
    }
    return (
        <div>
            <div className="row">
                <FormContainer onSubmit={(event) => handleSubmit(event)}>
                    <HeaderText text={t("CVs.form.header")} />

                    <InputText id="info" name="info" value={input.info} label={t("CVs.form.info")}
                        errorText={validationErrors?.info ?? ""}
                        onChange={(event) => handleChange(event)} />

                    <div className="col-12">
                        <SubmitButton label={t("CVs.actions.reject")}
                            disabled={(status === formStatuses.pending || status === formStatuses.prefilling)} />
                    </div>
                    <ErrorLabel errorText={error} />
                </FormContainer>
            </div>
        </div>
    );
}

export default ModeratorCVRejectForm;
