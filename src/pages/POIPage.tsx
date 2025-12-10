import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Header } from "../components/Header";
import { poiService, type POI, type POICategory } from "../services/poiService";
import { MapPin, Clock, DollarSign, Star } from "lucide-react";

export default function POIPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [pois, setPois] = useState<POI[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchLocation, setSearchLocation] = useState(
        searchParams.get("location") || ""
    );
    const [selectedCategory, setSelectedCategory] = useState<POICategory | undefined>(
        undefined
    );
    const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);

    const categories = poiService.getCategories();

    useEffect(() => {
        if (searchLocation) {
            handleSearch();
        }
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const results = await poiService.searchPOIs(searchLocation, selectedCategory);
            setPois(results);
        } catch (error) {
            console.error("Error searching POIs:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3ece3] text-[#4b2e23]">
            <Header />
            <div className="max-w-7xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold mb-6">Цікаві місця та пам'ятки</h1>

                {/* Search Form */}
                <div className="bg-white rounded-2xl border border-[#d7c7b7] p-6 mb-6">
                    <div className="flex gap-4 mb-4">
                        <Input
                            placeholder="Пошук за містом або назвою"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            className="flex-1 border-[#c0a894] rounded-lg"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full px-6"
                        >
                            {loading ? "Пошук..." : "Знайти"}
                        </Button>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => {
                                setSelectedCategory(undefined);
                                handleSearch();
                            }}
                            className={`px-4 py-2 rounded-full text-sm ${
                                selectedCategory === undefined
                                    ? "bg-[#5e3d2b] text-white"
                                    : "bg-[#e5d7c5] text-[#4b2e23]"
                            }`}
                        >
                            Всі категорії
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => {
                                    setSelectedCategory(cat.value);
                                }}
                                className={`px-4 py-2 rounded-full text-sm ${
                                    selectedCategory === cat.value
                                        ? "bg-[#5e3d2b] text-white"
                                        : "bg-[#e5d7c5] text-[#4b2e23]"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-12">Завантаження...</div>
                ) : pois.length === 0 ? (
                    <div className="text-center py-12 text-[#7a6a5d]">
                        Місць не знайдено. Спробуйте змінити параметри пошуку.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pois.map((poi) => (
                            <div
                                key={poi.id}
                                className="bg-white border border-[#e0d5c7] rounded-2xl p-4 flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setSelectedPOI(poi)}
                            >
                                <div className="w-full h-40 rounded-lg bg-gradient-to-br from-[#e5d7c5] to-[#f3ece3] mb-3" />

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-lg">{poi.name}</h3>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span>{poi.rating}</span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-[#7a6a5d] mb-2">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        {poi.location}
                                    </div>

                                    <p className="text-sm text-[#7a6a5d] mb-3 line-clamp-2">
                                        {poi.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="text-xs bg-[#f9f4ee] px-2 py-1 rounded">
                                            {poiService.getCategoryLabel(poi.category)}
                                        </span>
                                        {poi.duration && (
                                            <span className="text-xs bg-[#f9f4ee] px-2 py-1 rounded">
                                                <Clock className="w-3 h-3 inline mr-1" />
                                                {poi.duration}
                                            </span>
                                        )}
                                        {poi.ticketPrice !== undefined && (
                                            <span className="text-xs bg-[#f9f4ee] px-2 py-1 rounded">
                                                <DollarSign className="w-3 h-3 inline mr-1" />
                                                {poi.ticketPrice === 0
                                                    ? "Безкоштовно"
                                                    : `${poi.ticketPrice} ${poi.currency}`}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPOI(poi);
                                    }}
                                    className="w-full bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full"
                                >
                                    Детальніше
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* POI Detail Modal */}
                {selectedPOI && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedPOI(null)}
                    >
                        <div
                            className="bg-white rounded-2xl border border-[#d7c7b7] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-full h-64 rounded-lg bg-gradient-to-br from-[#e5d7c5] to-[#f3ece3] mb-4" />

                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-2xl font-bold">{selectedPOI.name}</h2>
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <span className="font-semibold">{selectedPOI.rating}</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-[#7a6a5d]">
                                    <MapPin className="w-5 h-5" />
                                    <span>{selectedPOI.address || selectedPOI.location}</span>
                                </div>

                                {selectedPOI.openingHours && (
                                    <div className="flex items-center gap-2 text-[#7a6a5d]">
                                        <Clock className="w-5 h-5" />
                                        <span>{selectedPOI.openingHours}</span>
                                    </div>
                                )}

                                {selectedPOI.ticketPrice !== undefined && (
                                    <div className="flex items-center gap-2 text-[#7a6a5d]">
                                        <DollarSign className="w-5 h-5" />
                                        <span>
                                            {selectedPOI.ticketPrice === 0
                                                ? "Безкоштовно"
                                                : `${selectedPOI.ticketPrice} ${selectedPOI.currency}`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <p className="text-[#4b2e23] mb-6">{selectedPOI.description}</p>

                            {(selectedPOI.website || selectedPOI.phone) && (
                                <div className="space-y-2 mb-6">
                                    {selectedPOI.website && (
                                        <a
                                            href={`https://${selectedPOI.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-sm text-[#5e3d2b] hover:underline"
                                        >
                                            🌐 {selectedPOI.website}
                                        </a>
                                    )}
                                    {selectedPOI.phone && (
                                        <a
                                            href={`tel:${selectedPOI.phone}`}
                                            className="block text-sm text-[#5e3d2b] hover:underline"
                                        >
                                            📞 {selectedPOI.phone}
                                        </a>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => {
                                        // Navigate to wizard to add to route
                                        navigate(`/wizard?addPOI=${selectedPOI.id}`);
                                    }}
                                    className="flex-1 bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full"
                                >
                                    Додати до маршруту
                                </Button>
                                <Button
                                    onClick={() => setSelectedPOI(null)}
                                    variant="outline"
                                    className="rounded-full border-[#c0a894]"
                                >
                                    Закрити
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


