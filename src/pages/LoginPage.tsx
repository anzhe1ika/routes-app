import { useState, FormEvent } from "react";
import { Input } from "../components/ui/input.tsx";
import { Button } from "../components/ui/button.tsx";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError("Невірний email або пароль");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3ece3] pt-20 px-4 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#d7c7b7] p-10 text-center">
                <h1 className="text-3xl font-bold mb-8 text-[#4b2e23]">Вхід</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-lg border-[#c0a894]"
                    />
                    <Input
                        placeholder="Пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-lg border-[#c0a894]"
                    />

                    <div className="text-right">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-[#5e3d2b] hover:underline"
                        >
                            Забули пароль?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full py-3 text-lg disabled:opacity-50"
                    >
                        {loading ? "Завантаження..." : "Продовжити"}
                    </Button>
                </form>

                <div className="my-6 text-sm text-[#7a6a5d]">
                    Немає облікового запису?{" "}
                    <Link to="/register" className="text-[#5e3d2b] hover:underline">
                        Зареєструватися
                    </Link>
                </div>

                <div className="my-6 text-sm text-[#7a6a5d]">Або увійдіть за допомогою</div>

                <div className="flex justify-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-[#c0a894] px-6"
                        onClick={() => alert("Google авторизація буде реалізована")}
                    >
                        Google
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-[#c0a894] px-6"
                        onClick={() => alert("Apple авторизація буде реалізована")}
                    >
                        Apple
                    </Button>
                </div>
            </div>
        </div>
    );
}