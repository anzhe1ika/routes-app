import { useState, useEffect } from "react";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { useWizard } from "../../contexts/WizardContext";
import { hotelService, type Hotel } from "../../services/hotelService";
import { useNavigate } from "react-router-dom";

type StepNavBaseProps = {
    onNext?: () => void;
    onPrev?: () => void;
};

export function Step4Stay({ onNext, onPrev }: StepNavBaseProps) {
    const { state, updateState } = useWizard();
    const navigate = useNavigate();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        checkIn: "",
        checkOut: "",
        guests: 2,
        budget: 60,
    });

    useEffect(() => {
        // Завантажуємо збережений готель, якщо є
        const savedHotel = localStorage.getItem('selected_hotel');
        if (savedHotel) {
            try {
                const hotelData = JSON.parse(savedHotel);
                updateState({ accommodation: hotelData });
                setSearchParams({
                    ...searchParams,
                    checkIn: hotelData.checkIn || "",
                    checkOut: hotelData.checkOut || "",
                });
                // Очищуємо збережені дані після завантаження
                localStorage.removeItem('selected_hotel');
                
                // Показуємо повідомлення користувачу
                setTimeout(() => {
                    alert(`Готель "${hotelData.hotelName}" успішно додано до маршруту!`);
                }, 500);
            } catch (error) {
                console.error("Error loading saved hotel:", error);
            }
        }
        handleSearch();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const results = await hotelService.searchHotels({
                location: state.destination || "",
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut,
                guests: searchParams.guests,
                maxPrice: (searchParams.budget / 100) * 5000, // Budget as percentage of max
            });
            setHotels(results);
        } catch (error) {
            console.error("Error searching hotels:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectHotel = (hotel: Hotel) => {
        updateState({
            accommodation: {
                id: hotel.id,
                hotelName: hotel.name,
                price: hotel.price,
                currency: hotel.currency,
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut,
        },
        });
    };

    return (
        <div className="max-w-6xl space-y-6">
            {/* Info message if hotel already selected */}
            {state.accommodation && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-green-800">
                                Готель вже обрано
                            </div>
                            <div className="text-sm text-green-700">
                                {state.accommodation.hotelName} ({state.accommodation.checkIn} —{" "}
                                {state.accommodation.checkOut})
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Form */}
            <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
                    <div>
                        <label className="block text-sm mb-1">Дата заїзду</label>
                        <Input
                            type="date"
                            value={searchParams.checkIn}
                            onChange={(e) =>
                                setSearchParams({
                                    ...searchParams,
                                    checkIn: e.target.value,
                                })
                            }
                            className="border-[#c0a894]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Дата виїзду</label>
                        <Input
                            type="date"
                            value={searchParams.checkOut}
                            onChange={(e) =>
                                setSearchParams({
                                    ...searchParams,
                                    checkOut: e.target.value,
                                })
                            }
                            className="border-[#c0a894]"
                        />
                    </div>
                <div>
                        <label className="block text-sm mb-1">Гості</label>
                        <Input
                            type="number"
                            value={searchParams.guests}
                            onChange={(e) =>
                                setSearchParams({
                                    ...searchParams,
                                    guests: Number(e.target.value),
                                })
                            }
                            min={1}
                            className="border-[#c0a894]"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-2">
                        Бюджет: {searchParams.budget}%
                    </label>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={searchParams.budget}
                        onChange={(e) =>
                            setSearchParams({
                                ...searchParams,
                                budget: Number(e.target.value),
                            })
                        }
                        className="w-full accent-[#5e3d2b]"
                    />
            </div>

            <div className="flex gap-3">
                    <Button
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full px-6"
                    >
                        {loading ? "Пошук..." : "Знайти готелі"}
                </Button>
                <Button
                    variant="outline"
                        onClick={() => navigate("/hotels")}
                    className="rounded-full border-[#c0a894]"
                >
                        Розширений пошук
                </Button>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="text-center py-8">Завантаження...</div>
            ) : hotels.length === 0 ? (
                <div className="text-center py-8 text-[#7a6a5d]">
                    Готелів не знайдено. Спробуйте змінити параметри пошуку.
                </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-[2fr,3fr] gap-6">
                {/* карта-плейсхолдер */}
                    <div className="bg-[#e5d7c5] rounded-2xl border border-[#d7c7b7] p-4 text-sm text-[#7a6a5d] h-fit">
                        <div className="h-64 flex items-center justify-center">
                    Мапа (плейсхолдер)
                        </div>
                </div>

                <div className="space-y-3">
                    {hotels.map((h) => (
                        <div
                                key={h.id}
                                className={`flex items-center bg-white rounded-2xl border px-4 py-3 gap-4 ${
                                    state.accommodation?.id === h.id
                                        ? "border-[#5e3d2b] bg-[#f9f4ee]"
                                        : "border-[#e0d5c7]"
                                }`}
                        >
                            <div className="w-24 h-16 rounded-lg bg-gradient-to-r from-[#e5d7c5] to-[#f3ece3]" />
                            <div className="flex-1">
                                <div className="font-semibold">{h.name}</div>
                                    <div className="text-sm text-[#7a6a5d]">
                                        {h.rating} ★ · {h.location}
                                    </div>
                                    <div className="text-xs text-[#7a6a5d] mt-1">
                                        {h.amenities.slice(0, 3).join(" · ")}
                                    </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                    <div className="font-semibold">
                                        {h.price} {h.currency}
                                    </div>
                                    <Button
                                        onClick={() => handleSelectHotel(h)}
                                        className={`rounded-full px-5 ${
                                            state.accommodation?.id === h.id
                                                ? "bg-green-700 hover:bg-green-800"
                                                : "bg-[#5e3d2b] hover:bg-[#4a2f21]"
                                        } text-white`}
                                    >
                                        {state.accommodation?.id === h.id
                                            ? "Обрано ✓"
                                            : "Обрати"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}

            <div className="flex gap-4 mt-6">
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