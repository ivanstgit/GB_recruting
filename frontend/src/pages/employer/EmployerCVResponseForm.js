import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { useData, DATA_RESOURCES, PrivateDataContext } from '../../hooks/DataProvider.js'

import {
    FormContainer, formStatuses,
    HeaderText, SubmitButton, InputSelect, SubHeaderText, FormButton
} from "../../components/common/FormFields.js";
import { ErrorLabel, Loading } from '../../components/common/UICommon.js';
import { CVResponseStatuses } from '../../components/shared/CVResponse.js';
import { VacancyStatuses } from '../../components/shared/Vacancy.js';
import { CVCard } from '../../components/shared/CV.js';

const initialState = {
    cv: "",
    vacancy: "",
}

const EmployerCVResponseForm = ({ backTo }) => {
    const [CV, setCV] = useState({});

    const [input, setInput] = useState(initialState);
    const [error, setError] = useState("")
    const [status, setStatus] = useState(formStatuses.prefill)
    const [validationErrors, setValidationErrors] = useState({});

    const { t } = useTranslation("SharedCVResponse");

    const dataProvider = useData()
    const privateData = useContext(PrivateDataContext)

    // const { id } = useParams();
    const location = useLocation()
    const CVId = location.state?.CVId

    const checkCVIsResponded = (CVId, vacancyId) => {
        return privateData.CVResponseList.filter(r => (r?.cv.id === CVId && r?.vacancy.id === vacancyId)).length > 0
    }

    const vacancies = privateData.vacancyList
        .filter((v) => (v.status.id === VacancyStatuses.approved && !checkCVIsResponded(CVId, v.id)))
        .map(function (x) {
            return { id: x.id, name: (x.title + " (" + x.position + ", " + x.city.name + ")") };
        });

    const emptyFieldError = t("form.fieldIsRequired")

    useEffect(() => {
        if (status === formStatuses.prefill) {
            // form prefill from server
            if (CVId) {
                dataProvider.getOne(DATA_RESOURCES.cvs, CVId)
                    .then((res) => {
                        if (res.error) {
                            setError(res.error)
                            setStatus(formStatuses.error)
                        } else {
                            setCV(res.data)
                            setInput(
                                {
                                    cv: CVId,
                                    vacancy: "",
                                })
                            setError("")
                            setStatus(formStatuses.initial)
                        }
                    })
            } else {
                setError(t("form.errorInvalidCV"))
                setStatus(formStatuses.error)
            }
        }
        // eslint-disable-next-line
    }, [CVId]);

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
        // if (checkCVIsResponded(input.cv, input.vacancy)) {
        //     res["vacancy"] = t("form.errorAlreadyResponded")
        // }
        return res
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = (e, sendToEmployee = false) => {
        e.preventDefault()
        setStatus(formStatuses.pending)

        const errors = validateInput()

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            setStatus(formStatuses.error)
        } else {
            let data = input

            dataProvider.postOne(DATA_RESOURCES.cvResponses, data)
                .then(res => {
                    if (res.error) {
                        if (res.data) {
                            setValidationErrors(res.data)
                        } else {
                            setError(res.error)
                        }
                        setStatus(formStatuses.error)
                    } else {
                        if (sendToEmployee) {
                            dataProvider.setStatus(DATA_RESOURCES.cvResponses, res.data.id, CVResponseStatuses.pending)
                                .then((res) => {
                                    if (res.error) {
                                        setError(res.error)
                                    } else {
                                        privateData.refreshCVResponseList()
                                        setStatus(formStatuses.success)
                                    }
                                })
                        } else {
                            privateData.refreshCVResponseList()
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
    return (
        <div className="">
            <div className="row">
                <FormContainer onSubmit={(event) => handleSubmit(event)}>
                    <HeaderText text={t("form.headerCreate")} />

                    {/* CV */}
                    <SubHeaderText text={t("fields.CV")} />
                    <CVCard item={CV} />

                    {/* Vacancy */}
                    <SubHeaderText text={t("fields.vacancy")} />
                    <InputSelect id="vacancy" name="vacancy" value={input.vacancy}
                        label={t("fields.vacancy")} errorText={validationErrors?.vacancy ?? ""}
                        onChange={(event) => handleChange(event)}
                        options={vacancies}
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

export default EmployerCVResponseForm;
