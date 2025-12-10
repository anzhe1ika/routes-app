import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const { user, resendVerificationEmail, verifyEmail } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already verified
        if (user?.emailVerified) {
            navigate("/");
        }

        // Check for verification token in URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        
        if (token) {
            handleVerification(token);
        }
    }, [user, navigate]);

    const handleVerification = async (token: string) => {
        setLoading(true);
        setError("");

        try {
            await verifyEmail(token);
            setVerified(true);
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            setError("Невірний або прострочений токен верифікації");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError("");

        try {
            await resendVerificationEmail();
            alert("Лист з підтвердженням надіслано на вашу пошту");
        } catch (err) {
            setError("Помилка при відправці листа. Спробуйте пізніше.");
        } finally {
            setLoading(false);
        }
    };

    if (verified) {
        return (
            <div className="min-h-screen bg-[#f3ece3] pt-20 px-4 flex justify-center items-center">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#d7c7b7] p-10 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-4 text-[#4b2e23]">
                        Email підтверджено!
                    </h1>
                    <p className="text-[#7a6a5d] mb-6">
                        Ваш обліковий запис успішно активовано. Перенаправлення...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3ece3] pt-20 px-4 flex justify-center items-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#d7c7b7] p-10 text-center">
                <Mail className="w-16 h-16 text-[#5e3d2b] mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-4 text-[#4b2e23]">
                    Підтвердіть email
                </h1>
                <p className="text-[#7a6a5d] mb-6">
                    Ми надіслали лист з підтвердженням на адресу{" "}
                    <strong>{user?.email}</strong>. Будь ласка, перевірте свою пошту та
                    натисніть на посилання для активації облікового запису.
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <Button
                    onClick={handleResend}
                    disabled={loading}
                    className="w-full bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full py-3 mb-4 disabled:opacity-50"
                >
                    {loading ? "Відправка..." : "Надіслати лист повторно"}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="w-full rounded-full border-[#c0a894]"
                >
                    Повернутися на головну
                </Button>

                <p className="text-xs text-[#7a6a5d] mt-6">
                    Не отримали лист? Перевірте папку "Спам" або спробуйте надіслати
                    повторно.
                </p>
            </div>
        </div>
    );
}


