import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { useData, DATA_RESOURCES, PrivateDataContext } from '../../hooks/DataProvider.js'

import {
    FormContainer, formStatuses,
    HeaderText, InputText, SubmitButton, InputTextArea, InputSelect, SubHeaderText, InputNumber
} from "../../components/common/FormFields.js";
import { ErrorLabel, Loading, WarningLabel } from '../../components/common/UICommon.js';
import { VacancyStatuses } from '../../components/shared/Vacancy.js';

const initialState = {
    title: "",
    position: "",
    city: "",
    salary: 0,
    description: "",
}

const EmployerVacancyForm = ({ backTo }) => {

    const [cities, setCities] = useState([]);

    const [input, setInput] = useState(initialState);
    const [isBlocked, setIsBlocked] = useState(false)
    const [error, setError] = useState("")
    const [status, setStatus] = useState(formStatuses.prefill)
    const [validationErrors, setValidationErrors] = useState({});

    const { t } = useTranslation("SharedVacancy");

    const dataProvider = useData()
    const privateData = useContext(PrivateDataContext)

    const { id } = useParams();
    const location = useLocation()
    const fromId = location.state?.fromId

    const isEdit = id ? true : false
    const isCopy = fromId ? true : false

    const empty_field_error = t("form.fieldIsRequired")

    useEffect(() => {
        if (status === formStatuses.prefill) {
            // cities
            setStatus(formStatuses.prefilling)
            dataProvider.getList(DATA_RESOURCES.commonCities)
                .then((res) => {
                    setCities(res?.data ?? [])
                })

            // form prefill from server
            if (isEdit || isCopy) {
                let src = id ?? fromId
                dataProvider.getOne(DATA_RESOURCES.vacancies, src)
                    .then((res) => {
                        if (res.error) {
                            setError(res.error)
                            setStatus(formStatuses.error)
                        } else {
                            setInput(
                                {
                                    title: res.data.title,
                                    position: res.data.position,
                                    salary: res.data.salary,
                                    city: res.data.city.id,
                                    description: res.data.description,
                                })
                            setError("")
                            if (isEdit && (
                                res.data.status?.id === VacancyStatuses.approved ||
                                res.data.status?.id === VacancyStatuses.pending)
                            ) {
                                setIsBlocked(true)
                            } else {
                                setIsBlocked(false)
                            }
                            setStatus(formStatuses.initial)
                        }
                    })
            } else {
                setStatus(formStatuses.initial)
            }
        }
        // eslint-disable-next-line
    }, [status]);

    const validateInput = () => {
        const res = {}

        const fields = Object.keys(initialState)
        const reqiredFields = ["title", "description", "position"]

        for (const index in fields) {
            let field = fields[index]

            if ((input[field] === initialState[field]) && reqiredFields.includes(field)) {
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
                dataProvider.putOne(DATA_RESOURCES.vacancies, id, data)
                    .then(res => {
                        if (res.error) {
                            if (res.data) {
                                setValidationErrors(res.data)
                            } else {
                                setError(res.error)
                            }
                            setStatus(formStatuses.error)
                        } else {
                            privateData.refreshVacancyList()
                            setStatus(formStatuses.success)
                        }
                    })
            } else {
                dataProvider.postOne(DATA_RESOURCES.vacancies, data)
                    .then(res => {
                        if (res.error) {
                            if (res.data) {
                                setValidationErrors(res.data)
                            } else {
                                setError(res.error)
                            }
                            setStatus(formStatuses.error)
                        } else {
                            privateData.refreshVacancyList()
                            setStatus(formStatuses.success)
                        }
                    })
            }
        }
    }

    if (status === formStatuses.success) {
        return (<Navigate to={backTo} />)
    }
    if (status === formStatuses.prefilling) {
        return (<Loading />)
    }
    if (isBlocked) {
        return (
            <div className="container-xxl">
                <div className="row mb-1">
                    <WarningLabel text={t("form.Warnings.Blocked")} />
                </div>
            </div>
        )
    }
    // const cities2 = cities
    return (
        <div className="">
            <div className="row">
                <FormContainer onSubmit={(event) => handleSubmit(event)}>
                    <HeaderText text={isEdit ? t("form.headerEdit") : t("form.headerCreate")} />

                    {/* Internal information */}
                    <SubHeaderText text={t("internal.header")} />

                    <InputText id="title" name="title" value={input.title} label={t("internal.title")}
                        errorText={validationErrors?.title ?? ""}
                        onChange={(event) => handleChange(event)} />

                    {/* Position */}
                    <SubHeaderText text={t("position.header")} />
                    <InputText id="position" name="position" value={input.position} label={t("position.position")}
                        errorText={validationErrors?.position ?? ""}
                        onChange={(event) => handleChange(event)} />
                    <InputSelect id="city" name="city" value={input.city}
                        label={t("position.city")} errorText={validationErrors?.city ?? ""}
                        onChange={(event) => handleChange(event)}
                        options={cities}
                    />
                    <InputNumber id="salary" name="salary" value={input.salary} label={t("position.salary")}
                        errorText={validationErrors?.salary ?? ""}
                        onChange={(event) => handleChange(event)} />
                    <InputTextArea id="description" name="description" value={input.description} label={t("position.description")}
                        errorText={validationErrors?.description ?? ""}
                        onChange={(event) => handleChange(event)} rows="5"
                        helpText={t("position.descriptionHelp")} />


                    <div className="col-12">
                        <SubmitButton label={isEdit ? t("actions.edit") : t("actions.create")}
                            disabled={(status === formStatuses.pending || status === formStatuses.prefilling)} />
                    </div>
                    <ErrorLabel errorText={error} />
                </FormContainer>
            </div>

        </div>
    );
}

export default EmployerVacancyForm;
