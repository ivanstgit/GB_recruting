// import React, { useState } from 'react';

import { getUID } from "../../utils/UniqueId";

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

export const InputNumber = ({ name, value, label, onChange, errorText = "", helpText = "" }) => {
    const id = getUID()
    return (
        <div className="mb-3">
            <label className="form-label border-0" htmlFor={id}>{label}</label>
            <input type="number" className={"form-control " + getError(errorText).style} id={id} name={name}
                value={value} onChange={(event) => onChange(event)} />
            <div className="invalid-feedback">{getError(errorText).error}</div>
            <small id={getUID()} className="form-text text-muted">{helpText}</small>
        </div>
    );
};

export const InputText = ({ name, value, label, onChange, errorText = "", helpText = "" }) => {
    const id = getUID()
    return (
        <div className="mb-3">
            <label className="form-label border-0" htmlFor={id}>{label}</label>
            <input type="text" className={"form-control " + getError(errorText).style} id={id} name={name}
                value={value} onChange={(event) => onChange(event)} />
            <div className="invalid-feedback">{getError(errorText).error}</div>
            <small id={getUID()} className="form-text text-muted">{helpText}</small>
        </div>
    );
};

export const InputTextArea = ({ name, value, label, onChange, errorText = "", helpText = "", rows = 2 }) => {
    const id = getUID()
    return (
        <div className="mb-3">
            <label className="form-label border-0" htmlFor={id}>{label}</label>
            <textarea className={"form-control " + getError(errorText).style} id={id} name={name}
                value={value} onChange={(event) => onChange(event)}
                rows={rows} />
            <div className="invalid-feedback">{getError(errorText).error}</div>
            <small id={getUID()} className="form-text text-muted">{helpText}</small>
        </div>
    );
};

export const InputEmail = (name, value, label, onChange, errorText = "", helpText = "") => {
    const id = getUID()
    return (
        <div className="mb-3">
            <label className="form-label border-0" htmlFor={id}>{label}</label>
            <input type="text" className={"form-control " + getError(errorText).style} id={id} name={name}
                value={value} onChange={(event) => onChange(event)} />
            <div className="invalid-feedback">{getError(errorText).error}</div>
            <small id={getUID()} className="form-text text-muted">{helpText}</small>
        </div>
    );
};

export const InputDate = ({ name, label, value, errorText = "", helpText = "", onChange, disabled = false }) => {
    const id = getUID()
    return (
        <div className="mb-3">
            <label className="form-label border-0" htmlFor={id}>{label}</label>
            <input type="date" className={"form-control " + getError(errorText).style} id={id} name={name}
                value={value} onChange={(event) => onChange(event)} disabled={disabled} />
            <div className="invalid-feedback">{getError(errorText).error}</div>
            <small id={getUID()} className="form-text text-muted">{helpText}</small>
        </div>
    );
};

export const InputCheckBox = ({ name, label, value, errorText = "", helpText = "", onChange }) => {
    const id = getUID()
    return (
        <div className="mb-3 form-check">

            <input type="checkbox" className={"form-check-input " + getError(errorText).style} id={id} name={name}
                checked={value} onChange={(event) => onChange(event)} />
            <label className="form-check-label border-0" htmlFor={id}>{label}</label>
            <div className="invalid-feedback">{getError(errorText).error}</div>
            <small id={getUID()} className="form-text text-muted">{helpText}</small>
        </div>
    );
};

export const InputPassword = ({ name, label, value, errorText = "", helpText = "", onChange }) => {
    const id = getUID()
    return (
        <div className="mb-3">
            <label className="form-label border-0" htmlFor={id}>{label}</label>
            <input type="password" className={"form-control " + getError(errorText).style} id={id} name={name}
                value={value} onChange={(event) => onChange(event)} />
            <div className="invalid-feedback">{getError(errorText).error}</div>
            <small id={getUID()} className="form-text text-muted">{helpText}</small>
        </div>
    );
};

export const InputRadioButtonGroup = ({ name, label, value, errorText = "", helpText = "", onChange, options }) => {
    const id = getUID()
    const isChecked = (option) => {
        if (value === option) {
            return true
        }
        return false
    }

    const radio = (index, value, desc) => {
        return (
            <div className="form-check" key={id + index + 1}>
                <input type="radio" className="form-check-input" key={id + index + 2}
                    id={id + index} name={name} value={value}
                    onChange={(event) => onChange(event)}
                    checked={isChecked(value)} />
                <label className="form-check-label" htmlFor={id + index} key={id + index + 3}>
                    {desc}
                </label>
            </div>
        )
    }

    return (
        <div className="mb-3">
            <label className="form-label border-0">{label}</label>

            {options.map((item, index) => radio(index, item[0], item[1]))}

            <div className="invalid-feedback">{getError(errorText).error}</div>
        </div>
    );
};

export const InputSelect = ({ name, label, options, value, errorText = "", helpText = "", onChange }) => {
    const id = getUID()
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
            <small id={getUID()} className="form-text text-muted">{helpText}</small>
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
        <h3 className="text-center mt-3 mb-2" > {text} </h3>
    );
};
