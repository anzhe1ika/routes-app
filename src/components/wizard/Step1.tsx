import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { useWizard } from "../../contexts/WizardContext";
import { useFormValidation } from "@/hooks/useFormValidation";

type Step1Props = {
    onNext: () => void;
    onHome: () => void;
};

export function Step1Basic({ onNext, onHome }: Step1Props) {
    const { state, updateState } = useWizard();
    
    const { values, errors, handleChange, handleBlur, validateAll } = 
        useFormValidation(
            {
                destination: state.destination,
                dateRange: state.dateRange,
                budget: state.budget,
            },
            {
                destination: (value) =>
                    !value || value.trim() === '' ? 'Будь ласка, вкажіть напрям' : null,
                dateRange: (value) =>
                    !value || value.trim() === '' ? 'Будь ласка, оберіть дати' : null,
            }
        );

    const handleNext = () => {
        if (validateAll()) {
            updateState(values);
            onNext();
        }
    };

    return (
        <div className="max-w-md">
            <div className="space-y-4 mb-6">
                <div>
                    <label 
                        htmlFor="destination"
                        className="block text-sm font-medium mb-1 text-[#4b2e23]"
                    >
                        Напрям <span className="text-red-600">*</span>
                    </label>
                    <Input
                        id="destination"
                        placeholder="Місто/країна або кілька"
                        value={values.destination}
                        onChange={(e) => handleChange('destination', e.target.value)}
                        onBlur={() => handleBlur('destination')}
                        aria-invalid={!!errors.destination}
                        aria-describedby={errors.destination ? 'destination-error' : undefined}
                        className={`rounded-lg border-[#c0a894] ${
                            errors.destination ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.destination && (
                        <p id="destination-error" className="text-sm text-red-600 mt-1">
                            {errors.destination}
                        </p>
                    )}
                </div>

                <div>
                    <label 
                        htmlFor="dateRange"
                        className="block text-sm font-medium mb-1 text-[#4b2e23]"
                    >
                        Діапазон дат <span className="text-red-600">*</span>
                    </label>
                    <Input
                        id="dateRange"
                        placeholder="напр. 12-15 травня"
                        value={values.dateRange}
                        onChange={(e) => handleChange('dateRange', e.target.value)}
                        onBlur={() => handleBlur('dateRange')}
                        aria-invalid={!!errors.dateRange}
                        aria-describedby={errors.dateRange ? 'dateRange-error' : undefined}
                        className={`rounded-lg border-[#c0a894] ${
                            errors.dateRange ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.dateRange && (
                        <p id="dateRange-error" className="text-sm text-red-600 mt-1">
                            {errors.dateRange}
                        </p>
                    )}
                </div>

                <div>
                    <label 
                        htmlFor="budget-range" 
                        className="block text-sm font-medium mb-2 text-[#4b2e23]"
                    >
                        Бюджет: {values.budget}%
                    </label>
                    <input
                        id="budget-range"
                        type="range"
                        min={0}
                        max={100}
                        value={values.budget}
                        onChange={(e) => handleChange('budget', Number(e.target.value))}
                        aria-label="Бюджет подорожі від 0 до 100 відсотків"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={values.budget}
                        className="w-full accent-[#5e3d2b]"
                    />
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full px-6"
                >
                    Далі →
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