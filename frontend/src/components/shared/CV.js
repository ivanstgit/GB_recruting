import { useTranslation } from 'react-i18next';
import { ActionButtonHide, ActionToolbar } from '../common/Actions';
import { FormButton, FormContainer, InputDate, InputNumber, InputText, SubHeaderText, SubmitButton, formStatuses } from '../common/FormFields';
import { EmployeeCVCard } from './Employee';
import { useState } from 'react';
import { Loading } from '../common/UICommon';

export const CVStatuses = {
    draft: "d",
    pending: "p",
    approved: "a",
    rejected: "r"
}

export const CVStatusIcon = ({ status, showText = false }) => {
    const { t } = useTranslation("SharedCV");
    const statusDesc = t("statuses." + status.id) ?? status.name ?? ""
    let iconStyle = ""
    if (status.id === CVStatuses.draft) iconStyle = "bi-eraser"
    if (status.id === CVStatuses.pending) iconStyle = "bi-patch-question"
    if (status.id === CVStatuses.approved) iconStyle = "bi-patch-check"
    if (status.id === CVStatuses.rejected) iconStyle = "bi-patch-exclamation"
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

export const CVExperienceCard = ({ item, cityName = "", actions = {} }) => {
    const { t } = useTranslation("SharedCV");

    const dateFormatOptions = {
        month: 'short',
        year: 'numeric',
    };

    const period_desc = new Date(item.datefrom).toLocaleDateString(undefined, dateFormatOptions) + " - " +
        (item.is_current ? t("experience.is_current") : new Date(item.dateto).toLocaleDateString(undefined, dateFormatOptions))

    return (
        <div className="card">
            <div className="card-body">
                <ActionToolbar actions={actions} />
                <div className="row g-3">
                    <div className="col-6 col-lg-4">
                        <p className="card-text">{period_desc}</p>
                    </div>
                    <div className="col-sm-6 col-lg-8">
                        <h5 className="card-title">{item.position}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                            <ul className="list-inline mb-0 text-muted">
                                <li className="list-inline-item">
                                    <i className="bi bi-building me-3"></i>{item.company}
                                </li>
                                <li className="list-inline-item">
                                    <i className="bi bi-geo-alt-fill me-3"></i>{item.city.name ?? cityName}
                                </li>
                            </ul>
                        </h6>
                        <p className="card-text"><i className="bi bi-card-text me-3"></i> {item.content}</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export const CVEducationCard = ({ item, actions = {} }) => {
    // const { t } = useTranslation("SharedCV");

    const dateFormatOptions = {
        month: 'short',
        year: 'numeric',
    };

    const date = new Date(item.date)

    return (
        <div className="card">
            <div className="p-3 card-body">
                <ActionToolbar actions={actions} />
                <div className="row g-3">
                    <div className="col-6 col-lg-4">
                        <p className="card-text">{date.toLocaleDateString(undefined, dateFormatOptions)}</p>
                    </div>
                    <div className="col-sm-6 col-lg-8">

                        <h5 className="card-title">
                            {item.specialty}
                        </h5>
                        <p className="card-text"><i className="bi bi-mortarboard me-3"></i>{item.institution} </p>
                        <p className="card-text"><i className="bi bi-card-text me-3"></i>{item.content}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const CVDetail = ({ item, actions = {} }) => {
    const { t } = useTranslation("SharedCV");

    return (
        <div className="">
            <SubHeaderText text={t("employee.header")} />
            <EmployeeCVCard item={item.employee} />
            <SubHeaderText text={t("position.header")} />
            <div className="card">
                <div className="p-3 card-body">

                    <h5 className="card-title">{item.position}</h5>
                    <h6 className="card-subtitle text-muted"><i className="bi bi-cash-stack me-3"></i>{t("position.salary")}: {item.salary}</h6>
                    <p className="card-text mt-1 "><i className="bi bi-card-text me-3" />{item.description}</p>

                </div>
            </div>

            <SubHeaderText text={t("experience.header")} />
            {item.experience.map((item, index) => <CVExperienceCard
                key={'ExperienceItem' + index}
                index={index}
                item={item}
            />)}
            <SubHeaderText text={t("education.header")} />
            {item.education.map((item, index) => <CVEducationCard
                key={'EducationItem' + index}
                index={index}
                item={item}
            />)}
        </div>
    )
}

export const CVCard = ({ item, actions }) => {

    const { t } = useTranslation("SharedCV");

    const date = new Date(item.updated_at)

    return (
        <div className="card">
            <div className="p-3 card-body">
                <ActionToolbar actions={actions} />
                <div className="row g-3">
                    <div className="col-6 col-lg-4">
                        <h5 className="card-title">
                            {item.employee.name}
                        </h5>
                        <p className="card-subtitle text-muted"><i className="bi bi-geo-alt-fill me-3"></i>{item.employee.city.name}</p>
                        <p className="card-text">{t("employee.age")}: {item.employee.age}</p>
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

const initialStateCVSearch = {
    position: "",
    description: "",
    city: "",
    salary_min: "",
    salary_max: "",
    published_since: ""
}
export const CVSearchForm = ({ onApply, onClear }) => {
    const [input, setInput] = useState(initialStateCVSearch);
    const [status, setStatus] = useState(formStatuses.initial)
    const [validationErrors, setValidationErrors] = useState({});
    const [isHidden, setIsHidden] = useState(true)

    const { t } = useTranslation("SharedCV");

    const handleChange = (e) => {
        let { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
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
            const fields = Object.keys(initialStateCVSearch)
            let params = {}

            for (const index in fields) {
                let field = fields[index]
                if (input[field] !== initialStateCVSearch[field]) {
                    params[field] = input[field]
                }
            }

            onApply(params)
            setStatus(formStatuses.initial)
        }
    }
    const handleClear = (e) => {
        e.preventDefault()
        onApply(initialStateCVSearch)
        setInput(initialStateCVSearch)
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
                            <SubHeaderText text={t("search.header")} />
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