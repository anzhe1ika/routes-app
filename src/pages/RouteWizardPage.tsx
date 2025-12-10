import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { WizardProvider, useWizard } from "../contexts/WizardContext";
import type { WizardState, Point } from "../contexts/WizardContext";
import { poiService } from "../services/poiService";
import { useAuth } from "../contexts/AuthContext";

import { ProgressIndicator } from "../components/wizard/ProgressIndicator";
import { useAutoSave } from "../hooks/useAutoSave";
import { Step1Basic } from "../components/wizard/Step1";
import { Step2Points } from "../components/wizard/Step2";
import { Step3Transport } from "../components/wizard/Step3";
import { Step4Stay } from "../components/wizard/Step4";
import { Step5Overview } from "../components/wizard/Step5";
import { Step6Export } from "../components/wizard/Step6";

const steps = [
  { id: 1, title: "Крок 1. Базові дані" },
  { id: 2, title: "Крок 2. Точки маршруту" },
  { id: 3, title: "Крок 3. Транспорт" },
  { id: 4, title: "Крок 4. Проживання" },
  { id: 5, title: "Крок 5. Огляд та розклад" },
  { id: 6, title: "Крок 6. Експорт і спільний доступ" },
];

function WizardContent() {
  const [step, setStep] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, updateState, addPoint } = useWizard();
  const { isAuthenticated } = useAuth();

  // Перевірка авторизації
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

const saveToLocalStorage = (wizardState: WizardState) => {
  const normalizedState: WizardState = {
    destination: wizardState.destination ?? '',
    dateRange: wizardState.dateRange ?? '',
    budget: wizardState.budget ?? 40,
    points: wizardState.points ?? [],
    transport: wizardState.transport ?? null,
    accommodation: wizardState.accommodation ?? null,
  };

  localStorage.setItem('wizard_draft', JSON.stringify({
    state: normalizedState,
    step,
    timestamp: new Date().toISOString(),
  }));
};


  useAutoSave(state, saveToLocalStorage, 3000);

  // Відновлення збереженого прогресу тільки при першому завантаженні
  useEffect(() => {
    if (!isInitialized) {
    const saved = localStorage.getItem("wizard_draft");
    if (saved) {
      try {
        const { state: savedState, step: savedStep } = JSON.parse(saved);
          updateState(savedState);
          setStep(savedStep);
        } catch (error) {
          console.error("Помилка завантаження збереженого прогресу:", error);
        }
      }
      setIsInitialized(true);
    }
  }, [isInitialized, updateState]);

  // Обробка додавання POI з параметра URL
  useEffect(() => {
    const addPOIId = searchParams.get("addPOI");
    if (addPOIId && isInitialized) {
      // Очищаємо параметр з URL одразу, щоб уникнути повторного додавання
      navigate("/wizard", { replace: true });
      
      // Завантажуємо POI та додаємо як точку маршруту
      poiService.getPOIById(addPOIId).then((poi) => {
        if (poi) {
          // Парсимо час початку з openingHours
          const startTime = extractStartTime(poi.openingHours);
          const endTime = calculateEndTime(startTime, poi.duration || "2 години");
          
          // Створюємо точку маршруту з POI
          const newPoint: Point = {
            id: `poi-${Date.now()}`,
            name: poi.name,
            date: state.dateRange.split(" - ")[0] || new Date().toISOString().split("T")[0],
            timeStart: startTime,
            timeEnd: endTime,
            notes: poi.description || "",
          };
          addPoint(newPoint);
          // Переходимо на крок 2 (точки маршруту)
          setStep(2);
        }
      }).catch((error) => {
        console.error("Error loading POI:", error);
      });
    }
  }, [searchParams, isInitialized, addPoint, state.dateRange, navigate]);

  // Допоміжна функція для витягування часу початку з openingHours
  const extractStartTime = (openingHours?: string): string => {
    if (!openingHours) return "10:00";
    
    // Шукаємо патерн часу (HH:MM)
    const timeMatch = openingHours.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      return `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
    }
    
    // Якщо не знайдено, повертаємо дефолтний час
    return "10:00";
  };

  // Допоміжна функція для розрахунку часу закінчення
  const calculateEndTime = (startTime: string, duration: string): string => {
    // Витягуємо години з тривалості
    const hoursMatch = duration.match(/(\d+)\s*(год|hour)/i);
    const minutesMatch = duration.match(/(\d+)\s*(хв|min)/i);
    
    let totalMinutes = 0;
    if (hoursMatch) {
      totalMinutes += parseInt(hoursMatch[1]) * 60;
    }
    if (minutesMatch) {
      totalMinutes += parseInt(minutesMatch[1]);
    }
    
    // Якщо не знайдено, використовуємо 2 години за замовчуванням
    if (totalMinutes === 0) {
      totalMinutes = 120;
    }
    
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const totalStartMinutes = startHour * 60 + startMinute;
    const totalEndMinutes = totalStartMinutes + totalMinutes;
    
    const endHour = Math.floor(totalEndMinutes / 60) % 24;
    const endMinute = totalEndMinutes % 60;
    
    return `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
  };

  const next = () => {
    setStep((s) => Math.min(6, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prev = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    navigate("/");
  };

  const goMyRoutes = () => {
    navigate("/routes");
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep <= step) {
      setStep(targetStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinish = () => {
    // Очищуємо чернетку
    localStorage.removeItem("wizard_draft");
    navigate("/routes");
  };

  return (
    <div className="min-h-screen bg-[#f3ece3] text-[#4b2e23]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">
            Маршрутизатор — Майстер маршруту
          </h1>
        </div>

        <ProgressIndicator
          currentStep={step}
          totalSteps={6}
          steps={steps}
          onStepClick={handleStepClick}
        />

        {step === 1 && <Step1Basic onNext={next} onHome={goHome} />}
        {step === 2 && <Step2Points onNext={next} onPrev={prev} />}
        {step === 3 && <Step3Transport onNext={next} onPrev={prev} />}
        {step === 4 && <Step4Stay onNext={next} onPrev={prev} />}
        {step === 5 && <Step5Overview onNext={next} onPrev={prev} />}
        {step === 6 && (
          <Step6Export
            onPrev={prev}
            onHome={goHome}
            onMyRoutes={goMyRoutes}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}

export default function RouteWizardPage() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}
