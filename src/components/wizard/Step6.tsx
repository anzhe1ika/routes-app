import { useState } from "react";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { useWizard } from "../../contexts/WizardContext";
import { useAuth } from "../../contexts/AuthContext";
import { routeService } from "../../services/routeService";
import { useNavigate } from "react-router-dom";
import { Check, Copy, Download, Share2 } from "lucide-react";

type Step6Props = {
    onPrev: () => void;
    onHome: () => void;
    onMyRoutes: () => void;
    onFinish?: () => void;
};

export function Step6Export({ onPrev, onHome, onMyRoutes, onFinish }: Step6Props) {
    const { state } = useWizard();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    const [routeTitle, setRouteTitle] = useState(`Маршрут до ${state.destination}`);
    const [shareLink, setShareLink] = useState("");
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [savedRouteId, setSavedRouteId] = useState<string | null>(null);
    
    const [pdfOptions, setPdfOptions] = useState({
        coverPhoto: true,
        map: true,
        notes: true,
        budget: true,
        qrCode: true,
    });

    const handleSave = async () => {
        if (!isAuthenticated || !user) {
            alert("Будь ласка, увійдіть в систему для збереження маршруту");
            navigate("/login");
            return;
        }

        setSaving(true);
        try {
            const savedRoute = await routeService.saveRoute(user.id, state, routeTitle);
            setSavedRouteId(savedRoute.id);
            alert("Маршрут успішно збережено!");
        
        if (onFinish) {
            onFinish();
            }
        } catch (error) {
            alert("Помилка при збереженні маршруту");
        } finally {
            setSaving(false);
        }
    };

    const handleExportPDF = async () => {
        if (!savedRouteId) {
            alert("Спочатку збережіть маршрут");
            return;
        }

        setExporting(true);
        try {
            const pdfBlob = await routeService.exportRouteToPDF(savedRouteId);
            
            // Create download link
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${routeTitle}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert("PDF успішно експортовано!");
        } catch (error) {
            alert("Помилка при експорті PDF");
        } finally {
            setExporting(false);
        }
    };

    const handleShare = async () => {
        if (!savedRouteId) {
            alert("Спочатку збережіть маршрут");
            return;
        }

        setSharing(true);
        try {
            const link = await routeService.shareRoute(savedRouteId);
            setShareLink(link);
        } catch (error) {
            alert("Помилка при створенні посилання");
        } finally {
            setSharing(false);
        }
    };

    const handleCopyLink = () => {
        if (shareLink) {
            navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-6xl space-y-6">
            {/* Route Title */}
            <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6">
                <label className="block text-sm font-medium mb-2">Назва маршруту</label>
                <Input
                    value={routeTitle}
                    onChange={(e) => setRouteTitle(e.target.value)}
                    placeholder="Введіть назву маршруту"
                    className="border-[#c0a894] rounded-lg"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2.2fr,2fr] gap-6">
                {/* PDF Options */}
                <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6">
                    <div className="font-semibold mb-4">Налаштування PDF</div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={pdfOptions.coverPhoto}
                                onChange={(e) =>
                                    setPdfOptions({
                                        ...pdfOptions,
                                        coverPhoto: e.target.checked,
                                    })
                                }
                                className="accent-[#5e3d2b] w-4 h-4"
                            />
                            <span>Обкладинка з фото</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={pdfOptions.map}
                                onChange={(e) =>
                                    setPdfOptions({ ...pdfOptions, map: e.target.checked })
                                }
                                className="accent-[#5e3d2b] w-4 h-4"
                            />
                            <span>Мапа з точками</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={pdfOptions.notes}
                                onChange={(e) =>
                                    setPdfOptions({ ...pdfOptions, notes: e.target.checked })
                                }
                                className="accent-[#5e3d2b] w-4 h-4"
                            />
                            <span>Нотатки до місць</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={pdfOptions.budget}
                                onChange={(e) =>
                                    setPdfOptions({
                                        ...pdfOptions,
                                        budget: e.target.checked,
                                    })
                                }
                                className="accent-[#5e3d2b] w-4 h-4"
                            />
                            <span>Орієнтовний бюджет</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                checked={pdfOptions.qrCode}
                                onChange={(e) =>
                                    setPdfOptions({
                                        ...pdfOptions,
                                        qrCode: e.target.checked,
                                    })
                                }
                                    className="accent-[#5e3d2b] w-4 h-4"
                                />
                            <span>QR-код посилання</span>
                            </label>
                    </div>
                </div>

                {/* Sharing */}
                <div className="bg-white rounded-2xl border border-[#e0d5c7] p-6 flex flex-col gap-4">
                    <div className="font-semibold">Спільний доступ</div>
                    
                    {shareLink ? (
                        <>
                    <Input
                                value={shareLink}
                                readOnly
                        className="border-[#c0a894]"
                    />
                    <div className="flex gap-3">
                        <Button 
                            type="button"
                                    onClick={handleCopyLink}
                                    className="flex-1 bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full"
                        >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Скопійовано
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Копіювати
                                        </>
                                    )}
                        </Button>
                            </div>
                        </>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleShare}
                            disabled={sharing || !savedRouteId}
                            className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            {sharing
                                ? "Створення..."
                                : savedRouteId
                                ? "Створити посилання"
                                : "Спочатку збережіть маршрут"}
                        </Button>
                    )}

                    {shareLink && (
                    <div className="mt-2 flex items-center gap-4">
                        <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-[#e5d7c5] to-[#f3ece3] flex items-center justify-center">
                            <span className="text-4xl">📱</span>
                        </div>
                        <div className="text-xs text-[#7a6a5d]">
                                QR-код для швидкого доступу
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary */}
            <div className="bg-[#f9f4ee] border border-[#e0d5c7] rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Підсумок маршруту</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <div className="text-[#7a6a5d]">Напрям</div>
                        <div className="font-medium">{state.destination || "—"}</div>
                    </div>
                    <div>
                        <div className="text-[#7a6a5d]">Дати</div>
                        <div className="font-medium">{state.dateRange || "—"}</div>
                    </div>
                    <div>
                        <div className="text-[#7a6a5d]">Точок маршруту</div>
                        <div className="font-medium">{state.points.length}</div>
                    </div>
                    <div>
                        <div className="text-[#7a6a5d]">Транспорт</div>
                        <div className="font-medium">
                            {state.transport ? state.transport.name : "—"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
                <Button 
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-700 hover:bg-green-800 text-white rounded-full px-6"
                >
                    {saving ? "Збереження..." : savedRouteId ? "Оновити маршрут" : "Зберегти маршрут"}
                </Button>
                
                <Button
                    type="button"
                    onClick={handleExportPDF}
                    disabled={exporting || !savedRouteId}
                    className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full px-6"
                >
                    <Download className="w-4 h-4 mr-2" />
                    {exporting ? "Експорт..." : "Експортувати PDF"}
                </Button>
                
                <Button
                    type="button"
                    variant="outline"
                    onClick={onMyRoutes}
                    className="rounded-full border-[#c0a894]"
                >
                    Мої маршрути
                </Button>
                
                <Button
                    type="button"
                    variant="outline"
                    onClick={onPrev}
                    className="rounded-full border-[#c0a894]"
                >
                    Назад
                </Button>
                
                <Button
                    type="button"
                    variant="outline"
                    onClick={onHome}
                    className="rounded-full border-[#c0a894]"
                >
                    Головне меню
                </Button>
            </div>
        </div>
    );
}