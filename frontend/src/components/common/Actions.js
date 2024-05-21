import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ObjectActions } from "../../routes/AppPaths";

export const commonActions = {
    create: "create",
    edit: "edit",
    delete: "delete",
    copy: "copy",

    publish: "publish",
    accept: "accept",
    reject: "reject",

    back: "back",
    detail: "detail",

    favoriteAdd: "favadd",
    favoriteRemove: "favremove",
}

// Action toolbars

const ActionIcon = ({ label = "", showText = false, onClick, iconStyle, buttonStyle = "btn-outline-secondary" }) => {
    if (onClick) {
        if (showText)
            return (
                <button type="button"
                    className={"btn border-0 p-1 mt-0 " + buttonStyle + " bi " + iconStyle}
                    onClick={onClick}> {" " + label}</button>
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
            iconStyle="bi-box-arrow-right" />
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

export const ActionIconPublish = ({ showText = false, onClick }) => {
    const { t } = useTranslation("CommonActions");
    return (
        <ActionIcon label={t("actions.publish")} showText={showText} onClick={onClick}
            iconStyle="bi-send-check" buttonStyle="btn-outline-success" />
    )
}
export const ActionIconAccept = ({ showText = false, onClick }) => {
    const { t } = useTranslation("CommonActions");
    return (
        <ActionIcon label={t("actions.accept")} showText={showText} onClick={onClick}
            iconStyle="bi-check-circle" buttonStyle="btn-outline-success" />
    )
}
export const ActionIconReject = ({ showText = false, onClick }) => {
    const { t } = useTranslation("CommonActions");
    return (
        <ActionIcon label={t("actions.reject")} showText={showText} onClick={onClick}
            iconStyle="bi-send-x" buttonStyle="btn-outline-danger" />
    )
}

export const ActionIconBack = ({ showText = false, onClick }) => {
    const { t } = useTranslation("CommonActions");
    return (
        <ActionIcon label={t("actions.back")} showText={showText} onClick={onClick}
            iconStyle="bi-arrow-return-left" />
    )
}

export const ActionIconFavoriteAdd = ({ showText = false, onClick }) => {
    const { t } = useTranslation("CommonActions");
    return (
        <ActionIcon label={t("actions.favoriteAdd")} showText={showText} onClick={onClick}
            iconStyle="bi-star" />
    )
}

export const ActionIconFavoriteRemove = ({ showText = false, onClick }) => {
    const { t } = useTranslation("CommonActions");
    return (
        <ActionIcon label={t("actions.favoriteRemove")} showText={showText} onClick={onClick}
            iconStyle="bi-star-fill" />
    )
}

const ActionToolbarItem = ({ action, onClick, showText = false }) => {
    if (action === commonActions.edit) return (<ActionIconEdit onClick={onClick} showText={showText} />)
    if (action === commonActions.delete) return (<ActionIconDelete onClick={onClick} showText={showText} />)
    if (action === commonActions.copy) return (<ActionIconCopy onClick={onClick} showText={showText} />)

    if (action === commonActions.back) return (<ActionIconBack onClick={onClick} showText={showText} />)
    if (action === commonActions.detail) return (<ActionIconDetail onClick={onClick} showText={showText} />)

    if (action === commonActions.publish) return (<ActionIconPublish onClick={onClick} showText={showText} />)
    if (action === commonActions.accept) return (<ActionIconAccept onClick={onClick} showText={showText} />)
    if (action === commonActions.reject) return (<ActionIconReject onClick={onClick} showText={showText} />)

    if (action === commonActions.favoriteAdd) return (<ActionIconFavoriteAdd onClick={onClick} showText={showText} />)
    if (action === commonActions.favoriteRemove) return (<ActionIconFavoriteRemove onClick={onClick} showText={showText} />)
}
export const ActionToolbar = ({ actions, showText = false }) => {
    if (actions)
        return (
            <div className="float-end btn-toolbar justify-content-md-end">
                {Object.keys(actions).map((action, index) =>
                    <ActionToolbarItem
                        key={'CATItem' + index}
                        action={action}
                        onClick={actions[action]}
                        showText={showText}
                    />)}
            </div>
        )
    else
        return (<></>)
}
export const ActionGroup = ({ actions, size = "", showText = false }) => {
    if (actions) {
        const sizeStyle = (size === "") ? "" : "btn-group-" + size
        return (
            <div className={"btn-group " + sizeStyle} role="group" aria-label="">
                {Object.keys(actions).map((action, index) =>
                    <ActionToolbarItem
                        key={'CATItem' + index}
                        action={action}
                        onClick={actions[action]}
                        showText={showText}
                    />)}
            </div>
        )
    }
    else
        return (<></>)
}

export const ActionButtonCreate = ({ label = undefined, showText = true, navigateTo = ObjectActions.add }) => {
    const { t } = useTranslation("CommonActions");
    const linkText = label ? label : t("actions.create")
    return (
        <Link to={navigateTo} className="btn btn-primary">{linkText}</Link>
    )
}
export const ActionButtonHide = ({ showText = true, isHidden = true, setIsHidden }) => {
    const { t } = useTranslation("CommonActions");

    const label = isHidden ? t("actions.unhide") : t("actions.hide")
    const iconStyle = isHidden ? "bi-chevron-double-down" : "bi-chevron-double-up"

    const handleClick = () => {
        if (isHidden) {
            setIsHidden(false)
        } else {
            setIsHidden(true)
        }
    }
    return (
        <ActionIcon label={label} showText={showText} onClick={handleClick}
            iconStyle={iconStyle} />
    )
}