import { useState, useEffect } from "react";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { useWizard } from "../../contexts/WizardContext";
import { transportService, type Transport, type TransportType } from "../../services/transportService";
import { Train, Bus, Plane } from "lucide-react";

type StepNavBaseProps = {
    onNext?: () => void;
    onPrev?: () => void;
};

export function Step3Transport({ onNext, onPrev }: StepNavBaseProps) {
    const { state, updateState } = useWizard();
    const [transports, setTransports] = useState<Transport[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        from: "",
        to: "",
        date: "",
        passengers: 1,
        type: undefined as TransportType | undefined,
    });

    useEffect(() => {
        handleSearch();
    }, []);

    // Автоматичний пошук при зміні типу транспорту
    useEffect(() => {
        if (searchParams.from || searchParams.to) {
            handleSearch();
        }
    }, [searchParams.type]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const results = await transportService.searchTransport(searchParams);
            setTransports(results);
        } catch (error) {
            console.error("Error searching transport:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTransport = (transport: Transport) => {
        updateState({
            transport: {
                id: transport.id,
                type: transport.type,
                name: transport.name,
                route: transport.route,
                price: transport.price,
                currency: transport.currency,
        },
        });
    };

    const getTransportIcon = (type: TransportType) => {
        switch (type) {
            case "train":
                return <Train className="w-4 h-4" />;
            case "bus":
                return <Bus className="w-4 h-4" />;
            case "plane":
                return <Plane className="w-4 h-4" />;
        }
    };

    return (
        <div className="max-w-5xl space-y-6">
            {/* Search Form */}
            <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Input
                        placeholder="Від (місто)"
                        value={searchParams.from}
                        onChange={(e) =>
                            setSearchParams({ ...searchParams, from: e.target.value })
                        }
                    className="rounded-lg border-[#c0a894]"
                />
                <Input
                        placeholder="До (місто)"
                        value={searchParams.to}
                        onChange={(e) =>
                            setSearchParams({ ...searchParams, to: e.target.value })
                        }
                    className="rounded-lg border-[#c0a894]"
                />
                <Input
                        type="date"
                        placeholder="Дата"
                        value={searchParams.date}
                        onChange={(e) =>
                            setSearchParams({ ...searchParams, date: e.target.value })
                        }
                    className="rounded-lg border-[#c0a894]"
                />
                <Input
                        type="number"
                        placeholder="Пасажири"
                        value={searchParams.passengers}
                        onChange={(e) =>
                            setSearchParams({
                                ...searchParams,
                                passengers: Number(e.target.value),
                            })
                        }
                        min={1}
                    className="rounded-lg border-[#c0a894]"
                />
            </div>

                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full px-6"
                    >
                        {loading ? "Пошук..." : "Знайти"}
                </Button>
                    <Button
                        variant={searchParams.type === "train" ? "default" : "outline"}
                        onClick={() => {
                            const newType = searchParams.type === "train" ? undefined : "train";
                            setSearchParams({
                                ...searchParams,
                                type: newType,
                            });
                        }}
                        className={`rounded-full ${
                            searchParams.type === "train"
                                ? "bg-[#5e3d2b] text-white"
                                : "border-[#c0a894]"
                        }`}
                    >
                        <Train className="w-4 h-4 mr-2" />
                    Потяги
                </Button>
                    <Button
                        variant={searchParams.type === "bus" ? "default" : "outline"}
                        onClick={() => {
                            const newType = searchParams.type === "bus" ? undefined : "bus";
                            setSearchParams({
                                ...searchParams,
                                type: newType,
                            });
                        }}
                        className={`rounded-full ${
                            searchParams.type === "bus"
                                ? "bg-[#5e3d2b] text-white"
                                : "border-[#c0a894]"
                        }`}
                    >
                        <Bus className="w-4 h-4 mr-2" />
                    Автобуси
                </Button>
                    <Button
                        variant={searchParams.type === "plane" ? "default" : "outline"}
                        onClick={() => {
                            const newType = searchParams.type === "plane" ? undefined : "plane";
                            setSearchParams({
                                ...searchParams,
                                type: newType,
                            });
                        }}
                        className={`rounded-full ${
                            searchParams.type === "plane"
                                ? "bg-[#5e3d2b] text-white"
                                : "border-[#c0a894]"
                        }`}
                    >
                        <Plane className="w-4 h-4 mr-2" />
                    Літаки
                </Button>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="text-center py-8">Завантаження...</div>
            ) : transports.length === 0 ? (
                <div className="text-center py-8 text-[#7a6a5d]">
                    Транспорт не знайдено. Спробуйте змінити параметри пошуку.
                </div>
            ) : (
                <>
                    <div className="text-sm text-[#7a6a5d] mb-2">
                        Знайдено варіантів: {transports.length}
                    </div>
            <div className="space-y-3 mb-6">
                        {transports.map((t) => (
                    <div
                                key={t.id}
                                className={`flex items-center justify-between bg-white rounded-2xl border px-4 py-3 ${
                                    state.transport?.id === t.id
                                        ? "border-[#5e3d2b] bg-[#f9f4ee]"
                                        : "border-[#e0d5c7]"
                                }`}
                            >
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="mt-1">{getTransportIcon(t.type)}</div>
                                    <div className="flex-1">
                                        <div className="font-semibold">{t.name}</div>
                                        <div className="text-sm text-[#7a6a5d]">
                                            {t.route}
                                        </div>
                                        <div className="text-sm text-[#7a6a5d]">
                                            {t.departure} — {t.arrival} · {t.duration}
                                            {t.transfers > 0 && ` · ${t.transfers} пересадка`}
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {t.amenities.map((amenity) => (
                                                <span
                                                    key={amenity}
                                                    className="text-xs bg-[#f9f4ee] px-2 py-0.5 rounded"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                        </div>
                        <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="font-semibold text-lg">
                                            {t.price} {t.currency}
                                        </div>
                                        {t.carrier && (
                                            <div className="text-xs text-[#7a6a5d]">
                                                {t.carrier}
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => handleSelectTransport(t)}
                                        className={`rounded-full px-5 ${
                                            state.transport?.id === t.id
                                                ? "bg-green-700 hover:bg-green-800"
                                                : "bg-[#5e3d2b] hover:bg-[#4a2f21]"
                                        } text-white`}
                                    >
                                        {state.transport?.id === t.id ? "Обрано ✓" : "Обрати"}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
                </>
            )}

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