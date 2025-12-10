import { useState, FormEvent } from "react";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (password !== confirmPassword) {
            setError("Паролі не збігаються");
            return;
        }

        if (password.length < 6) {
            setError("Пароль повинен містити мінімум 6 символів");
            return;
        }

        if (!firstName.trim() || !lastName.trim()) {
            setError("Будь ласка, вкажіть ім'я та прізвище");
            return;
        }

        setLoading(true);

        try {
            await register(email, password, firstName, lastName);
            navigate("/verify-email");
        } catch (err) {
            setError("Помилка реєстрації. Спробуйте ще раз.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3ece3] pt-20 px-4 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#d7c7b7] p-10 text-center">
                <h1 className="text-3xl font-bold mb-8 text-[#4b2e23]">Реєстрація</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        placeholder="Ім'я"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="rounded-lg border-[#c0a894]"
                    />

                    <Input
                        placeholder="Прізвище"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="rounded-lg border-[#c0a894]"
                    />

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
                        disabled={loading}
                        className="w-full bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full py-3 text-lg disabled:opacity-50"
                    >
                        {loading ? "Завантаження..." : "Зареєструватися"}
                    </Button>
                </form>

                <div className="my-6 text-sm text-[#7a6a5d]">
                    Вже маєте обліковий запис?{" "}
                    <Link to="/login" className="text-[#5e3d2b] hover:underline">
                        Увійти
                    </Link>
                </div>

                <div className="my-4 text-sm text-[#7a6a5d]">Або зареєструйтесь за допомогою</div>

                <div className="flex justify-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-[#c0a894] px-6"
                        onClick={() => alert("Google реєстрація буде реалізована")}
                    >
                        Google
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-[#c0a894] px-6"
                        onClick={() => alert("Apple реєстрація буде реалізована")}
                    >
                        Apple
                    </Button>
                </div>
            </div>
        </div>
    );
}