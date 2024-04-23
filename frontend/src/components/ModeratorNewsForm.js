import React, { useState } from 'react';
import { Navigate, useParams } from "react-router-dom";

import { useTranslation } from 'react-i18next';

import { useData, DATA_RESOURCES } from '../hooks/DataProvider.js'

import {
    FormContainer, formStatuses,
    HeaderText, InputText, SubmitButton, InputTextArea
} from "./LibFormFields.js";
import AppPaths from '../routes/AppPaths.js';
import { ErrorLabel } from './LibUICommon.js';

const initialState = {
    title: "",
    body: "",
    content_type: "TX",
    content: "",
    tags: []
}

const ModeratorNewsForm = (props) => {
    const [input, setInput] = useState(initialState);
    const [error, setError] = useState("")
    const [status, setStatus] = useState(formStatuses.prefill)
    const [validationErrors, setValidationErrors] = useState({});

    const { t } = useTranslation("Moderator");

    const dataProvider = useData()


    const { id } = useParams();
    const isEdit = id ? true : false

    if (isEdit && status === formStatuses.prefill) {
        setStatus(formStatuses.prefilling)
        dataProvider.getOne(DATA_RESOURCES.staffNews, id)
            .then((res) => {
                if (res.error) {
                    setError(res.error)
                    setStatus(formStatuses.error)
                } else {
                    setInput(
                        {
                            title: res.data.title,
                            body: res.data.body,
                            content_type: res.data.content_type,
                            content: res.data.content,
                            tags: res.data.tags
                        })
                    setError("")
                    setStatus(formStatuses.initial)
                }
            })
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
            dataProvider.putOne(DATA_RESOURCES.staffNews, id, input)
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
            dataProvider.postOne(DATA_RESOURCES.staffNews, input)
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

    if (status === formStatuses.success) {
        return (<Navigate to={AppPaths.moderator.news} replace={true} />)
    }
    return (
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row">
                    <FormContainer onSubmit={(event) => handleSubmit(event)}>
                        <HeaderText text={isEdit ? t("News.form.headerEdit") : t("News.form.headerCreate")} />

                        <InputText id="title" name="title" value={input.title} label={t("News.form.title")}
                            errorText={validationErrors?.title ?? ""}
                            onChange={(event) => handleChange(event)} />

                        <InputTextArea id="body" name="body" value={input.body} label={t("News.form.body")}
                            errorText={validationErrors?.body ?? ""}
                            onChange={(event) => handleChange(event)} />

                        <InputTextArea id="content" name="content" value={input.content} label={t("News.form.content")}
                            errorText={validationErrors?.content ?? ""}
                            onChange={(event) => handleChange(event)} rows="5" />

                        <div className="col-12">
                            <SubmitButton label={isEdit ? t("News.actions.edit") : t("News.actions.add")}
                                disabled={(status === formStatuses.pending || status === formStatuses.prefilling)} />
                        </div>
                        <ErrorLabel errorText={error} />
                    </FormContainer>
                </div>
            </div>
        </div>
    );
}

export default ModeratorNewsForm;
