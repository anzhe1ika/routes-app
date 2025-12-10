import { useState, FormEvent } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const { requestPasswordReset } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await requestPasswordReset(email);
            setSent(true);
        } catch (err) {
            setError("Помилка при відправці листа. Спробуйте пізніше.");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen bg-[#f3ece3] pt-20 px-4 flex justify-center items-center">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#d7c7b7] p-10 text-center">
                    <Mail className="w-16 h-16 text-[#5e3d2b] mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-4 text-[#4b2e23]">
                        Перевірте пошту
                    </h1>
                    <p className="text-[#7a6a5d] mb-6">
                        Ми надіслали інструкції з відновлення пароля на адресу{" "}
                        <strong>{email}</strong>
                    </p>
                    <Link to="/login">
                        <Button className="w-full bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full py-3">
                            Повернутися до входу
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3ece3] pt-20 px-4 flex justify-center items-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#d7c7b7] p-10">
                <h1 className="text-3xl font-bold mb-4 text-[#4b2e23] text-center">
                    Відновлення пароля
                </h1>
                <p className="text-[#7a6a5d] mb-6 text-center">
                    Введіть email, який ви використовували при реєстрації
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-lg border-[#c0a894]"
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full py-3 disabled:opacity-50"
                    >
                        {loading ? "Відправка..." : "Відправити інструкції"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-[#7a6a5d]">
                    Згадали пароль?{" "}
                    <Link to="/login" className="text-[#5e3d2b] hover:underline">
                        Увійти
                    </Link>
                </div>
            </div>
        </div>
    );
}


