import React, { useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../hooks/AuthProvider.js';
import { useData, DATA_RESOURCES } from '../../hooks/DataProvider.js'

import {
    FormContainer, formStatuses,
    HeaderText, InputText, SubmitButton, InputTextArea, InputDate, InputEmail, InputSelect
} from "../../components/common/FormFields.js";
import { ErrorLabel } from '../../components/common/UICommon.js';


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
    const emptyFieldError = t("Errors.FieldIsRequired")

    useEffect(() => {
        if (status === formStatuses.prefill) {
            // genders & cities
            setStatus(formStatuses.prefilling)
            dataProvider.getList(DATA_RESOURCES.commonGenders)
                .then((res) => {
                    setGenders(res?.data ?? [])
                })
            dataProvider.getList(DATA_RESOURCES.commonCities)
                .then((res) => {
                    setCities(res?.data ?? [])
                })

            // form prefill from existing profile or user data
            if (isEdit) {
                setInput(
                    {
                        name: profile.name,
                        birthday: profile.birthday,
                        gender: profile.gender.id,
                        email: profile.email,
                        city: profile.city.id,
                        description: profile.description,
                        skills: profile.skills.join("\n")
                    })
                setError("")

            } else {
                setInput((prev) => ({
                    ...prev,
                    name: auth.user.lastName + auth.user.firstName ?? prev.name,
                    email: auth.user.email ?? prev.email,
                }));
            }
            setStatus(formStatuses.initial)
        }
        // eslint-disable-next-line
    }, [status]);

    const validateInput = () => {
        const res = {}

        const fields = Object.keys(initialState)

        for (const index in fields) {
            let field = fields[index]

            if (input[field] === initialState[field]) {
                res[field] = emptyFieldError
            }
        }

        return res
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setStatus(formStatuses.pending)

        const errors = validateInput()

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            setStatus(formStatuses.error)
        } else {
            let data = input
            data.skills = data.skills.split("\n")
            if (isEdit) {
                dataProvider.putOne(DATA_RESOURCES.employee, profile.id, data)
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
                            dataProvider.refreshDelayed(DATA_RESOURCES.employee)
                        }
                    })
            } else {
                dataProvider.postOne(DATA_RESOURCES.employee, data)
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
                            dataProvider.refreshDelayed(DATA_RESOURCES.employee)
                        }
                    })

            }
        }
    }

    if (status === formStatuses.success) {
        return (<Navigate to={"../"} />)
    }
    return (
        <div className="container-xxl">
            <div className="row">
                <FormContainer onSubmit={(event) => handleSubmit(event)}>
                    <HeaderText text={isEdit ? t("Profile.form.headerEdit") : t("Profile.form.headerCreate")} />

                    <InputText id="name" name="name" value={input.name} label={t("Profile.form.name")}
                        errorText={validationErrors?.name ?? ""}
                        onChange={(event) => handleChange(event)} />

                    <InputDate id="birthday" name="birthday" value={input.birthday} label={t("Profile.form.birthday")}
                        errorText={validationErrors?.birthday ?? ""}
                        onChange={(event) => handleChange(event)} />

                    <InputSelect id="gender" name="gender" value={input.gender}
                        label={t("Profile.form.gender")} errorText={validationErrors?.gender ?? ""}
                        onChange={(event) => handleChange(event)}
                        options={genders}
                    />

                    <InputEmail id="email" name="email" value={input.email} label={t("Profile.form.email")}
                        errorText={validationErrors?.email ?? ""}
                        onChange={(event) => handleChange(event)} />

                    <InputSelect id="city" name="city" value={input.city}
                        label={t("Profile.form.city")} errorText={validationErrors?.city ?? ""}
                        onChange={(event) => handleChange(event)}
                        options={cities}
                    />

                    <InputTextArea id="description" name="description" value={input.description} label={t("Profile.form.description")}
                        errorText={validationErrors?.description ?? ""}
                        onChange={(event) => handleChange(event)} rows="5" />

                    <InputTextArea id="skills" name="skills" value={input.skills} label={t("Profile.form.skills")}
                        errorText={validationErrors?.skills ?? ""}
                        onChange={(event) => handleChange(event)} rows="5" />

                    <div className="col-12">
                        <SubmitButton label={isEdit ? t("Profile.actions.edit") : t("Profile.actions.create")}
                            disabled={(status === formStatuses.pending || status === formStatuses.prefilling)} />
                    </div>
                    <ErrorLabel errorText={error} />
                </FormContainer>
            </div>

        </div>
    );
}

export default EmployeeProfileForm;
