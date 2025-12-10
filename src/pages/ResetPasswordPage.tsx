import { useState, FormEvent, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setError("Невірне посилання для скидання пароля");
        }
    }, [token]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Паролі не збігаються");
            return;
        }

        if (password.length < 6) {
            setError("Пароль повинен містити мінімум 6 символів");
            return;
        }

        if (!token) {
            setError("Невірне посилання для скидання пароля");
            return;
        }

        setLoading(true);

        try {
            await resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError("Помилка при скиданні пароля. Спробуйте ще раз.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#f3ece3] pt-20 px-4 flex justify-center items-center">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#d7c7b7] p-10 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-4 text-[#4b2e23]">
                        Пароль змінено!
                    </h1>
                    <p className="text-[#7a6a5d] mb-6">
                        Ваш пароль успішно змінено. Перенаправлення на сторінку входу...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3ece3] pt-20 px-4 flex justify-center items-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#d7c7b7] p-10">
                <h1 className="text-3xl font-bold mb-4 text-[#4b2e23] text-center">
                    Новий пароль
                </h1>
                <p className="text-[#7a6a5d] mb-6 text-center">
                    Введіть новий пароль для вашого облікового запису
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Новий пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-lg border-[#c0a894]"
                    />

                    <Input
                        placeholder="Підтвердити пароль"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="rounded-lg border-[#c0a894]"
                    />

                    <Button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full py-3 disabled:opacity-50"
                    >
                        {loading ? "Збереження..." : "Змінити пароль"}
                    </Button>
                </form>
            </div>
        </div>
    );
}


