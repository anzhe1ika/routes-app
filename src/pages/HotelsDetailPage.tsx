import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { useState, useEffect } from "react";
import { hotelService, type Hotel } from "../services/hotelService";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";

export default function HotelDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBooking, setShowBooking] = useState(false);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(2);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        loadHotel();
    }, [id]);

    const loadHotel = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await hotelService.getHotelById(id);
            setHotel(data);
        } catch (error) {
            console.error("Error loading hotel:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!isAuthenticated) {
            alert("Будь ласка, увійдіть в систему для бронювання");
            navigate("/login");
            return;
        }

        if (!checkIn || !checkOut) {
            alert("Будь ласка, оберіть дати заїзду та виїзду");
            return;
        }

        if (!hotel || !user) return;

        setBookingLoading(true);
        try {
            await hotelService.bookHotel(user.id, hotel.id, checkIn, checkOut, guests);
            
            // Зберігаємо дані готелю для використання в майстрі
            const hotelData = {
                id: hotel.id,
                hotelName: hotel.name,
                price: hotel.price,
                currency: hotel.currency,
                checkIn,
                checkOut,
            };
            localStorage.setItem('selected_hotel', JSON.stringify(hotelData));
            
            // Оновлюємо wizard_draft, щоб зберегти крок 4 та додати готель
            const savedDraft = localStorage.getItem('wizard_draft');
            if (savedDraft) {
                try {
                    const draft = JSON.parse(savedDraft);
                    draft.step = 4; // Повертаємося на крок 4
                    draft.state.accommodation = hotelData;
                    localStorage.setItem('wizard_draft', JSON.stringify(draft));
                } catch (e) {
                    console.error('Error updating draft:', e);
                }
            }
            
            // Показуємо модальне вікно успіху
            setShowBooking(false);
            setShowSuccessModal(true);
        } catch (error) {
            alert("Помилка при бронюванні. Спробуйте ще раз.");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f3ece3] flex items-center justify-center">
                <div className="text-[#4b2e23]">Завантаження...</div>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="min-h-screen bg-[#f3ece3] flex items-center justify-center">
                <div className="text-[#4b2e23]">Готель не знайдено</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3ece3] text-[#4b2e23]">
            <Header />
            <div className="max-w-7xl mx-auto px-6 py-10">
                <Button
                    onClick={() => navigate("/hotels")}
                    variant="outline"
                    className="mb-6 rounded-full border-[#c0a894]"
                >
                    ← Назад до списку
                </Button>

                <h1 className="text-3xl font-bold mb-6">{hotel.name}</h1>

                <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
                    <div className="space-y-6">
                        {/* Main Info */}
                    <div className="border border-[#d7c7b7] rounded-2xl p-6 bg-white">
                            <div className="w-full h-64 rounded-xl bg-gradient-to-br from-[#e5d7c5] to-[#f3ece3] mb-4" />

                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="text-sm text-[#7a6a5d] mb-1">
                                        {hotel.rating} ★ · {hotel.location}
                                    </div>
                                <div className="text-sm text-[#7a6a5d]">
                                        {hotel.distance}
                                    </div>
                                    {hotel.address && (
                                        <div className="text-sm text-[#7a6a5d] mt-1">
                                            📍 {hotel.address}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-2xl">
                                        {hotel.price} {hotel.currency}
                                    </div>
                                    <div className="text-sm text-[#7a6a5d]">за ніч</div>
                                </div>
                            </div>

                            <p className="text-sm mb-6">{hotel.description}</p>

                            {/* Amenities */}
                            <div className="mb-6">
                                <div className="font-semibold mb-3">Зручності</div>
                                <div className="flex flex-wrap gap-2">
                                    {hotel.amenities.map((amenity) => (
                                        <span
                                            key={amenity}
                                            className="bg-[#f9f4ee] px-3 py-1 rounded-full text-sm"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Check-in/out times */}
                            {(hotel.checkInTime || hotel.checkOutTime) && (
                                <div className="mb-6 grid grid-cols-2 gap-4">
                                    {hotel.checkInTime && (
                                        <div>
                                            <div className="text-sm text-[#7a6a5d]">Заїзд</div>
                                            <div className="font-semibold">
                                                {hotel.checkInTime}
                                            </div>
                                        </div>
                                    )}
                                    {hotel.checkOutTime && (
                                        <div>
                                            <div className="text-sm text-[#7a6a5d]">Виїзд</div>
                                            <div className="font-semibold">
                                                {hotel.checkOutTime}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                                <Button
                                onClick={() => setShowBooking(!showBooking)}
                                className="w-full bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full py-3"
                                >
                                    Забронювати
                                </Button>
                        </div>

                        {/* Booking Form */}
                        {showBooking && (
                            <div className="border border-[#d7c7b7] rounded-2xl p-6 bg-white">
                                <h3 className="font-semibold text-lg mb-4">Бронювання</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm mb-1">Дата заїзду</label>
                                        <Input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                            className="border-[#c0a894] rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Дата виїзду</label>
                                        <Input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            className="border-[#c0a894] rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Кількість гостей</label>
                                        <Input
                                            type="number"
                                            value={guests}
                                            onChange={(e) => setGuests(Number(e.target.value))}
                                            min={1}
                                            className="border-[#c0a894] rounded-lg"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleBooking}
                                            disabled={bookingLoading}
                                            className="flex-1 bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full"
                                                >
                                            {bookingLoading
                                                ? "Бронювання..."
                                                : "Підтвердити бронювання"}
                                        </Button>
                                        <Button
                                            onClick={() => setShowBooking(false)}
                                            variant="outline"
                                            className="rounded-full border-[#c0a894]"
                                        >
                                            Скасувати
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Map */}
                    <div className="border border-[#d7c7b7] rounded-2xl p-4 bg-white">
                        <div className="w-full h-[400px] bg-gradient-to-br from-[#e5d7c5] to-[#f3ece3] rounded-xl flex items-center justify-center text-sm text-[#7a6a5d]">
                            Мапа (плейсхолдер)
                        </div>
                        {hotel.website && (
                            <div className="mt-4">
                                <a
                                    href={`https://${hotel.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[#5e3d2b] hover:underline"
                                >
                                    🌐 {hotel.website}
                                </a>
                            </div>
                        )}
                        {hotel.phone && (
                            <div className="mt-2">
                                <a
                                    href={`tel:${hotel.phone}`}
                                    className="text-sm text-[#5e3d2b] hover:underline"
                                >
                                    📞 {hotel.phone}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl border border-[#d7c7b7] p-8 max-w-md w-full text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-green-600"
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
                            
                            <h2 className="text-2xl font-bold text-[#4b2e23] mb-2">
                                Готель заброньовано!
                            </h2>
                            
                            <p className="text-[#7a6a5d] mb-6">
                                Ваше бронювання в готелі <strong>{hotel?.name}</strong> успішно
                                підтверджено. Бажаєте продовжити створення маршруту?
                            </p>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        navigate("/wizard");
                                    }}
                                    className="w-full bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full py-3"
                                >
                                    Продовжити створення маршруту
                                </Button>
                                
                                <Button
                                    onClick={() => setShowSuccessModal(false)}
                                    variant="outline"
                                    className="w-full rounded-full border-[#c0a894]"
                                >
                                    Залишитися тут
                                </Button>
                                
                                <Button
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        navigate("/routes");
                                    }}
                                    variant="outline"
                                    className="w-full rounded-full border-[#c0a894]"
                                >
                                    Переглянути мої маршрути
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}