import { useTranslation } from 'react-i18next';
import { SubHeaderText } from '../common/FormFields';
import { CVCard } from './CV';
import { VacancyCard } from './Vacancy';
import { MessageForm } from './Messages';

export const CVResponseStatuses = {
    draft: "d",
    pending: "p",
    approved: "a",
    rejected: "r"
}

export const CVResponseStatusIcon = ({ status, showText = false }) => {
    const { t } = useTranslation("SharedCVResponse");
    const statusDesc = t("statuses." + status.id) ?? status.name ?? ""
    let iconStyle = ""
    if (status.id === CVResponseStatuses.draft) iconStyle = "bi-eraser"
    if (status.id === CVResponseStatuses.pending) iconStyle = "bi-patch-question text-warning"
    if (status.id === CVResponseStatuses.approved) iconStyle = "bi-patch-check text-success"
    if (status.id === CVResponseStatuses.rejected) iconStyle = "bi-patch-exclamation text-danger"
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

export const CVResponseDetail = ({ item, CVActions = {}, vacancyActions = {} }) => {
    const { t } = useTranslation("SharedCVResponse");

    return (
        <div className="">
            <SubHeaderText text={t("fields.CV")} />
            <CVCard item={item.cv} actions={CVActions} />
            <SubHeaderText text={t("fields.vacancy")} />
            <VacancyCard item={item.vacancy} actions={vacancyActions} />
        </div>
    )
}

export const CVResponseChat = ({ item, onMessageSubmit }) => {
    const { t } = useTranslation("SharedCVResponse");

    if (item?.status?.id === CVResponseStatuses.approved) {
        return (
            <div>
                <SubHeaderText text={t("chat.header")} />
                <MessageForm messageList={item.messages} onSubmit={onMessageSubmit} />
            </div>
        )
    } else {
        return (
            <div />
        )
    }
}