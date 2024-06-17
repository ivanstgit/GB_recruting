import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { useData, DATA_RESOURCES, PrivateDataContext } from '../../hooks/DataProvider.js'

import {
    FormContainer, formStatuses,
    HeaderText, SubmitButton, InputSelect, SubHeaderText, FormButton
} from "../../components/common/FormFields.js";
import { ErrorLabel, Loading } from '../../components/common/UICommon.js';
import { VacancyResponseStatuses } from '../../components/shared/VacancyResponse.js';
import { VacancyCard } from '../../components/shared/Vacancy.js';
import { CVStatuses } from '../../components/shared/CV.js';

const initialState = {
    cv: "",
    vacancy: "",
}

const EmployeeVacancyResponseForm = ({ backTo }) => {
    const [vacancy, setVacancy] = useState({});

    const [input, setInput] = useState(initialState);
    const [error, setError] = useState("")
    const [status, setStatus] = useState(formStatuses.prefill)
    const [validationErrors, setValidationErrors] = useState({});

    const { t } = useTranslation("SharedVacancyResponse");

    const dataProvider = useData()
    const privateData = useContext(PrivateDataContext)

    // const { id } = useParams();
    const location = useLocation()
    const vacancyId = location.state?.vacancyId

    const checkVacancyIsResponded = (vacancyId, CVId) => {
        return privateData.vacancyResponseList.filter(r => (r?.cv.id === CVId && r?.vacancy.id === vacancyId)).length > 0
    }

    const cvs = privateData.CVList
        .filter((cv) => (cv.status.id === CVStatuses.approved && !checkVacancyIsResponded(vacancyId, cv.id)))
        .map(function (x) {
            return { id: x.id, name: (x.title + " (" + x.position + ")") };
        });

    const emptyFieldError = t("form.fieldIsRequired")

    useEffect(() => {
        if (status === formStatuses.prefill) {
            // form prefill from server
            if (vacancyId) {
                dataProvider.getOne(DATA_RESOURCES.vacancies, vacancyId)
                    .then((res) => {
                        if (res.error) {
                            setError(res.error)
                            setStatus(formStatuses.error)
                        } else {
                            setVacancy(res.data)
                            setInput(
                                {
                                    cv: "",
                                    vacancy: vacancyId,
                                })
                            setError("")
                            setStatus(formStatuses.initial)
                        }
                    })
            } else {
                setError(t("form.errorInvalidVacancy"))
                setStatus(formStatuses.error)
            }
        }
        // eslint-disable-next-line
    }, [vacancyId]);

    const validateInput = () => {
        const res = {}

        const fields = Object.keys(initialState)
        const reqiredFields = ["cv", "vacancy"]

        for (const index in fields) {
            let field = fields[index]

            if ((input[field] === initialState[field]) && reqiredFields.includes(field)) {
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

    const handleSubmit = (e, sendToEmployer = false) => {
        e.preventDefault()
        setStatus(formStatuses.pending)

        const errors = validateInput()

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            setStatus(formStatuses.error)
        } else {
            let data = input

            dataProvider.postOne(DATA_RESOURCES.vacancyResponses, data)
                .then(res => {
                    if (res.error) {
                        if (res.data) {
                            setValidationErrors(res.data)
                        } else {
                            setError(res.error)
                        }
                        setStatus(formStatuses.error)
                    } else {
                        if (sendToEmployer) {
                            dataProvider.setStatus(DATA_RESOURCES.vacancyResponses, res.data.id, VacancyResponseStatuses.pending)
                                .then((res) => {
                                    if (res.error) {
                                        setError(res.error)
                                    } else {
                                        privateData.refreshVacancyResponseList()
                                        setStatus(formStatuses.success)
                                    }
                                })
                        } else {
                            privateData.refreshVacancyResponseList()
                            setStatus(formStatuses.success)
                        }
                    }
                })
        }
    }

    if (status === formStatuses.success) {
        return (<Navigate to={backTo} />)
    }
    if (status === formStatuses.prefilling || status === formStatuses.prefill) {
        return (<Loading />)
    }
    if (!vacancy?.id) {
        return (
            <ErrorLabel errorText={error} />
        )
    }
    return (
        <div className="">
            <div className="row">
                <FormContainer onSubmit={(event) => handleSubmit(event)}>
                    <HeaderText text={t("form.headerCreate")} />

                    {/* Vacancy */}
                    <SubHeaderText text={t("fields.vacancy")} />
                    <VacancyCard item={vacancy} />

                    {/* CV */}
                    <SubHeaderText text={t("fields.CV")} />
                    <InputSelect id="cv" name="cv" value={input.cv}
                        label={t("fields.CV")} errorText={validationErrors?.cv ?? ""}
                        onChange={(event) => handleChange(event)}
                        options={cvs}
                    />

                    <div className="row">
                        <div className="col-6">
                            <SubmitButton label={t("form.Save")} helpText={t("form.SaveHelp")}
                                disabled={(status === formStatuses.pending || status === formStatuses.prefilling)} />
                        </div>
                        <div className="col-6">
                            <FormButton label={t("form.SaveSend")} helpText={t("form.SaveSendHelp")}
                                onClick={(event) => handleSubmit(event, true)}
                                disabled={(status === formStatuses.pending || status === formStatuses.prefilling)} />
                        </div>
                    </div>
                    <ErrorLabel errorText={error} />
                </FormContainer>
            </div>

        </div>
    );
}

export default EmployeeVacancyResponseForm;
