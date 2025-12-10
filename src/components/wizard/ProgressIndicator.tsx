import { CheckCircle } from 'lucide-react';

type ProgressIndicatorProps = {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ id: number; title: string }>;
  onStepClick?: (step: number) => void;
};

export function ProgressIndicator({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
}: ProgressIndicatorProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-[#e5d7c5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#5e3d2b] transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isClickable = step.id <= currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  transition-all duration-200 mb-2
                  ${isActive ? 'bg-[#5e3d2b] text-white scale-110 shadow-lg' : ''}
                  ${isCompleted ? 'bg-[#c7a98d] text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-[#e5d7c5] text-[#4b2e23]' : ''}
                  ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}
                `}
                aria-label={`${step.title}${isCompleted ? ' (завершено)' : isActive ? ' (поточний)' : ''}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{step.id}</span>
                )}
              </button>
              
              <div className={`text-xs text-center max-w-[80px] ${
                isActive ? 'font-semibold text-[#5e3d2b]' : 'text-[#7a6a5d]'
              }`}>
                {step.title.replace('Крок ' + step.id + '. ', '')}
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-5 left-0 right-0 h-0.5 -z-10" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Current step info */}
      <div className="text-center">
        <p className="text-sm text-[#7a6a5d]">
          Крок {currentStep} з {totalSteps}
        </p>
      </div>
    </div>
  );
}