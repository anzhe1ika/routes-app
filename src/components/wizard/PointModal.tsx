import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { Point } from "../../contexts/WizardContext";
import { X } from "lucide-react";

type PointModalProps = {
    point?: Point;
    onSave: (point: Point) => void;
    onClose: () => void;
};

export function PointModal({ point, onSave, onClose }: PointModalProps) {
    const [formData, setFormData] = useState<Point>({
        id: "",
        name: "",
        date: "",
        timeStart: "",
        timeEnd: "",
        notes: "",
    });

    useEffect(() => {
        if (point) {
            setFormData(point);
        }
    }, [point]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const pointToSave: Point = {
            ...formData,
            id: formData.id || crypto.randomUUID(),
        };

        onSave(pointToSave);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-[#d7c7b7] p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#4b2e23]">
                        {point ? "Редагувати точку" : "Додати точку"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#7a6a5d] hover:text-[#4b2e23]"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Назва місця <span className="text-red-600">*</span>
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="напр. Площа Ринок"
                            required
                            className="rounded-lg border-[#c0a894]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Дата <span className="text-red-600">*</span>
                        </label>
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({ ...formData, date: e.target.value })
                            }
                            required
                            className="rounded-lg border-[#c0a894]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Час початку <span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="time"
                                value={formData.timeStart}
                                onChange={(e) =>
                                    setFormData({ ...formData, timeStart: e.target.value })
                                }
                                required
                                className="rounded-lg border-[#c0a894]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Час завершення <span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="time"
                                value={formData.timeEnd}
                                onChange={(e) =>
                                    setFormData({ ...formData, timeEnd: e.target.value })
                                }
                                required
                                className="rounded-lg border-[#c0a894]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Нотатки</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                            }
                            placeholder="Додаткова інформація про відвідування"
                            rows={3}
                            className="w-full rounded-lg border border-[#c0a894] px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full"
                        >
                            {point ? "Зберегти зміни" : "Додати точку"}
                        </Button>
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="rounded-full border-[#c0a894]"
                        >
                            Скасувати
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}


