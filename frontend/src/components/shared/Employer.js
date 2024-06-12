import { useTranslation } from 'react-i18next';

import { NameValueTable } from '../common/UICommon';

export const EmployerStatuses = {
    draft: "d",
    pending: "p",
    approved: "a",
    rejected: "r"
}

export const EmployerStatusIcon = ({ status, showText = false }) => {
    const { t } = useTranslation("SharedEmployer");

    if (!status) return <span />

    const statusDesc = t("statuses." + status.id) ?? status.name ?? ""
    let iconStyle = ""
    if (status.id === EmployerStatuses.draft) iconStyle = "bi-eraser"
    if (status.id === EmployerStatuses.pending) iconStyle = "bi-patch-question"
    if (status.id === EmployerStatuses.approved) iconStyle = "bi-patch-check"
    if (status.id === EmployerStatuses.rejected) iconStyle = "bi-patch-exclamation"
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

export const EmployerProfileCard = ({ profile }) => {
    const { t } = useTranslation("SharedEmployer");
    const items = [
        {
            name: t("card.name"),
            value: profile?.name ?? ""
        },
        {
            name: t("card.age"),
            value: profile?.age ?? ""
        },
        {
            name: t("card.email"),
            value: profile?.email ?? ""
        },
        {
            name: t("card.city"),
            value: profile?.city?.name ?? ""
        },
        {
            name: t("card.description"),
            value: profile?.description ?? ""
        },
        {
            name: t("card.welcome_letter"),
            value: profile?.welcome_letter ?? ""
        }
    ]

    return (
        <NameValueTable items={items} />
    )
}

export const EmployerPublicCard = ({ item }) => {
    const { t } = useTranslation("SharedEmployer");

    if (item)
        return (
            <div className="card">
                <div className="p-3 card-body">
                    <div className="row g-3">
                        <h5 className="card-title">
                            {item.name}
                        </h5>
                    </div>
                    <div className="row g-3">
                        <p className="card-text"><i className="bi bi-megaphone-fill me-3" />{item.welcome_letter}</p>
                    </div>
                    <div className="row g-3">
                        <div className="col-sm">
                            <p className="card-text"><i className="bi bi-geo-alt-fill me-3"></i>{item.city.name}</p>
                        </div>
                        <div className="col-sm">
                            <p className="card-text">{t("card.age")}: {item.age}</p>
                        </div>
                    </div>
                    <div className="row g-3">
                        <p className="card-text"><i className="bi bi-card-text me-3" />{item.description}</p>
                    </div>
                    <div className="row g-3">
                        <p className="card-text"><i className="bi bi-envelope-at me-3"></i>{item.email}</p>
                    </div>
                </div>
            </div>
        )
    return (<div />)
}

