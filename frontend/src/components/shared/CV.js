import { useTranslation } from 'react-i18next';
import { ActionToolbar } from '../common/Actions';
import { SubHeaderText } from '../common/FormFields';
import { EmployeeCVCard } from './Employee';

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