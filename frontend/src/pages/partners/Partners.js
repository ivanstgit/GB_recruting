import { useData } from '../../hooks/DataProvider.js'

import { EmployerPublicCard } from "../../components/shared/Employer.js";
import { useTranslation } from "react-i18next";


const PartnersPage = () => {
    const { t } = useTranslation("Partners");
    const dataProvider = useData()

    return (
        <div className="container-xxl py-0">

            <div>
                <div className="row g-3 mt-1">
                    <div className="text-center mx-auto mb-1 wow fadeInUp" data-wow-delay="0.1s">
                        <h2>{t("Partners.header")}</h2>
                    </div>
                </div>
                <div className="row g-3">
                    <PartnerList items={dataProvider.publicEmployers} />
                </div>
            </div>
        </div>
    )
}

const PartnerList = ({ items }) => {
    if (items) {
        return <div>
            {items.map((item, index) =>
                <EmployerPublicCard
                    key={'Partner' + index}
                    item={item}
                />)}
        </div>
    }
    return <div />
}

export default PartnersPage