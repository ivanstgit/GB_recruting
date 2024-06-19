import { useTranslation } from 'react-i18next';
import { SubHeaderText } from '../common/FormFields';
import { CVCard } from './CV';
import { MessageForm } from './Messages';
import { VacancyCard } from './Vacancy';

export const VacancyResponseStatuses = {
    draft: "d",
    pending: "p",
    approved: "a",
    rejected: "r"
}

export const VacancyResponseStatusIcon = ({ status, showText = false }) => {
    const { t } = useTranslation("SharedVacancyResponse");
    const statusDesc = t("statuses." + status.id) ?? status.name ?? ""
    let iconStyle = ""
    if (status.id === VacancyResponseStatuses.draft) iconStyle = "bi-eraser"
    if (status.id === VacancyResponseStatuses.pending) iconStyle = "bi-patch-question text-warning"
    if (status.id === VacancyResponseStatuses.approved) iconStyle = "bi-patch-check text-success"
    if (status.id === VacancyResponseStatuses.rejected) iconStyle = "bi-patch-exclamation text-danger"
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

export const VacancyResponseDetail = ({ item, CVActions = {}, vacancyActions = {} }) => {
    const { t } = useTranslation("SharedVacancyResponse");

    return (
        <div className="">
            <SubHeaderText text={t("fields.vacancy")} />
            <VacancyCard item={item.vacancy} actions={vacancyActions} />
            <SubHeaderText text={t("fields.CV")} />
            <CVCard item={item.cv} actions={CVActions} />
        </div>
    )
}

export const VacancyResponseChat = ({ item, onMessageSubmit }) => {
    const { t } = useTranslation("SharedVacancyResponse");

    if (item?.status?.id === VacancyResponseStatuses.approved) {
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