import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ActionButtonHide, ActionToolbar } from '../common/Actions';
import { AdditionalHeaderText, FormButton, FormContainer, InputCheckBox, InputDate, InputNumber, InputText, SubHeaderText, SubmitButton, formStatuses } from '../common/FormFields';
import { Loading } from '../common/UICommon';
import { EmployerPublicCard } from './Employer';

export const VacancyStatuses = {
    draft: "d",
    pending: "p",
    approved: "a",
    rejected: "r"
}

export const VacancyStatusIcon = ({ status, showText = false }) => {
    const { t } = useTranslation("SharedVacancy");
    const statusDesc = t("statuses." + status.id) ?? status.name ?? ""
    let iconStyle = ""
    if (status.id === VacancyStatuses.draft) iconStyle = "bi-eraser"
    if (status.id === VacancyStatuses.pending) iconStyle = "bi-patch-question"
    if (status.id === VacancyStatuses.approved) iconStyle = "bi-patch-check"
    if (status.id === VacancyStatuses.rejected) iconStyle = "bi-patch-exclamation"
    if (showText)
        return (
            <span>
                {/* <h4 className={"badge bg-info"}> */}
                <i className={"me-3 bi " + iconStyle} /> {statusDesc}
            </span>
        )
    else
        return (
            <i
                className={" p-1 me-3 bi " + iconStyle}
                data-toggle="tooltip" data-placement="right" title={statusDesc} />
        )
}


export const VacancyDetail = ({ item, actions = {} }) => {
    const { t } = useTranslation("SharedVacancy");

    return (
        <div className="">
            <SubHeaderText text={t("employer.header")} />
            <EmployerPublicCard item={item.employer} />
            <SubHeaderText text={t("position.header")} />
            <div className="card">
                <div className="p-3 card-body">

                    <h5 className="card-title">{item.position}</h5>
                    <h6 className="card-subtitle text-muted"><i className="bi bi-cash-stack me-3"></i>{t("position.salary")}: {item.salary}</h6>
                    <div className="row">
                        <div className="col-auto">
                            <p className="card-text mt-1"><i className="bi bi-card-text me-1" /></p>
                        </div>
                        <div className="col p-0">
                            <p className="card-text mt-1 text-ws-pre">{item.description}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export const VacancyCard = ({ item, actions }) => {

    const { t } = useTranslation("SharedVacancy");

    const date = new Date(item.updated_at)

    return (
        <div className="card">
            <div className="p-3 card-body">
                <ActionToolbar actions={actions} />
                <div className="row g-3">
                    <div className="col-6 col-lg-4">
                        <h5 className="card-title">
                            {item.employer.name}
                        </h5>
                        <p className="card-subtitle text-muted"><i className="bi bi-geo-alt-fill me-3"></i>{item.city.name}</p>
                    </div>
                    <div className="col-sm-6 col-lg-8">

                        <h5 className="card-title">{item.position}</h5>
                        <h6 className="card-subtitle text-muted"><i className="bi bi-cash-stack me-3"></i>{t("position.salary")}: {item.salary}</h6>
                        <p className="card-text">{t("internal.updated")}: {date.toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const initialStateVacancySearch = {
    position: "",
    description: "",
    city: "",
    salary_min: "",
    salary_max: "",
    published_since: ""
}
export const VacancySearchForm = ({ onApply }) => {
    const [input, setInput] = useState(initialStateVacancySearch);
    const [isFavoriteOnly, setIsFavoriteOnly] = useState(false);
    const [status, setStatus] = useState(formStatuses.initial)
    const [validationErrors, setValidationErrors] = useState({});
    const [isHidden, setIsHidden] = useState(true)

    const { t } = useTranslation("SharedVacancy");

    const getParamsUnion = (isFavoriteOnly, input) => {
        const fields = Object.keys(initialStateVacancySearch)
        let params = (isFavoriteOnly ? { is_favorite: true } : {})

        for (const index in fields) {
            let field = fields[index]
            if (input[field] !== initialStateVacancySearch[field]) {
                params[field] = input[field]
            }
        }
        return params
    }

    const handleChange = (e) => {
        const { target } = e;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;

        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));

    }

    const handleChangeIsFavorite = (e) => {
        const { target } = e;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setIsFavoriteOnly(value)

        if (isHidden) {
            onApply(getParamsUnion(value, input))
        }
    }

    const validateInput = () => {
        const res = {}
        return res
    }

    const handleApply = (e) => {
        e.preventDefault()
        setStatus(formStatuses.pending)

        const errors = validateInput()
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            setStatus(formStatuses.error)
        } else {

            onApply(getParamsUnion(isFavoriteOnly, input))
            setStatus(formStatuses.initial)
        }
    }
    const handleClear = (e) => {
        e.preventDefault()
        onApply(getParamsUnion(isFavoriteOnly, initialStateVacancySearch))
        setInput(initialStateVacancySearch)
        setStatus(formStatuses.initial)
    }

    if (status === formStatuses.pending) {
        return (<Loading />)
    }
    return (
        <div className="">
            <div className="row">
                <FormContainer onSubmit={(event) => handleApply(event)} padding={1}>
                    <div className="row">
                        <div className="col">
                            <div className="mt-1">
                                <InputCheckBox id="is_favorite" name="is_favorite" value={isFavoriteOnly} label={t("search.fields.is_favorite")}
                                    onChange={(event) => handleChangeIsFavorite(event)} />
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <AdditionalHeaderText text={t("search.header")} />
                        </div>
                        <div className="col-md-auto">
                            <ActionButtonHide isHidden={isHidden} setIsHidden={setIsHidden} />
                        </div>
                    </div>
                    <div className="row" hidden={isHidden}>
                        <div className="col">
                            <InputText id="position" name="position" value={input.position} label={t("search.fields.position")}
                                errorText={validationErrors?.position ?? ""}
                                onChange={(event) => handleChange(event)} />
                            <InputText id="description" name="description" value={input.description} label={t("search.fields.description")}
                                errorText={validationErrors?.description ?? ""}
                                onChange={(event) => handleChange(event)} />
                        </div>
                        <div className="col">
                            <InputNumber id="salary_min" name="salary_min" value={input.salary_min} label={t("search.fields.salary_min")}
                                errorText={validationErrors?.salary_min ?? ""}
                                onChange={(event) => handleChange(event)} />
                            <InputNumber id="salary_max" name="salary_max" value={input.salary_max} label={t("search.fields.salary_max")}
                                errorText={validationErrors?.salary_max ?? ""}
                                onChange={(event) => handleChange(event)} />
                        </div>
                        <div className="col">
                            <InputText id="city" name="city" value={input.city} label={t("search.fields.city")}
                                errorText={validationErrors?.city ?? ""}
                                onChange={(event) => handleChange(event)} />
                            <InputDate id="published_since" name="published_since" value={input.published_since} label={t("search.fields.published_since")}
                                errorText={validationErrors?.published_since ?? ""}
                                onChange={(event) => handleChange(event)} />
                        </div>
                        <div className="col">
                            <SubmitButton label={t("search.apply")}
                                disabled={(status === formStatuses.pending || status === formStatuses.prefilling)} />
                            <FormButton label={t("search.clear")}
                                disabled={(status === formStatuses.pending || status === formStatuses.prefilling)}
                                onClick={handleClear} />
                        </div>
                    </div>
                </FormContainer>
            </div>
        </div>
    )
}