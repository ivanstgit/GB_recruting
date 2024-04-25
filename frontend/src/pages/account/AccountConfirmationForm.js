import React, { useState } from 'react';
import { Navigate, useLocation } from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { useAuth, accountConfirm, accountConfirmResend } from '../../hooks/AuthProvider.js';

import { AdditionalActionLink, FormContainer, HeaderText, InputText, SubmitButton, formStatuses } from "../../components/LibFormFields.js"
import { ErrorLabel, WarningLabel } from '../../components/LibUICommon.js';

const AccountConfirmationForm = (props) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const initialState = {
        username: searchParams.get("username") ?? "",
        token: searchParams.get("token") ?? "",
    }

    const [input, setInput] = useState(initialState);
    const [error, setError] = useState("")
    const [status, setStatus] = useState(formStatuses.initial)

    const auth = useAuth()
    const { t } = useTranslation("Account");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleResend = (e) => {
        accountConfirmResend(auth.tokenFunc())
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setStatus(formStatuses.pending)

        accountConfirm(input.username, input.token)
            .then((res) => {
                if (res.error) {
                    setError(res.error)
                    setStatus(formStatuses.error)
                } else {
                    if (auth.isAuthenticated) {
                        auth.userRefreshFunc()
                            .then(() => {
                                setStatus(formStatuses.success)
                            })
                    } else {
                        setStatus(formStatuses.success)
                    }
                }
            })
    }

    if ((auth.isAuthenticated && auth.user.isValidated) || status === formStatuses.success) {
        return (<Navigate to={auth.personalPathFunc()} replace={true} />)
    }
    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row">
                    <FormContainer onSubmit={(event) => handleSubmit(event)}>
                        <HeaderText text={t("Confirmation.header")} />

                        <WarningLabel text={t("Confirmation.Label")} />

                        <InputText id="username" name="username" value={input.username} label={t("Confirmation.Username")}
                            onChange={(event) => handleChange(event)} />

                        <InputText id="token" name="token" value={input.token} label={t("Confirmation.Token")}
                            onChange={(event) => handleChange(event)} />

                        <SubmitButton label={t("Confirmation.Submit")} disabled={(status === formStatuses.pending)} />

                        <AdditionalActionLink label={t("Confirmation.Resend")} disabled={(status === formStatuses.pending)}
                            onClick={(event) => handleResend(event)} />

                        <ErrorLabel errorText={error} />
                    </FormContainer>

                </div>
            </div>
        </div>
    );
}


export default AccountConfirmationForm;
