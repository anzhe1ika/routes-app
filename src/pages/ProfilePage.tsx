import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input.tsx";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const { user, updateProfile, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        dateOfBirth: "",
        phone: "",
        email: "",
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                middleName: user.middleName || "",
                dateOfBirth: user.dateOfBirth || "",
                phone: user.phone || "",
                email: user.email || "",
            });
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-[#f3ece3] text-[#4b2e23] p-10">

            <h1 className="text-2xl font-bold mb-10">
                Профіль — {isEdit ? "редагування" : "перегляд"}
            </h1>

            <div className="grid grid-cols-[280px,1fr] gap-12 relative">

                <div className="flex flex-col">
                    <div className="w-72 h-72 rounded-full bg-gradient-to-br from-[#e5d7c5] to-[#f3ece3]" />

                    {isEdit && (
                        <Button
                            variant="outline"
                            className="rounded-full mt-4 border-[#c0a894]"
                        >
                            Змінити фото
                        </Button>
                    )}
                </div>

                <div>
                    <div className="font-semibold mb-2">Особисті дані</div>

                    <Input
                        value={formData.firstName}
                        onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                        }
                        readOnly={!isEdit}
                        placeholder="Ім'я"
                        className={`mb-3 rounded-lg ${!isEdit ? "bg-white" : ""}`}
                    />

                    <Input
                        value={formData.middleName}
                        onChange={(e) =>
                            setFormData({ ...formData, middleName: e.target.value })
                        }
                        readOnly={!isEdit}
                        placeholder="По батькові"
                        className={`mb-3 rounded-lg ${!isEdit ? "bg-white" : ""}`}
                    />

                    <Input
                        value={formData.lastName}
                        onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                        }
                        readOnly={!isEdit}
                        placeholder="Прізвище"
                        className={`mb-3 rounded-lg ${!isEdit ? "bg-white" : ""}`}
                    />

                        <Input
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                            setFormData({ ...formData, dateOfBirth: e.target.value })
                        }
                            readOnly={!isEdit}
                        type="date"
                        className={`mb-6 rounded-lg ${!isEdit ? "bg-white" : ""}`}
                        />

                    <div className="font-semibold mb-2">Контакти</div>

                    <Input
                        value={formData.phone}
                        onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                        }
                        readOnly={!isEdit}
                        placeholder="Телефон"
                        className={`mb-3 rounded-lg ${!isEdit ? "bg-white" : ""}`}
                    />

                    <Input
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        readOnly={!isEdit}
                        type="email"
                        placeholder="Email"
                        className={`mb-10 rounded-lg ${!isEdit ? "bg-white" : ""}`}
                    />

                    <div className="flex gap-4">

                        {!isEdit ? (
                            <>
                                <Button
                                    className="bg-[#5e3d2b] text-white rounded-full px-6"
                                    onClick={() => navigate("/routes")}
                                >
                                    Переглянути маршрути
                                </Button>

                                <Button
                                    variant="outline"
                                    className="rounded-full px-6 border-[#c0a894]"
                                    onClick={() => setIsEdit(true)}
                                >
                                    Редагувати профіль
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    className="bg-[#5e3d2b] text-white rounded-full px-6"
                                    disabled={loading}
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            await updateProfile(formData);
                                        setIsEdit(false);
                                        } catch (error) {
                                            alert("Помилка при збереженні профілю");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                >
                                    {loading ? "Збереження..." : "Зберегти зміни"}
                                </Button>

                                <Button
                                    variant="outline"
                                    className="rounded-full px-6 border-[#c0a894]"
                                    onClick={() => {
                                        setIsEdit(false);
                                        if (user) {
                                            setFormData({
                                                firstName: user.firstName || "",
                                                lastName: user.lastName || "",
                                                middleName: user.middleName || "",
                                                dateOfBirth: user.dateOfBirth || "",
                                                phone: user.phone || "",
                                                email: user.email || "",
                                            });
                                        }
                                    }}
                                >
                                    Скасувати
                                </Button>

                                <Button
                                    variant="outline"
                                    className="rounded-full px-6 border-[#c0a894] text-red-600"
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                "Ви впевнені, що хочете видалити профіль? Цю дію неможливо скасувати."
                                            )
                                        ) {
                                            logout();
                                            navigate("/");
                                        }
                                    }}
                                >
                                    Видалити профіль
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}