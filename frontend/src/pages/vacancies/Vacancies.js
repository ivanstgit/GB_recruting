import { Route, Routes } from "react-router-dom";
import VacancyListPage from "./VacancyList";
import VacancyDetailPage from "./VacancyDetail";
import NotFound404 from "../../components/NotFound404";

const VacanciesPage = () => {
    return (
        <div className="container-xxl py-0">
            <Routes>
                <Route index element={<VacancyListPage backTo={"../"} />} />
                <Route path={":id"} element={<VacancyDetailPage backTo={"../"} />} />
                <Route element={<NotFound404 />} />
            </Routes>
        </div>
    )
}

export default VacanciesPage