import { useTranslation } from 'react-i18next';

import { NameValueTable } from '../common/UICommon';

export const EmployeeProfileCard = ({ profile }) => {
    const { t } = useTranslation("SharedEmployee");
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
            name: t("card.gender"),
            value: profile?.gender?.name ?? ""
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
            name: t("card.skills"),
            value: profile?.skills.join(", ") ?? ""
        }
    ]

    return (
        <NameValueTable items={items} />
    )
}

export const EmployeeCVCard = ({ item }) => {
    const { t } = useTranslation("SharedEmployee");

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

export default EmployeeProfileCard