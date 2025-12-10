import {createBrowserRouter} from "react-router-dom";
import RoutesListPage from "./pages/RoutesList.tsx";
import App from "./App.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import RouteWizardPage from "./pages/RouteWizardPage.tsx";
import HotelsPage from "./pages/HotelsPage.tsx";
import HotelDetailsPage from "./pages/HotelsDetailPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.tsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import POIPage from "./pages/POIPage.tsx";
import RouteDetailPage from "./pages/RouteDetailPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    { path: "/routes", element: <RoutesListPage /> },
    { path: "/routes/:id", element: <RouteDetailPage /> },
    { path: "/login", element: <LoginPage />},
    { path: "/register", element: <RegisterPage />},
    { path: "/verify-email", element: <VerifyEmailPage />},
    { path: "/forgot-password", element: <ForgotPasswordPage />},
    { path: "/reset-password", element: <ResetPasswordPage />},
    { path: "/wizard", element: <RouteWizardPage />},
    { path: "/hotels", element: <HotelsPage />},
    { path: "/hotels/:id", element: <HotelDetailsPage />},
    { path: "/poi", element: <POIPage />},
    { path: "/profile", element: <ProfilePage />}
]);