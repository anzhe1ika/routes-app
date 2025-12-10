import { useState, useEffect } from "react";
import { Button } from "../ui/button.tsx";
import { useWizard } from "../../contexts/WizardContext";
import { poiService, type POI } from "../../services/poiService";
import { useNavigate } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

type StepNavBaseProps = {
    onNext?: () => void;
    onPrev?: () => void;
};

export function Step5Overview({ onNext, onPrev }: StepNavBaseProps) {
    const { state } = useWizard();
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState<POI[]>([]);

    useEffect(() => {
        if (state.destination) {
            loadRecommendations();
        }
    }, [state.destination]);

    const loadRecommendations = async () => {
        try {
            const pois = await poiService.getRecommendations(state.destination);
            setRecommendations(pois);
        } catch (error) {
            console.error("Error loading recommendations:", error);
        }
    };

    // Group points by date
    const groupedPoints = state.points.reduce((acc, point) => {
        const date = point.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(point);
        return acc;
    }, {} as Record<string, typeof state.points>);

    const calculateTotalCost = () => {
        let total = 0;
        if (state.transport) total += state.transport.price;
        if (state.accommodation) total += state.accommodation.price;
        return total;
    };

    return (
        <div className="max-w-6xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-[3fr,1.4fr] gap-6">
                <div className="space-y-6">
                    {/* Route Overview */}
                    <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6">
                        <h3 className="font-semibold text-lg mb-4">Огляд маршруту</h3>
                        
                        {/* Destination */}
                        <div className="mb-4">
                            <div className="text-sm text-[#7a6a5d]">Напрям</div>
                            <div className="font-semibold">{state.destination}</div>
                        </div>

                        {/* Dates */}
                        <div className="mb-4">
                            <div className="text-sm text-[#7a6a5d]">Дати</div>
                            <div className="font-semibold">{state.dateRange}</div>
                        </div>

                        {/* Transport */}
                        {state.transport && (
                            <div className="mb-4">
                                <div className="text-sm text-[#7a6a5d]">Транспорт</div>
                                <div className="font-semibold">
                                    {state.transport.name} · {state.transport.price}{" "}
                                    {state.transport.currency}
                                </div>
                            </div>
                        )}

                        {/* Accommodation */}
                        {state.accommodation && (
                            <div className="mb-4">
                                <div className="text-sm text-[#7a6a5d]">Проживання</div>
                                <div className="font-semibold">
                                    {state.accommodation.hotelName} · {state.accommodation.price}{" "}
                                    {state.accommodation.currency}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Daily Schedule */}
                <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Розклад по днях</h3>
                        {Object.keys(groupedPoints).length === 0 ? (
                            <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6 text-center text-[#7a6a5d]">
                                Додайте точки маршруту на кроці 2
                            </div>
                        ) : (
                            Object.entries(groupedPoints).map(([date, points]) => (
                        <div
                                    key={date}
                                    className="bg-white rounded-2xl border border-[#e0d5c7] p-4"
                        >
                                    <div className="font-semibold mb-3">
                                        {new Date(date).toLocaleDateString("uk-UA", {
                                            weekday: "short",
                                            day: "numeric",
                                            month: "long",
                                        })}
                                    </div>
                                    <div className="space-y-2">
                                        {points.map((point) => (
                                            <div
                                                key={point.id}
                                                className="text-sm flex items-start gap-2"
                                            >
                                                <span className="text-[#7a6a5d] min-w-[80px]">
                                                    {point.timeStart} — {point.timeEnd}
                                                </span>
                                                <span className="flex-1">{point.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* POI Recommendations */}
                    {recommendations.length > 0 && (
                        <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg">
                                    Рекомендовані місця
                                </h3>
                                <Button
                                    onClick={() =>
                                        navigate(`/poi?location=${state.destination}`)
                                    }
                                    variant="outline"
                                    className="rounded-full border-[#c0a894] text-sm"
                                >
                                    Переглянути всі
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {recommendations.slice(0, 4).map((poi) => (
                                    <div
                                        key={poi.id}
                                        className="border border-[#e0d5c7] rounded-lg p-3 hover:bg-[#f9f4ee] cursor-pointer"
                                        onClick={() =>
                                            navigate(`/poi?location=${state.destination}`)
                                        }
                                    >
                                        <div className="font-semibold text-sm mb-1">
                                            {poi.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-[#7a6a5d] mb-1">
                                            <Star className="w-3 h-3 text-yellow-500" />
                                            <span>{poi.rating}</span>
                                            <MapPin className="w-3 h-3 ml-1" />
                                            <span>{poi.location}</span>
                                        </div>
                                        <div className="text-xs text-[#7a6a5d] line-clamp-2">
                                            {poi.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Budget Summary */}
                <div className="bg-white rounded-2xl border border-[#e0d5c7] p-4 space-y-3 h-fit">
                    <div className="font-semibold text-lg">Бюджет</div>
                    
                    {state.accommodation && (
                    <div className="flex justify-between text-sm">
                        <span>Проживання</span>
                            <span>
                                {state.accommodation.price} {state.accommodation.currency}
                            </span>
                    </div>
                    )}
                    
                    {state.transport && (
                    <div className="flex justify-between text-sm">
                        <span>Транспорт</span>
                            <span>
                                {state.transport.price} {state.transport.currency}
                            </span>
                    </div>
                    )}
                    
                    <hr className="border-[#e0d5c7]" />
                    
                    <div className="flex justify-between font-semibold">
                        <span>Разом</span>
                        <span>{calculateTotalCost()} UAH</span>
                    </div>

                    <div className="pt-4 text-xs text-[#7a6a5d]">
                        * Вартість може змінюватися залежно від дати бронювання
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <Button
                    onClick={onNext}
                    className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full px-6"
                >
                    Далі →
                </Button>
                <Button
                    variant="outline"
                    onClick={onPrev}
                    className="rounded-full border-[#c0a894]"
                >
                    Назад
                </Button>
            </div>
        </div>
    );
}