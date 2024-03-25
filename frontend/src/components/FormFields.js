// import React, { useState } from 'react';

const getError = (errorText) => {
    if (errorText) {
        return { error: errorText, style: "is-invalid" }
    }
    return { error: "", style: "" }
}

export const formStatuses = {
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

export const SubmitButton = ({ label, disabled = false }) => {
    return (
        <div className="mt-3">
            <button className="btn btn-primary py-3 w-100 mt-3" type="submit" disabled={disabled}>{label}</button>
        </div>
    );
};

export const HeaderText = (props) => {
    return (
        <h2 className="text-center mb-3" > {props.text} </h2>
    );
};

export const LabelError = (props) => {
    return (
        <div>
            <label className={"form-label invalid border-0 " + getError(props.errorText).style}> </label>
            <div className="invalid-feedback">{getError(props.errorText).error}</div>
        </div>
    );
};

export const LabelInfo = (props) => {
    return (
        <div>
            <label className={"form-label border-0 " + getError(props.text).style}> </label>
        </div>
    );
};