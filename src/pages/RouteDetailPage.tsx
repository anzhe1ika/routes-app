import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Header } from "../components/Header";
import { routeService, type SavedRoute } from "../services/routeService";
import { MapPin, Calendar, DollarSign, Download, Share2, Edit, Trash2 } from "lucide-react";

export default function RouteDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [route, setRoute] = useState<SavedRoute | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRoute();
    }, [id]);

    const loadRoute = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const routeData = await routeService.getRouteById(id);
            setRoute(routeData);
        } catch (error) {
            console.error("Error loading route:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (!route) return;
        try {
            const shareLink = await routeService.shareRoute(route.id);
            await navigator.clipboard.writeText(shareLink);
            alert("Посилання скопійовано в буфер обміну!");
        } catch (error) {
            alert("Помилка при створенні посилання");
        }
    };

    const handleExport = async () => {
        if (!route) return;
        try {
            const pdfBlob = await routeService.exportRouteToPDF(route.id);
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${route.title}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            alert("Помилка при експорті PDF");
        }
    };

    const handleDelete = async () => {
        if (!route) return;
        if (!window.confirm("Ви впевнені, що хочете видалити цей маршрут?")) {
            return;
        }

        try {
            await routeService.deleteRoute(route.id);
            navigate("/routes");
        } catch (error) {
            alert("Помилка при видаленні маршруту");
        }
    };

    // Групуємо точки по датах
    const groupedPoints = route?.points.reduce((acc, point) => {
        const date = point.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(point);
        return acc;
    }, {} as Record<string, typeof route.points>) || {};

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f3ece3] flex items-center justify-center">
                <Header />
                <div className="text-[#4b2e23]">Завантаження...</div>
            </div>
        );
    }

    if (!route) {
        return (
            <div className="min-h-screen bg-[#f3ece3]">
                <Header />
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="text-center py-12">
                        <p className="text-[#7a6a5d] mb-4">Маршрут не знайдено</p>
                        <Button
                            onClick={() => navigate("/routes")}
                            className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full px-6"
                        >
                            Повернутися до маршрутів
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3ece3] text-[#4b2e23]">
            <Header />
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        onClick={() => navigate("/routes")}
                        variant="outline"
                        className="mb-4 rounded-full border-[#c0a894]"
                    >
                        ← Назад до маршрутів
                    </Button>
                    <h1 className="text-4xl font-bold mb-2">{route.title}</h1>
                    <div className="text-sm text-[#7a6a5d]">
                        Створено: {new Date(route.createdAt).toLocaleDateString("uk-UA", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <Button
                        onClick={handleShare}
                        className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full px-6"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Поділитися
                    </Button>
                    <Button
                        onClick={handleExport}
                        variant="outline"
                        className="rounded-full border-[#c0a894]"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Експорт PDF
                    </Button>
                    <Button
                        onClick={() => {
                            // TODO: Implement edit functionality
                            alert("Редагування маршруту буде реалізовано");
                        }}
                        variant="outline"
                        className="rounded-full border-[#c0a894]"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Редагувати
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="outline"
                        className="rounded-full border-red-300 text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Видалити
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6">
                            <h2 className="text-xl font-semibold mb-4">Основна інформація</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-[#7a6a5d]" />
                                    <div>
                                        <div className="text-sm text-[#7a6a5d]">Напрям</div>
                                        <div className="font-medium">{route.destination}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-[#7a6a5d]" />
                                    <div>
                                        <div className="text-sm text-[#7a6a5d]">Дати</div>
                                        <div className="font-medium">{route.dateRange}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-5 h-5 text-[#7a6a5d]" />
                                    <div>
                                        <div className="text-sm text-[#7a6a5d]">Бюджет</div>
                                        <div className="font-medium">{route.budget}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transport */}
                        {route.transport && (
                            <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6">
                                <h2 className="text-xl font-semibold mb-4">Транспорт</h2>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{route.transport.name}</div>
                                        <div className="text-sm text-[#7a6a5d]">
                                            {route.transport.route}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">
                                            {route.transport.price} {route.transport.currency}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Accommodation */}
                        {route.accommodation && (
                            <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6">
                                <h2 className="text-xl font-semibold mb-4">Проживання</h2>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">
                                            {route.accommodation.hotelName}
                                        </div>
                                        <div className="text-sm text-[#7a6a5d]">
                                            {route.accommodation.checkIn} —{" "}
                                            {route.accommodation.checkOut}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">
                                            {route.accommodation.price}{" "}
                                            {route.accommodation.currency}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Daily Schedule */}
                        <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6">
                            <h2 className="text-xl font-semibold mb-4">Розклад маршруту</h2>
                            {Object.keys(groupedPoints).length === 0 ? (
                                <div className="text-center py-8 text-[#7a6a5d]">
                                    Точки маршруту не додані
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(groupedPoints).map(([date, points]) => (
                                        <div key={date} className="border-l-4 border-[#5e3d2b] pl-4">
                                            <div className="font-semibold mb-3">
                                                {new Date(date).toLocaleDateString("uk-UA", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                })}
                                            </div>
                                            <div className="space-y-3">
                                                {points.map((point, index) => (
                                                    <div
                                                        key={point.id}
                                                        className="bg-[#f9f4ee] rounded-lg p-3"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="bg-[#5e3d2b] text-white text-xs px-2 py-1 rounded-full mt-1">
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium mb-1">
                                                                    {point.name}
                                                                </div>
                                                                <div className="text-sm text-[#7a6a5d]">
                                                                    🕐 {point.timeStart} —{" "}
                                                                    {point.timeEnd}
                                                                </div>
                                                                {point.notes && (
                                                                    <div className="text-sm text-[#7a6a5d] mt-1">
                                                                        📝 {point.notes}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6">
                            <h3 className="font-semibold text-lg mb-4">Підсумок</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#7a6a5d]">Точок маршруту</span>
                                    <span className="font-medium">{route.points.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#7a6a5d]">Днів</span>
                                    <span className="font-medium">
                                        {Object.keys(groupedPoints).length}
                                    </span>
                                </div>
                                {route.transport && (
                                    <>
                                        <hr className="border-[#e0d5c7]" />
                                        <div className="flex justify-between">
                                            <span className="text-[#7a6a5d]">Транспорт</span>
                                            <span className="font-medium">
                                                {route.transport.price}{" "}
                                                {route.transport.currency}
                                            </span>
                                        </div>
                                    </>
                                )}
                                {route.accommodation && (
                                    <div className="flex justify-between">
                                        <span className="text-[#7a6a5d]">Проживання</span>
                                        <span className="font-medium">
                                            {route.accommodation.price}{" "}
                                            {route.accommodation.currency}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-white rounded-2xl border border-[#e0d5c7] p-4">
                            <div className="w-full h-64 bg-gradient-to-br from-[#e5d7c5] to-[#f3ece3] rounded-xl flex items-center justify-center text-sm text-[#7a6a5d]">
                                Мапа маршруту (плейсхолдер)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


