import { useState, useEffect } from "react";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { routeService, type SavedRoute } from "../services/routeService";
import { Trash2, Share2, Download, Eye } from "lucide-react";

export default function RoutesListPage() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [routes, setRoutes] = useState<SavedRoute[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        loadRoutes();
    }, [isAuthenticated, navigate]);

    const loadRoutes = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const userRoutes = await routeService.getUserRoutes(user.id);
            setRoutes(userRoutes);
        } catch (error) {
            console.error("Error loading routes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (routeId: string) => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей маршрут?")) {
            return;
        }

        try {
            await routeService.deleteRoute(routeId);
            setRoutes(routes.filter((r) => r.id !== routeId));
        } catch (error) {
            alert("Помилка при видаленні маршруту");
        }
    };

    const handleShare = async (routeId: string) => {
        try {
            const shareLink = await routeService.shareRoute(routeId);
            await navigator.clipboard.writeText(shareLink);
            alert("Посилання скопійовано в буфер обміну!");
        } catch (error) {
            alert("Помилка при створенні посилання");
        }
    };

    const handleExport = async (routeId: string, title: string) => {
        try {
            const pdfBlob = await routeService.exportRouteToPDF(routeId);
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${title}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            alert("Помилка при експорті PDF");
        }
    };

    const filteredRoutes = routes.filter(
        (route) =>
            route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            route.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f3ece3] text-[#4b2e23]">
            <Header />
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-[#4b2e23]">Мої маршрути</h1>

                    <Button
                        onClick={() => navigate("/wizard")}
                        className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full px-6"
                    >
                        Створити маршрут
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-[#ebe1d2] p-4 rounded-xl mb-10">
                    <Input
                        placeholder="Пошук маршрутів..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white rounded-full px-4 py-2 w-60 border-none shadow-sm"
                    />

                    <div className="flex-1" />

                    <div className="text-sm text-[#7a6a5d]">
                        Знайдено: {filteredRoutes.length}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">Завантаження...</div>
                ) : filteredRoutes.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-[#7a6a5d] mb-6">
                            {routes.length === 0
                                ? "У вас ще немає збережених маршрутів"
                                : "Маршрутів не знайдено"}
                        </div>
                        <Button
                            onClick={() => navigate("/wizard")}
                            className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full px-6"
                        >
                            Створити перший маршрут
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRoutes.map((route) => (
                        <div
                                key={route.id}
                                className="rounded-2xl bg-white border border-[#e0d5c7] p-6 shadow-sm flex flex-col"
                        >
                                <div className="bg-gradient-to-br from-[#e5d7c5] to-[#f3ece3] h-32 w-full rounded-lg mb-4" />

                                <h3 className="font-bold text-lg mb-2">{route.title}</h3>
                                <div className="text-sm text-[#7a6a5d] mb-1">
                                    📍 {route.destination}
                                </div>
                                <div className="text-sm text-[#7a6a5d] mb-1">
                                    📅 {route.dateRange}
                                </div>
                                <div className="text-sm text-[#7a6a5d] mb-4">
                                    🗺️ {route.points.length} точок маршруту
                                </div>

                                <div className="flex flex-wrap gap-2 mt-auto">
                                    <Button
                                        onClick={() => navigate(`/routes/${route.id}`)}
                                        className="flex-1 bg-[#5e3d2b] hover:bg-[#4b2e23] text-white rounded-full px-4"
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                    Відкрити
                                </Button>

                                <Button
                                        onClick={() => handleShare(route.id)}
                                    variant="outline"
                                        className="rounded-full border-[#c0a894] px-3"
                                        title="Поділитися"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </Button>

                                <Button
                                        onClick={() => handleExport(route.id, route.title)}
                                    variant="outline"
                                        className="rounded-full border-[#c0a894] px-3"
                                        title="Експортувати PDF"
                                    >
                                        <Download className="w-4 h-4" />
                                    </Button>

                    <Button
                                        onClick={() => handleDelete(route.id)}
                        variant="outline"
                                        className="rounded-full border-red-300 text-red-600 hover:bg-red-50 px-3"
                                        title="Видалити"
                    >
                                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                                <div className="text-xs text-[#7a6a5d] mt-3">
                                    Створено:{" "}
                                    {new Date(route.createdAt).toLocaleDateString("uk-UA")}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}