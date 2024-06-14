import { Route, Routes } from "react-router-dom";
import NotFound404 from "../../components/NotFound404";
import CVDetailPage from "./CVDetail";
import CVListPage from "./CVList";

const CVPage = () => {

    return (
        <div className="container-xxl py-0">
            <Routes>
                <Route index element={<CVListPage backTo={"../"} />} />
                <Route path={":id"} element={<CVDetailPage backTo={"../"} />} />
                <Route element={<NotFound404 />} />
            </Routes>
        </div>
    )

}
export default CVPage