import React, { useState } from 'react';
import { Link, Navigate } from "react-router-dom";

import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/AuthProvider.js';
import AppPaths from '../../routes/AppPaths.js';

import { FormContainer, HeaderText, InputLogin, InputPassword, SubmitButton, formStatuses } from "../../components/common/FormFields.js";
import { ErrorLabel } from '../../components/common/UICommon.js';


const initialState = { login: "", password: "", error: "" }

const AccountSignInForm = (props) => {

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

    const handleSubmit = (e) => {
        e.preventDefault()
        setStatus(formStatuses.pending)

        auth.logInFunc(input.login, input.password)
            .then(isSuccess => {
                if (!isSuccess) {
                    setError(t("SignIn.Incorrect login or password"))
                    setStatus(formStatuses.error)
                } else {
                    setStatus(formStatuses.success)
                }
            })

        setInput((prev) => ({
            ...prev,
            "password": "",
        }));
    }

    if (auth.isAuthenticated) {
        return (<Navigate to={auth.personalPathFunc()} replace={true} />)
    }
    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row">
                    <FormContainer onSubmit={(event) => handleSubmit(event)}>
                        <HeaderText text={t("SignIn.header")} />

                        <InputLogin id="login" name="login" value={input.login} label={t("SignIn.Login")}
                            onChange={(event) => handleChange(event)} />

                        <InputPassword id="password" name="password" value={input.password} label={t("SignIn.Password")}
                            onChange={(event) => handleChange(event)} />

                        <div className="col-12">
                            <SubmitButton label={t("SignIn.Submit")} disabled={(status === formStatuses.pending)} />
                        </div>

                        <Link className="mt-5 mb-2"
                            key="Register" to={AppPaths.signup}>
                            {t("SignUp.header")}
                        </Link>
                        <ErrorLabel errorText={error} />

                    </FormContainer>
                </div>
            </div>
        </div>
    );
}


export default AccountSignInForm;
