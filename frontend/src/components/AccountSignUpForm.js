import React, { useState } from 'react';
import { Navigate, useLocation } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import { accountCreate, useAuth, userRoles } from '../hooks/AuthProvider';

import {
    FormContainer, HeaderText, InputEmail, InputPassword,
    InputRadioButtonGroup, InputText, SubmitButton, formStatuses
} from "../components/FormFields.js"
import { ErrorLabel } from './CommonUI.js';

const AccountSignUpForm = (props) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { t } = useTranslation("Account");
    const auth = useAuth()

    const initialInput = {
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        role: searchParams.get("role") ?? "",
        password: "",
        password2: ""
    }
    const roles = [
        [userRoles.employee, t("SignUp.Roles.employee")],
        [userRoles.employer, t("SignUp.Roles.employer")]]

    const [input, setInput] = useState(initialInput);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [status, setStatus] = useState(formStatuses.initial)

    const empty_field_error = t("SignUp.Errors.FieldIsRequired")

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const validateInput = () => {
        const res = {}

        const fields = Object.keys(initialInput)

        for (const index in fields) {
            let field = fields[index]
            if (field === "password2") {
                if (input.password !== input.password2) {
                    res[field] = t("SignUp.Errors.PasswordsDoNotMatch")
                }
            } else if (field === "role") {
                if (input[field] !== userRoles.employee && input[field] !== userRoles.employer) {
                    res[field] = empty_field_error
                }
            } else {
                if (input[field] === initialInput[field]) {
                    res[field] = empty_field_error
                }
            }
        }

        return res
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setStatus(formStatuses.pending)

        const errors = validateInput()

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            setStatus(formStatuses.error)
        } else {
            const data = input
            accountCreate(data)
                .then(res => {
                    if (res.error) {
                        if (res.data) {
                            setValidationErrors(res.data)
                        } else {
                            setError(res.error)
                        }
                        setStatus(formStatuses.error)
                    } else {
                        auth.logInFunc(data.username, data.password)
                            .then(isSuccess => {
                                if (!isSuccess) {
                                    setError(t("SignIn.Incorrect login or password"))
                                    setStatus(formStatuses.error)
                                } else {
                                    setStatus(formStatuses.success)
                                }
                            })
                    }
                })
        }
    }

    if (auth.isAuthenticated) {
        return (<Navigate to={auth.personalPathFunc()} replace={true} />)
    }
    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row">
                    <FormContainer onSubmit={(event) => handleSubmit(event)}>
                        <HeaderText text={t("SignUp.header")} />

                        <InputRadioButtonGroup id="role" name="role" value={input.role}
                            label={t("SignUp.Role")} errorText={validationErrors?.role ?? ""}
                            onChange={(event) => handleChange(event)}
                            options={roles}
                        />

                        <InputText id="firstName" name="first_name" value={input.first_name}
                            label={t("SignUp.FirstName")} errorText={validationErrors?.first_name ?? ""}
                            onChange={(event) => handleChange(event)} />

                        <InputText id="lastName" name="last_name" value={input.last_name}
                            label={t("SignUp.LastName")} errorText={validationErrors?.last_name ?? ""}
                            onChange={(event) => handleChange(event)} />

                        <InputEmail id="email" name="email" placeholder="user@mail.com" value={input.email}
                            label={t("SignUp.Email")} errorText={validationErrors?.email ?? ""}
                            onChange={(event) => handleChange(event)} />

                        <InputText id="login" name="username" value={input.username}
                            label={t("SignUp.Login")} errorText={t(validationErrors?.username ?? "")}
                            onChange={(event) => handleChange(event)} />

                        <InputPassword id="password" name="password" value={input.password}
                            label={t("SignUp.Password")} errorText={validationErrors?.password ?? ""}
                            helpText={t("SignUp.PasswordHelp")}
                            onChange={(event) => handleChange(event)} />

                        <InputPassword id="password2" name="password2" value={input.password2}
                            label={t("SignUp.Password2")} errorText={validationErrors?.password2 ?? ""}
                            onChange={(event) => handleChange(event)} />


                        <SubmitButton label={t("SignUp.Submit")} disabled={(status === formStatuses.pending)} />

                        <ErrorLabel errorText={error} />
                    </FormContainer>
                </div>
            </div>
        </div>
    );
}


export default AccountSignUpForm;
