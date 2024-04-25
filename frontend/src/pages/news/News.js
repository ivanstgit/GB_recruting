import { Route, Routes } from "react-router-dom";

import { useData } from '../../hooks/DataProvider.js'

import NewsDetailPage from "./NewsDetail.js";
import { NewsList } from "../../components/NewsElements.js";
import NotFound404 from "../../components/NotFound404.js";


const NewsPage = () => {
    const dataProvider = useData()
    const items = dataProvider.publicNews


    return (
        <div className="container-xxl py-0">
            <Routes>
                <Route index element={
                    <NewsList items={items} linkPath={""} asCards={false} />
                }
                />
                <Route path={":id"} element={<NewsDetailPage />} />
                <Route element={<NotFound404 />} />
            </Routes>
        </div>
    )

}
export default NewsPage
