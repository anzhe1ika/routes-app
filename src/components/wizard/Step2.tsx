import { Button } from "../ui/button.tsx";
import { useWizard, type Point } from "../../contexts/WizardContext";
import { useState } from "react";
import { Trash2, Edit, GripVertical, Plus } from "lucide-react";
import { PointModal } from "./PointModal";

type StepNavBaseProps = {
    onNext?: () => void;
    onPrev?: () => void;
};

export function Step2Points({ onNext, onPrev }: StepNavBaseProps) {
    const { state, removePoint, addPoint, updatePoint, updateState } = useWizard();
    const [showModal, setShowModal] = useState(false);
    const [editingPoint, setEditingPoint] = useState<Point | undefined>(undefined);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleAddPoint = () => {
        setEditingPoint(undefined);
        setShowModal(true);
    };

    const handleEditPoint = (point: Point) => {
        setEditingPoint(point);
        setShowModal(true);
    };

    const handleSavePoint = (point: Point) => {
        if (editingPoint) {
            updatePoint(point.id, point);
        } else {
            addPoint(point);
        }
    };

    const handleRemovePoint = (id: string) => {
        if (window.confirm("Видалити цю точку?")) {
            removePoint(id);
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newPoints = [...state.points];
        const draggedItem = newPoints[draggedIndex];
        newPoints.splice(draggedIndex, 1);
        newPoints.splice(index, 0, draggedItem);

        updateState({ points: newPoints });
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Точки маршруту</h2>
                <p className="text-sm text-[#7a6a5d]">
                    Додайте місця, які хочете відвідати. Ви можете змінювати їх порядок,
                    перетягуючи за іконку.
                </p>
            </div>

            <Button
                type="button"
                onClick={handleAddPoint}
                className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full mb-4"
            >
                <Plus className="w-4 h-4 mr-2" />
                Додати точку
            </Button>

            <div className="space-y-3 mb-8">
                {state.points.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-[#e0d5c7]">
                        <div className="text-[#7a6a5d]">
                            <p className="font-medium">Ще немає доданих точок маршруту</p>
                        <p className="text-sm mt-2">
                                Натисніть "Додати точку" щоб почати планування
                        </p>
                        </div>
                    </div>
                ) : (
                    state.points.map((p, index) => (
                        <div
                            key={p.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-stretch bg-white rounded-2xl border border-[#e0d5c7] overflow-hidden transition-all ${
                                draggedIndex === index ? "opacity-50" : ""
                            }`}
                        >
                            <div className="px-3 py-4 cursor-move flex items-center bg-[#f9f4ee]">
                                <GripVertical className="w-5 h-5 text-[#7a6a5d]" />
                            </div>

                            <div className="flex-1 py-3 px-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-[#5e3d2b] text-white text-xs px-2 py-0.5 rounded-full">
                                                {index + 1}
                                            </span>
                                <div className="font-semibold">{p.name}</div>
                                        </div>
                                <div className="text-sm text-[#7a6a5d]">
                                            📅 {new Date(p.date).toLocaleDateString("uk-UA")} · 🕐{" "}
                                            {p.timeStart} — {p.timeEnd}
                                        </div>
                                        {p.notes && (
                                            <div className="text-sm text-[#7a6a5d] mt-1">
                                                📝 {p.notes}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleEditPoint(p)}
                                    className="rounded-full border-[#c0a894] text-sm px-3"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => handleRemovePoint(p.id)}
                                    variant="outline"
                                    className="rounded-full border-red-300 text-red-600 hover:bg-red-50 px-3"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex gap-4">
                <Button
                    type="button"
                    onClick={onNext}
                    disabled={state.points.length === 0}
                    className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Далі →
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={onPrev}
                    className="rounded-full border-[#c0a894]"
                >
                    Назад
                </Button>
            </div>

            {showModal && (
                <PointModal
                    point={editingPoint}
                    onSave={handleSavePoint}
                    onClose={() => {
                        setShowModal(false);
                        setEditingPoint(undefined);
                    }}
                />
            )}
        </div>
    );
}
