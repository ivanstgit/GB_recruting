import { useTranslation } from 'react-i18next';

export const CVExperienceCard = ({ item, cityName = "" }) => {
    const { t } = useTranslation("SharedCV");

    const period_desc = new Date(item.datefrom).toLocaleDateString() + " - " +
        item.is_current ? t("experience.is_current") : new Date(item.dateto).toLocaleDateString()

    return (
        <div className="card">
            <h5 className="card-header">{period_desc}, {item.company}</h5>
            <div className="card-body">
                <h5 className="card-title">{item.position}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{item.city.name ?? cityName}</h6>
                <p className="card-text">{item.content}</p>
            </div>
        </div>
    )
}

export const CVEducationCard = ({ item, cityName = "" }) => {
    // const { t } = useTranslation("SharedCV");

    const date = new Date(item.date)

    return (
        <div className="card">
            <h5 className="card-header">{"" + date.getMonth() + "." + date.getFullYear()}, {item.institution}</h5>
            <div className="card-body">
                <p className="card-text">{item.content}</p>
            </div>
        </div>
    )
}
