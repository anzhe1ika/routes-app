import { User, LogOut } from "lucide-react";
import { Button } from "./ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="w-full bg-[#f9f4ee] py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
                <div
                    onClick={() => navigate("/")}
                    className="text-xl font-semibold cursor-pointer hover:text-[#5e3d2b]"
                >
                    Маршрутизатор
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-2">
                                <User
                                    className="w-5 h-5 text-[#4b2e23] cursor-pointer hover:text-[#5e3d2b]"
                                    onClick={() => navigate("/profile")}
                                />
                                <span className="text-sm text-[#4b2e23] hidden md:inline">
                                    {user?.firstName || user?.email}
                                </span>
                            </div>
                            <Button
                                onClick={() => navigate("/routes")}
                                className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white font-medium rounded-full"
                            >
                                Мої маршрути
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="rounded-full border-[#c0a894]"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={() => navigate("/login")}
                                variant="outline"
                                className="rounded-full border-[#c0a894]"
                            >
                                Вхід
                            </Button>
                            <Button
                                onClick={() => navigate("/register")}
                                className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white font-medium rounded-full"
                            >
                                Реєстрація
                    </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}