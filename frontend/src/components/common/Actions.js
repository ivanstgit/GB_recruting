import { useTranslation } from "react-i18next";

export const commonActions = {
    create: "create",
    detail: "detail",
    edit: "edit",
    delete: "delete",
    copy: "copy"
}

// Action toolbars

const ActionIcon = ({ label = "", showText = false, onClick, iconStyle, buttonStyle = "btn-outline-secondary" }) => {
    if (onClick) {
        if (showText)
            return (
                <button type="button"
                    className={"btn border-0 p-1 mt-0 " + buttonStyle + " bi " + iconStyle}
                    onClick={onClick}>{label}</button>
            )
        else
            return (
                <button type="button"
                    className={"btn border-0 p-1 mt-0 " + buttonStyle + " bi " + iconStyle}
                    data-toggle="tooltip" data-placement="right" title={label}
                    onClick={onClick} />
            )
    } else
        return (<div />)
}
export const ActionIconDetail = ({ showText = false, onClick }) => {
    const { t } = useTranslation("CommonActions");
    return (
        <ActionIcon label={t("actions.detail")} showText={showText} onClick={onClick}
            iconStyle="bi-chevron-double-right" />
    )
}
export const ActionIconEdit = ({ showText = false, onClick }) => {
    const { t } = useTranslation("CommonActions");
    return (
        <ActionIcon label={t("actions.edit")} showText={showText} onClick={onClick}
            iconStyle="bi-pencil-square" />
    )
}
export const ActionIconCopy = ({ showText = false, onClick }) => {
    const { t } = useTranslation("CommonActions");
    return (
        <ActionIcon label={t("actions.copy")} showText={showText} onClick={onClick}
            iconStyle="bi-copy" />
    )
}
export const ActionIconDelete = ({ showText = false, onClick }) => {
    const { t } = useTranslation("CommonActions");
    return (
        <ActionIcon label={t("actions.delete")} showText={showText} onClick={onClick}
            iconStyle="bi-trash" buttonStyle="btn-outline-danger" />
    )
}

const ActionToolbarItem = ({ action, onClick }) => {
    if (action === commonActions.edit) return (<ActionIconEdit onClick={onClick} />)
    if (action === commonActions.detail) return (<ActionIconDetail onClick={onClick} />)
    if (action === commonActions.delete) return (<ActionIconDelete onClick={onClick} />)
    if (action === commonActions.copy) return (<ActionIconCopy onClick={onClick} />)
}
export const ActionToolbar = ({ actions }) => {
    if (actions)
        return (
            <div className="float-end btn-toolbar justify-content-md-end">
                {Object.keys(actions).map((action, index) =>
                    <ActionToolbarItem
                        key={'CATItem' + index}
                        action={action}
                        onClick={actions[action]}
                    />)}
            </div>
        )
    else
        return (<></>)
}
export const ActionGroup = ({ actions }) => {
    if (actions)
        return (
            <div className="btn-group btn-group-sm" role="group" aria-label="">
                {Object.keys(actions).map((action, index) =>
                    <ActionToolbarItem
                        key={'CATItem' + index}
                        action={action}
                        onClick={actions[action]}
                    />)}
            </div>
        )
    else
        return (<></>)
}