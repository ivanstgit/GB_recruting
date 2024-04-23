import { useTranslation } from 'react-i18next';

import { NameValueTable } from "./LibUICommon.js";

const EmployeeProfileCard = ({ profile }) => {
    const { t } = useTranslation("Employee");
    const items = [
        {
            name: t("Profile.card.name"),
            value: profile?.name ?? ""
        },
        {
            name: t("Profile.card.age"),
            value: profile?.age ?? ""
        },
        {
            name: t("Profile.card.gender"),
            value: profile?.gender?.name ?? ""
        },
        {
            name: t("Profile.card.email"),
            value: profile?.email ?? ""
        },
        {
            name: t("Profile.card.city"),
            value: profile?.city?.name ?? ""
        },
        {
            name: t("Profile.card.description"),
            value: profile?.description ?? ""
        }
    ]

    return (
        <NameValueTable items={items} />
    )
}

export default EmployeeProfileCard

