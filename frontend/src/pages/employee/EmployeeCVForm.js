import React, { useState } from 'react';
import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { useData, DATA_RESOURCES } from '../../hooks/DataProvider.js'

import {
    FormContainer, formStatuses,
    HeaderText, InputText, SubmitButton, InputTextArea, InputDate, InputSelect, SubHeaderText, InputCheckBox, FormButton
} from "../../components/common/FormFields.js";
import { ErrorLabel } from '../../components/common/UICommon.js';
import { CVEducationCard, CVExperienceCard } from '../../components/shared/CV.js';


const initialState = {
    title: "",
    description: "",
    experience: [],
    education: []
}
const initialStateExperience = {
    datefrom: "",
    dateto: "",
    is_current: false,
    city: "",
    company: "",
    position: "",
    content: "",
}
const initialStateEducation = {
    date: "",
    institution: "",
    content: "",
}

const CVExperienceItem = ({ index, item, cityName }) => {

    return (
        <div>
            <CVExperienceCard item={item} cityName={cityName} />
        </div>
    )
}

const CVEducationItem = ({ index, item }) => {

    return (
        <div>
            <CVEducationCard item={item} />
        </div>
    )
}

const CVExperienceBlock = ({ index, item, cities, onSubmit }) => {

    const [input, setInput] = useState(initialStateExperience);
    const [status, setStatus] = useState(formStatuses.prefill)
    const [validationErrors, setValidationErrors] = useState({});

    const { t } = useTranslation("SharedCV");

    const empty_field_error = t("form.fieldIsRequired")

    const isEdit = (index > 0)

    if (status === formStatuses.prefill) {
        if (isEdit) {
            setInput(item)
        }
        setStatus(formStatuses.initial)
    }

    const validateInput = () => {
        const res = {}

        const fields = Object.keys(initialStateExperience)

        for (const index in fields) {
            let field = fields[index]

            if (input[field] === initialStateExperience[field]) {
                if (field === "is_current" || field === "dateto") {
                    if ((input.dateto === "") && (input.is_current === false)) {
                        res[field] = empty_field_error
                    }
                } else {
                    res[field] = empty_field_error
                }
            }
        }
        return res
    }

    const handleChange = (e) => {
        // let { name, value } = e.target;
        const { target } = e;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleClick = (e) => {
        e.preventDefault()
        setStatus(formStatuses.pending)

        const errors = validateInput()

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            setStatus(formStatuses.error)
        } else {
            onSubmit(input)
            setInput(initialStateExperience)
            setStatus(formStatuses.initial)
        }
    }

    return (
        <div>
            <div className="row g-3">
                <div className="col">

                    <InputDate id="datefrom" name="datefrom" value={input.datefrom} label={t("experience.interval") + ": " + t("experience.datefrom")}
                        errorText={validationErrors?.datefrom ?? ""}
                        onChange={(event) => handleChange(event)} />
                </div>
                <div className="col">
                    <InputDate id="dateto" name="dateto" value={input.dateto} label={t("experience.dateto")}
                        errorText={validationErrors?.dateto ?? ""}
                        onChange={(event) => handleChange(event)}
                        disabled={input.is_current} />
                    <InputCheckBox id="is_current" name="is_current" value={input.is_current} label={t("experience.is_current")}
                        errorText={validationErrors?.dateto ?? ""}
                        onChange={(event) => handleChange(event)} />
                </div>
            </div>

            <InputSelect id="city" name="city" value={input.city}
                label={t("experience.city")} errorText={validationErrors?.city ?? ""}
                onChange={(event) => handleChange(event)}
                options={cities}
            />

            <InputText id="company" name="company" value={input.company} label={t("experience.company")}
                errorText={validationErrors?.company ?? ""}
                onChange={(event) => handleChange(event)} />

            <InputText id="position" name="position" value={input.position} label={t("experience.position")}
                errorText={validationErrors?.position ?? ""}
                onChange={(event) => handleChange(event)} />

            <InputTextArea id="content" name="content" value={input.content} label={t("experience.content")}
                errorText={validationErrors?.content ?? ""}
                onChange={(event) => handleChange(event)} rows="5"
                helpText={t("experience.contentHelp")} />

            <FormButton label={isEdit ? t("actions.edit") : t("actions.add")} onClick={(e) => handleClick(e)} />
        </div>
    )
}


