import React, { useState } from 'react';
import { Navigate } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import { useData, DATA_RESOURCES } from '../hooks/DataProvider.js'

import {
    FormContainer, formStatuses,
    HeaderText, InputText, SubmitButton, InputTextArea, InputDate, InputRadioButtonGroup, InputEmail
} from "./LibFormFields.js";
import AppPaths from '../routes/AppPaths.js';
import { ErrorLabel } from './LibUICommon.js';
import { useAuth } from '../hooks/AuthProvider.js';

const initialState = {
    name: "",
    birthday: "",
    gender: "",
    email: "",
    city: "",
    description: "",
    skills: []
}

const EmployeeProfileForm = (props) => {

    const [genders, setGenders] = useState([]);
    const [cities, setCities] = useState([]);

    const [input, setInput] = useState(initialState);
    const [error, setError] = useState("")
    const [status, setStatus] = useState(formStatuses.prefill)
    const [validationErrors, setValidationErrors] = useState({});

    const { t } = useTranslation("Employee");

    const auth = useAuth()
    const dataProvider = useData()

    const profile = dataProvider.employeeProfile?.[0] ?? null

    const isEdit = profile ? true : false

    if (status === formStatuses.prefill) {
        // genders & cities
        // setStatus(formStatuses.prefilling)
        setStatus(formStatuses.initial)

        if (isEdit) {

            setInput(
                {
                    name: profile.name,
                    birthday: profile.birthday,
                    gender: profile.gender.id,
                    email: profile.email,
                    city: profile.city.id,
                    description: profile.description,
                    skills: profile.skills
                })
            setError("")


        } else {
            setInput((prev) => ({
                ...prev,
                name: auth.user.lastName + auth.user.firstName ?? prev.name,
                email: auth.user.email ?? prev.email,
            }));
        }
    }

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
        if (isEdit) {
            dataProvider.putOne(DATA_RESOURCES.employeeProfile, profile.id, input)
                .then(res => {
                    if (res.error) {
                        if (res.data) {
                            setValidationErrors(res.data)
                        } else {
                            setError(res.error)
                        }
                        setStatus(formStatuses.error)
                    } else {
                        setStatus(formStatuses.success)
                        dataProvider.refreshDelayed(DATA_RESOURCES.employeeProfile)
                    }
                })
        } else {
            dataProvider.postOne(DATA_RESOURCES.employeeProfile, input)
                .then(res => {
                    if (res.error) {
                        if (res.data) {
                            setValidationErrors(res.data)
                        } else {
                            setError(res.error)
                        }
                        setStatus(formStatuses.error)
                    } else {
                        setStatus(formStatuses.success)
                        dataProvider.refreshDelayed(DATA_RESOURCES.employeeProfile)
                    }
                })

        }
    }

    if (status === formStatuses.success) {
        return (<Navigate to={AppPaths.employee.home} replace={true} />)
    }
    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row">
                    <FormContainer onSubmit={(event) => handleSubmit(event)}>
                        <HeaderText text={isEdit ? t("Profile.form.headerEdit") : t("Profile.form.headerCreate")} />

                        <InputText id="name" name="name" value={input.name} label={t("Profile.form.name")}
                            errorText={validationErrors?.name ?? ""}
                            onChange={(event) => handleChange(event)} />

                        <InputDate id="birthday" name="birthday" value={input.birthday} label={t("Profile.form.birthday")}
                            errorText={validationErrors?.birthday ?? ""}
                            onChange={(event) => handleChange(event)} />

                        <InputRadioButtonGroup id="gender" name="gender" value={input.gender}
                            label={t("Profile.form.gender")} errorText={validationErrors?.gender ?? ""}
                            onChange={(event) => handleChange(event)}
                            options={genders}
                        />

                        <InputEmail id="email" name="email" value={input.email} label={t("Profile.form.email")}
                            errorText={validationErrors?.email ?? ""}
                            onChange={(event) => handleChange(event)} />

                        <InputRadioButtonGroup id="city" name="city" value={input.city}
                            label={t("Profile.form.city")} errorText={validationErrors?.city ?? ""}
                            onChange={(event) => handleChange(event)}
                            options={cities}
                        />

                        <InputTextArea id="description" name="description" value={input.description} label={t("Profile.form.description")}
                            errorText={validationErrors?.description ?? ""}
                            onChange={(event) => handleChange(event)} rows="5" />

                        <div className="col-12">
                            <SubmitButton label={isEdit ? t("Profile.actions.edit") : t("Profile.actions.create")}
                                disabled={(status === formStatuses.pending || status === formStatuses.prefilling)} />
                        </div>
                        <ErrorLabel errorText={error} />
                    </FormContainer>
                </div>
            </div>
        </div>
    );
}

export default EmployeeProfileForm;
