import {Route, Routes} from "react-router-dom";
import LoginPage from "../pages/LoginPage.tsx";
import NotFound from "../pages/NotFound.tsx";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}