const CVEducationBlock = ({ index, item, onSubmit }) => {
    const [input, setInput] = useState(initialStateEducation);
    const [status, setStatus] = useState(formStatuses.prefill)
    const [validationErrors, setValidationErrors] = useState({});

    const { t } = useTranslation("SharedCV");

    const empty_field_error = t("form.fieldIsRequired")

    const isEdit = (index > 0)

    if (status === formStatuses.prefill) {
        if (isEdit) {
            setInput(item)
        }
        setStatus(formStatuses.initial)
    }

    const validateInput = () => {
        const res = {}

        const fields = Object.keys(initialStateEducation)

        for (const index in fields) {
            let field = fields[index]

            if (input[field] === initialStateEducation[field]) {
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

    const handleClick = (e) => {
        e.preventDefault()
        setStatus(formStatuses.pending)

        const errors = validateInput()

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            setStatus(formStatuses.error)
        } else {
            onSubmit(input)
            setInput(initialStateEducation)
            setStatus(formStatuses.initial)
        }
    }

    return (
        <div>
            <InputDate id="date" name="date" value={input.date} label={t("education.date")}
                errorText={validationErrors?.date ?? ""}
                onChange={(event) => handleChange(event)} />

            <InputText id="institution" name="institution" value={input.institution} label={t("education.institution")}
                errorText={validationErrors?.institution ?? ""}
                onChange={(event) => handleChange(event)} />

            <InputTextArea id="content" name="content" value={input.content} label={t("education.content")}
                errorText={validationErrors?.content ?? ""}
                onChange={(event) => handleChange(event)} rows="5"
                helpText={t("education.contentHelp")} />

            <FormButton label={isEdit ? t("actions.edit") : t("actions.add")} onClick={(e) => handleClick(e)} />
        </div>
    )
}


const EmployeeCVForm = (props) => {

    const [cities, setCities] = useState([]);

    const [input, setInput] = useState(initialState);
    const [error, setError] = useState("")
    const [status, setStatus] = useState(formStatuses.prefill)
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(-1);
    const [selectedEducationIndex, setSelectedEducationIndex] = useState(-1);

    const { t } = useTranslation("SharedCV");

    const dataProvider = useData()

    const { id } = useParams();
    const isEdit = id ? true : false

    const empty_field_error = t("form.fieldIsRequired")

    if (status === formStatuses.prefill) {
        // cities
        setStatus(formStatuses.prefilling)
        dataProvider.getList(DATA_RESOURCES.commonCities)
            .then((res) => {
                setCities(res?.data ?? [])
            })

        // form prefill from server
        if (isEdit) {
            dataProvider.getOne(DATA_RESOURCES.staffNews, id)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                        setStatus(formStatuses.error)
                    } else {
                        setInput(
                            {
                                title: res.data.title,
                                description: res.data.description,
                                experience: res.data.experience,
                                education: res.data.education
                            })
                        setError("")
                        setStatus(formStatuses.initial)
                    }
                })

        } else {
            setStatus(formStatuses.initial)
        }
    }

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

    const handleChangeExperience = (item) => {
        let exp = input.experience

        if (selectedExperienceIndex >= 0) {
            exp[selectedExperienceIndex] = item
        } else {
            exp.push(item)
        }

        setInput((prev) => ({
            ...prev,
            experience: exp,
        }));
        setSelectedExperienceIndex(-1)
    }

    const handleChangeEducation = (item) => {
        let edu = input.education

        if (selectedEducationIndex >= 0) {
            edu[selectedEducationIndex] = item
        } else {
            edu.push(item)
        }

        setInput((prev) => ({
            ...prev,
            education: edu,
        }));
        setSelectedEducationIndex(-1)
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
                dataProvider.putOne(DATA_RESOURCES.cvs, id, data)
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
                        }
                    })
            } else {
                dataProvider.postOne(DATA_RESOURCES.cvs, data)
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
                    <HeaderText text={isEdit ? t("form.headerEdit") : t("form.headerCreate")} />

                    {/* General information */}
                    <SubHeaderText text={t("generalInfo.header")} />

                    <InputText id="title" name="title" value={input.title} label={t("generalInfo.title")}
                        errorText={validationErrors?.title ?? ""}
                        onChange={(event) => handleChange(event)} />

                    <InputTextArea id="description" name="description" value={input.description} label={t("generalInfo.description")}
                        errorText={validationErrors?.description ?? ""}
                        onChange={(event) => handleChange(event)} rows="5" />

                    {/* Experience */}
                    <p> </p>
                    <SubHeaderText text={t("experience.header")} />
                    <div className="row g-3">
                        <div className="col">
                            {input.experience.map((item, index) => <CVExperienceItem
                                key={'ExperienceItem' + index}
                                index={index}
                                item={item}
                                cityName={cities.find(x => x.id === item.id).name}
                            />)}
                        </div>
                        <div className="col">
                            <CVExperienceBlock
                                index={selectedExperienceIndex}
                                item={input.experience[selectedExperienceIndex] ?? null}
                                cities={cities}
                                onSubmit={(item) => handleChangeExperience(item)} />
                        </div>
                    </div>

                    {/* Education */}
                    <p> </p>
                    <SubHeaderText text={t("education.header")} />

                    <div className="row g-3">
                        <div className="col">
                            {input.education.map((item, index) => <CVEducationItem
                                key={'EducationItem' + index}
                                index={index}
                                item={item}
                            />)}
                        </div>
                        <div className="col">
                            <CVEducationBlock
                                index={selectedEducationIndex}
                                item={input.education[selectedEducationIndex] ?? null}
                                onSubmit={(item) => handleChangeEducation(item)} />
                        </div>
                    </div>

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

export default EmployeeCVForm;
