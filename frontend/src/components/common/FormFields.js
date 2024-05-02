// import React, { useState } from 'react';

const getError = (errorText) => {
    if (errorText) {
        return { error: errorText, style: "is-invalid" }
    }
    return { error: "", style: "" }
}

export const formStatuses = {
    prefill: "prefill",
    prefilling: "prefilling",
    initial: "input",
    pending: "pending",
    error: "error",
    success: "success"
}

export const FormContainer = ({ onSubmit, children }) => {
    return (
        <div className="wow fadeInUp" data-wow-delay="0.5s">
            <div className="bg-light rounded h-100 align-items-center p-5">
                <form onSubmit={(event) => onSubmit(event)}>
                    {children}
                </form>
            </div>
        </div>

    );
};

export const InputText = (props) => {
    return (
        <div className="mb-3">
            <label className="form-label border-0" htmlFor={props.id}>{props.label}</label>
            <input type="text" className={"form-control " + getError(props.errorText).style} id={props.id} name={props.name}
                value={props.value} onChange={(event) => props.onChange(event)} />
            <div className="invalid-feedback">{getError(props.errorText).error}</div>
            <small id={props.id + "Help"} className="form-text text-muted">{props.helpText}</small>
        </div>
    );
};

export const InputTextArea = (props) => {
    const rows = props.rows ?? "2"
    return (
        <div className="mb-3">
            <label className="form-label border-0" htmlFor={props.id}>{props.label}</label>
            <textarea className={"form-control " + getError(props.errorText).style} id={props.id} name={props.name}
                value={props.value} onChange={(event) => props.onChange(event)}
                rows={rows} />
            <div className="invalid-feedback">{getError(props.errorText).error}</div>
            <small id={props.id + "Help"} className="form-text text-muted">{props.helpText}</small>
        </div>
    );
};

export const InputEmail = (props) => {
    return (
        <div className="mb-3">
            <label className="form-label border-0" htmlFor={props.id}>{props.label}</label>
            <input type="text" className={"form-control " + getError(props.errorText).style} id={props.id} name={props.name}
                value={props.value} onChange={(event) => props.onChange(event)} />
            <div className="invalid-feedback">{getError(props.errorText).error}</div>
            <small id={props.id + "Help"} className="form-text text-muted">{props.helpText}</small>
        </div>
    );
};

export const InputDate = ({ id, name, label, value, errorText = "", helpText = "", onChange }) => {
    return (
        <div className="mb-3">
            <label className="form-label border-0" htmlFor={id}>{label}</label>
            <input type="date" className={"form-control " + getError(errorText).style} id={id} name={name}
                value={value} onChange={(event) => onChange(event)} />
            <div className="invalid-feedback">{getError(errorText).error}</div>
            <small id={id + "Help"} className="form-text text-muted">{helpText}</small>
        </div>
    );
};

export const InputCheckBox = ({ id, name, label, value, errorText = "", helpText = "", onChange }) => {
    return (
        <div className="mb-3 form-check">

            <input type="checkbox" className={"form-check-input " + getError(errorText).style} id={id} name={name}
                value={value} onChange={(event) => onChange(event)} />
            <label className="form-check-label border-0" htmlFor={id}>{label}</label>
            <div className="invalid-feedback">{getError(errorText).error}</div>
            <small id={id + "Help"} className="form-text text-muted">{helpText}</small>
        </div>
    );
};

export const InputPassword = (props) => {
    return (
        <div className="mb-3">
            <label className="form-label border-0" htmlFor={props.id}>{props.label}</label>
            <input type="password" className={"form-control " + getError(props.errorText).style} id={props.id} name={props.name}
                value={props.value} onChange={(event) => props.onChange(event)} />
            <div className="invalid-feedback">{getError(props.errorText).error}</div>
            <small id="passwordHelp" className="form-text text-muted">{props.helpText}</small>
        </div>
    );
};

export const InputRadioButtonGroup = (props) => {
    const isChecked = (option) => {
        if (props.value === option) {
            return true
        }
        return false
    }

    const radio = (index, value, desc) => {
        return (
            <div className="form-check" key={props.id + index + 1}>
                <input type="radio" className="form-check-input" key={props.id + index + 2}
                    id={props.id + index} name={props.name} value={value}
                    onChange={(event) => props.onChange(event)}
                    checked={isChecked(value)} />
                <label className="form-check-label" htmlFor={props.id + index} key={props.id + index + 3}>
                    {desc}
                </label>
            </div>
        )
    }

    return (
        <div className="mb-3">
            <label className="form-label border-0">{props.label}</label>

            {props.options.map((item, index) => radio(index, item[0], item[1]))}

            <div className="invalid-feedback">{getError(props.errorText).error}</div>
        </div>
    );
};

export const InputSelect = ({ id, name, label, options, value, errorText = "", helpText = "", onChange }) => {
    return (
        <div className="mb-3">
            <label className="form-label border-0" htmlFor={id}>{label}</label>
            <select className={"form-select " + getError(errorText).style} id={id} name={name} value={value}
                onChange={(event) => onChange(event)}>
                <option>-</option>
                {options.map((item) =>
                    <option key={id + "SO_" + item.id} value={item.id}>{item.name}</option>
                )}
            </select>
            <div className="invalid-feedback">{getError(errorText).error}</div>
            <small id={id + "Help"} className="form-text text-muted">{helpText}</small>
        </div>
    );
};

export const SubmitButton = ({ label, disabled = false }) => {
    return (
        <div className="mt-3">
            <button className="btn btn-primary py-3 w-100 mt-3" type="submit" disabled={disabled}>{label}</button>
        </div>
    );
};

export const FormButton = ({ label, disabled = false, onClick }) => {
    return (
        <div className="mt-3">
            <button className="btn btn-primary py-3 w-100 mt-3" onClick={(e) => onClick(e)} disabled={disabled}>{label}</button>
        </div>
    );
};

export const AdditionalActionLink = ({ label, disabled = false, onClick }) => {
    return (
        <div className="mt-3">
            <button type="button" className="btn btn-link" disabled={disabled}
                onClick={(event) => onClick(event)}>{label}</button>
        </div>
    );
};

export const HeaderText = ({ text }) => {
    return (
        <h2 className="text-center mb-3" > {text} </h2>
    );
};
export const SubHeaderText = ({ text }) => {
    return (
        <h3 className="text-center mb-3" > {text} </h3>
    );
};
