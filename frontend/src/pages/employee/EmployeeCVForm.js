import React, { useState } from 'react';
import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { useData, DATA_RESOURCES } from '../../hooks/DataProvider.js'

import {
    FormContainer, formStatuses,
    HeaderText, InputText, SubmitButton, InputTextArea, InputDate, InputSelect, SubHeaderText, InputCheckBox, FormButton
} from "../../components/common/FormFields.js";
import { ErrorLabel, Loading, commonActions } from '../../components/common/UICommon.js';
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
    specialty: "",
    content: "",
}

const CVExperienceItem = ({ index, item, cityName, onEdit, onDelete }) => {
    let actions = {}
    actions[commonActions.edit] = () => onEdit(index)
    actions[commonActions.delete] = () => onDelete(index)
    return (
        <div>
            <CVExperienceCard item={item} cityName={cityName} actions={actions} />
        </div>
    )
}

const CVEducationItem = ({ index, item, onEdit, onDelete }) => {
    let actions = {}
    actions[commonActions.edit] = () => onEdit(index)
    actions[commonActions.delete] = () => onDelete(index)
    return (
        <div>
            <CVEducationCard item={item} actions={actions} />
        </div>
    )
}

const CVExperienceBlock = ({ index, item, cities, onSubmit }) => {

    const [currentIndex, setCurrentIndex] = useState(-1);
    const [input, setInput] = useState(initialStateExperience);
    const [status, setStatus] = useState(formStatuses.prefill)
    const [validationErrors, setValidationErrors] = useState({});

    const { t } = useTranslation("SharedCV");

    const empty_field_error = t("form.fieldIsRequired")

    const isEdit = (index >= 0)

    if ((index !== currentIndex) || (status === formStatuses.prefill)) {
        if (isEdit) {
            setInput(item)
        }
        setCurrentIndex(index)
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

    const handleSubmit = (e) => {
        e.preventDefault()
        setStatus(formStatuses.pending)

        const errors = validateInput()

        let data = input
        if (data.is_current) {
            data.dateto = new Date().toISOString().substring(0, 10)
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            setStatus(formStatuses.error)
        } else {
            onSubmit(data)
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

            <FormButton label={isEdit ? t("actions.edit") : t("actions.add")} onClick={(e) => handleSubmit(e)} />
        </div>
    )
}


const CVEducationBlock = ({ index, item, isSelected, onSubmit }) => {
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [input, setInput] = useState(initialStateEducation);
    const [status, setStatus] = useState(formStatuses.prefill)
    const [validationErrors, setValidationErrors] = useState({});

    const { t } = useTranslation("SharedCV");

    const empty_field_error = t("form.fieldIsRequired")

    const isEdit = (index >= 0)

    if ((index !== currentIndex) || (status === formStatuses.prefill)) {
        if (isEdit) {
            setInput(item)
        }
        setCurrentIndex(index)
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

    const handleSubmit = (e) => {
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
            <InputDate name="date" value={input.date} label={t("education.date")}
                errorText={validationErrors?.date ?? ""}
                onChange={(event) => handleChange(event)} />

            <InputText name="institution" value={input.institution} label={t("education.institution")}
                errorText={validationErrors?.institution ?? ""}
                onChange={(event) => handleChange(event)} />

            <InputText name="specialty" value={input.specialty} label={t("education.specialty")}
                errorText={validationErrors?.specialty ?? ""}
                onChange={(event) => handleChange(event)} />

            <InputTextArea name="content" value={input.content} label={t("education.content")}
                errorText={validationErrors?.content ?? ""}
                onChange={(event) => handleChange(event)} rows="5"
                helpText={t("education.contentHelp")} />

            <FormButton label={isEdit ? t("actions.edit") : t("actions.add")} onClick={(e) => handleSubmit(e)} />
        </div>
    )
}


const EmployeeCVForm = ({ backTo }) => {

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
            dataProvider.getOne(DATA_RESOURCES.cvs, id)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                        setStatus(formStatuses.error)
                    } else {
                        let expList = res.data.experience
                        expList.forEach(el => {
                            el.city = el.city.id
                        });
                        setInput(
                            {
                                title: res.data.title,
                                description: res.data.description,
                                experience: expList,
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
        const reqiredFields = ["title", "description"]

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

    const handleEditExperience = (index) => {
        console.log("edit " + index)
        if (selectedExperienceIndex !== index) {
            setSelectedExperienceIndex(index)
        }
    }

    const handleDeleteExperience = (index) => {
        console.log("delete " + index)

        let exp = input.experience

        if (selectedExperienceIndex === index) {
            setSelectedExperienceIndex(-1)
        }
        exp.splice(index, 1)

        setInput((prev) => ({
            ...prev,
            experience: exp,
        }));
    }

    const handleSubmitExperience = (item) => {
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

    const handleEditEducation = (index) => {
        console.log("edit " + index)
        if (selectedEducationIndex !== index) {
            setSelectedEducationIndex(index)
        }
    }

    const handleDeleteEducation = (index) => {
        console.log("delete " + index)

        let edu = input.education

        if (selectedEducationIndex === index) {
            setSelectedEducationIndex(-1)
        }
        edu.splice(index, 1)

        setInput((prev) => ({
            ...prev,
            education: edu,
        }));
    }
    const handleSubmitEducation = (item) => {
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
        return (<Navigate to={backTo} />)
    }
    if (status === formStatuses.prefilling) {
        return (<Loading />)
    }
    const cities2 = cities
    return (
        <div className="">
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
                                cityName={cities.find(x => x.id === Number(item.city))?.name ?? ""}
                                onEdit={handleEditExperience}
                                onDelete={handleDeleteExperience}
                            />)}
                        </div>
                        <div className="col">
                            <CVExperienceBlock
                                index={selectedExperienceIndex}
                                item={input.experience[selectedExperienceIndex] ?? null}
                                cities={cities2}
                                onSubmit={(item) => handleSubmitExperience(item)} />
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
                                onEdit={handleEditEducation}
                                onDelete={handleDeleteEducation}
                            />)}
                        </div>
                        <div className="col">
                            <CVEducationBlock
                                index={selectedEducationIndex}
                                item={input.education[selectedEducationIndex] ?? null}
                                onSubmit={(item) => handleSubmitEducation(item)} />
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
