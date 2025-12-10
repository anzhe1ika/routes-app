import { useState, useEffect } from "react";
import { Input } from "../components/ui/input.tsx";
import { Button } from "../components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { hotelService, type Hotel } from "../services/hotelService";
import { Header } from "../components/Header";

export default function HotelsPage() {
    const [showFilters, setShowFilters] = useState(false);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Search and filter state
    const [searchLocation, setSearchLocation] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(2);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [minRating, setMinRating] = useState(0);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const allAmenities = hotelService.getAllAmenities();

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const results = await hotelService.searchHotels({
                location: searchLocation,
                checkIn,
                checkOut,
                guests,
                minPrice,
                maxPrice,
                minRating,
                amenities: selectedAmenities,
            });
            setHotels(results);
        } catch (error) {
            console.error("Error searching hotels:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenity)
                ? prev.filter((a) => a !== amenity)
                : [...prev, amenity]
        );
    };

    return (
        <div className="min-h-screen bg-[#f3ece3] text-[#4b2e23]">
            <Header />
            <div className="max-w-7xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold mb-6">Готелі – пошук за фільтрами</h1>

                {/* Search Form */}
                <div className="bg-white rounded-2xl border border-[#d7c7b7] p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <Input
                            placeholder="Місце (місто, район)"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            className="border-[#c0a894] rounded-lg"
                        />
                        <Input
                            type="date"
                            placeholder="Заїзд"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="border-[#c0a894] rounded-lg"
                        />
                        <Input
                            type="date"
                            placeholder="Виїзд"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="border-[#c0a894] rounded-lg"
                        />
                        <Input
                            type="number"
                            placeholder="Гості"
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            min={1}
                            className="border-[#c0a894] rounded-lg"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full px-6"
                        >
                            {loading ? "Пошук..." : "Знайти готелі"}
                        </Button>
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            variant="outline"
                            className="rounded-full border-[#c0a894]"
                        >
                            Фільтри {showFilters ? "▲" : "▼"}
                        </Button>
                    </div>

                    {/* Filters Panel */}
                        {showFilters && (
                        <div className="mt-6 pt-6 border-t border-[#e0d5c7]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <div className="text-sm font-medium mb-2">
                                        Рейтинг: {minRating.toFixed(1)}+
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={minRating}
                                        onChange={(e) => setMinRating(Number(e.target.value))}
                                        className="w-full accent-[#5e3d2b]"
                                    />
                                </div>

                                <div>
                                    <div className="text-sm font-medium mb-2">
                                        Ціна: {minPrice} - {maxPrice} UAH
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="10000"
                                            step="100"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(Number(e.target.value))}
                                            className="w-full accent-[#5e3d2b]"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="10000"
                                            step="100"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                                            className="w-full accent-[#5e3d2b]"
                                />
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm font-medium mb-2">Зручності</div>
                                    <div className="flex flex-wrap gap-2">
                                        {allAmenities.slice(0, 4).map((amenity) => (
                                            <button
                                                key={amenity}
                                                onClick={() => toggleAmenity(amenity)}
                                                className={`px-3 py-1 rounded-full text-xs ${
                                                    selectedAmenities.includes(amenity)
                                                        ? "bg-[#5e3d2b] text-white"
                                                        : "bg-[#e5d7c5] text-[#4b2e23]"
                                                }`}
                                            >
                                                {amenity}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            </div>
                        )}
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-12">Завантаження...</div>
                ) : hotels.length === 0 ? (
                    <div className="text-center py-12 text-[#7a6a5d]">
                        Готелів не знайдено. Спробуйте змінити параметри пошуку.
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-sm text-[#7a6a5d]">
                            Знайдено готелів: {hotels.length}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hotels.map((h) => (
                        <div
                                    key={h.id}
                                    className="bg-white border border-[#e0d5c7] rounded-2xl p-4 flex flex-col"
                        >
                                    <div className="w-full h-32 rounded-lg bg-gradient-to-br from-[#e5d7c5] to-[#f3ece3] mb-3" />

                            <div className="flex-1">
                                        <div className="font-bold text-lg mb-1">{h.name}</div>
                                        <div className="text-sm text-[#7a6a5d] mb-2">
                                            {h.rating} ★ · {h.location}
                                        </div>
                                        <div className="text-xs text-[#7a6a5d] mb-2">
                                            {h.distance}
                                        </div>
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {h.amenities.slice(0, 3).map((amenity) => (
                                                <span
                                                    key={amenity}
                                                    className="text-xs bg-[#f9f4ee] px-2 py-1 rounded"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="font-bold text-xl mb-3">
                                            {h.price} {h.currency}
                                            <span className="text-sm font-normal text-[#7a6a5d]">
                                                {" "}
                                                / ніч
                                            </span>
                                </div>
                            </div>

                            <Button
                                        onClick={() => navigate(`/hotels/${h.id}`)}
                                        className="w-full bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full"
                            >
                                        Переглянути
                            </Button>
                        </div>
                    ))}
                </div>
                    </>
                )}
            </div>
        </div>
    );
}