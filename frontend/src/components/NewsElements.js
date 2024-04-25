import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

export const NewsCard = ({ item, linkText, linkPath }) => {
    return (
        <div className="col-lg-4 col-md-6 ">
            <div className="card h-100 mb-0">
                <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.body}</p>
                    <Link to={linkPath + item.id + "/"} className="card-link mb-0">{linkText}</Link>
                </div>
            </div>
        </div>
    )
}

export const NewsDetail = ({ item }) => {
    return (

        <div className="h-100 mb-0">
            <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <h6 className="card-subtitle">{new Date(item.created_at).toLocaleString()}</h6>
                <p className="card-text">{item.content}</p>
            </div>
        </div>
    )
}

export const NewsListItem = ({ item, linkText, linkPath }) => {
    return (
        <div className="row g-3">
            <div className="h-100 mb-0">
                <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-subtitle">{new Date(item.created_at).toLocaleString()}</p>
                    <p className="card-text">{item.body}</p>
                    <Link to={linkPath + item.id + "/"} className="card-link mb-0">{linkText}</Link>
                </div>
            </div>
        </div>
    )
}

export const NewsList = ({ items, asCards = false, linkPath }) => {

    const { t } = useTranslation("News");
    const linkText = t("News.link")

    if (asCards) {
        return (
            <div className="container-xxl py-1">
                <div className="row g-3 mt-1">
                    <div className="text-center mx-auto mb-1 wow fadeInUp" data-wow-delay="0.1s">
                        <h2>{t("News.header")}</h2>
                    </div>
                </div>

                <div className="row g-3">
                    {items.map((item, index) => <NewsCard key={'NewsCard' + index} item={item} linkText={linkText} linkPath={linkPath} />)}
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

                {items.map((item, index) => <NewsListItem key={'NewsItem' + index} item={item} linkText={linkText} linkPath={linkPath} />)}
            </div>
        )
    }
}
