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
    established: "",
    email: "",
    city: "",
    description: "",
    welcome_letter: ""
}

const EmployerProfileForm = (props) => {

    const [cities, setCities] = useState([]);

    const [input, setInput] = useState(initialState);
    const [error, setError] = useState("")
    const [status, setStatus] = useState(formStatuses.prefill)
    const [validationErrors, setValidationErrors] = useState({});

    const { t } = useTranslation("Employer");

    const auth = useAuth()
    const dataProvider = useData()

    const profile = dataProvider.employerProfile?.[0] ?? null
    const isEdit = profile ? true : false
    const empty_field_error = t("Errors.FieldIsRequired")

    useEffect(() => {
        if (status === formStatuses.prefill) {
            // genders & cities
            setStatus(formStatuses.prefilling)
            dataProvider.getList(DATA_RESOURCES.commonCities)
                .then((res) => {
                    setCities(res?.data ?? [])
                })

            // form prefill from existing profile or user data
            if (isEdit) {
                setInput(
                    {
                        name: profile.name,
                        established: profile.established,
                        email: profile.email,
                        city: profile.city.id,
                        description: profile.description,
                        welcome_letter: profile.welcome_letter
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
                res[field] = empty_field_error
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
            if (isEdit) {
                dataProvider.putOne(DATA_RESOURCES.employer, profile.id, data)
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
                            dataProvider.refreshDelayed(DATA_RESOURCES.employer)
                        }
                    })
            } else {
                dataProvider.postOne(DATA_RESOURCES.employer, data)
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
                            dataProvider.refreshDelayed(DATA_RESOURCES.employer)
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

                    <InputDate id="established" name="established" value={input.established} label={t("Profile.form.established")}
                        errorText={validationErrors?.established ?? ""}
                        onChange={(event) => handleChange(event)} />

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

                    <InputTextArea id="welcome_letter" name="welcome_letter" value={input.welcome_letter} label={t("Profile.form.welcome_letter")}
                        errorText={validationErrors?.welcome_letter ?? ""}
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

export default EmployerProfileForm;