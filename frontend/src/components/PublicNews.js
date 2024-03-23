import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useData } from '../hooks/DataProvider.js'
import AppPaths from "../routes/AppPaths.js"


const PublicNewsCard = ({ item, linkText }) => {
    return (
        <div className="col-lg-4 col-md-6 ">
            <div className="card h-100 mb-0">
                <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.body}</p>
                    <Link to={AppPaths.news + item.id + "/"} className="card-link mb-0">{linkText}</Link>
                </div>
            </div>
        </div>
    )
}

const PublicNewsItem = ({ item, linkText }) => {
    return (
        <div className="row g-3">
            <div className="h-100 mb-0">
                <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-subtitle">{new Date(item.created_at).toLocaleString()}</p>
                    <p className="card-text">{item.body}</p>
                    <Link to={AppPaths.news + item.id + "/"} className="card-link mb-0">{linkText}</Link>
                </div>
            </div>
        </div>
    )
}

const PublicNewsList = (props) => {
    const dataProvider = useData()
    const items = dataProvider.publicNews
    const { t } = useTranslation("News");
    const linkText = t("News.link")

    console.log("News renders" + props)

    if (props.asCards) {
        return (
            <div className="container-xxl py-1">
                <div className="row g-3 mt-1">
                    <div className="text-center mx-auto mb-1 wow fadeInUp" data-wow-delay="0.1s">
                        <h2>{t("News.header")}</h2>
                    </div>
                </div>

                <div className="row g-3">
                    {items.map((item, index) => <PublicNewsCard key={'NewsCard' + index} item={item} linkText={linkText} />)}
                </div>
            </div>
        )
    } else {
        return (
            <div className="container-xxl py-1">
                <div className="row g-3 mt-1">
                    <div className="text-center mx-auto mb-1 wow fadeInUp" data-wow-delay="0.1s">
                        <h2>{t("News.header")}</h2>
                    </div>
                </div>

                {items.map((item, index) => <PublicNewsItem key={'NewsItem' + index} item={item} linkText={linkText} />)}
            </div>
        )
    }

}
export default PublicNewsList