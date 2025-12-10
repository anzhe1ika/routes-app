import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type Point = {
  id: string;
  name: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  notes: string;
};

export type Transport = {
  id: string;
  type: "train" | "bus" | "plane" | null;
  name: string;
  route: string;
  price: number;
  currency: string;
};

export type Accommodation = {
  id: string;
  hotelName: string;
  price: number;
  currency: string;
  checkIn: string;
  checkOut: string;
};

export type WizardState = {
  destination: string;
  dateRange: string;
  budget: number;

  points: Point[];

  transport: Transport | null;

  accommodation: Accommodation | null;
};

const defaultState: WizardState = {
  destination: "",
  dateRange: "",
  budget: 40,
  points: [],
  transport: null,
  accommodation: null,
};

type WizardContextType = {
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => void;
  resetState: () => void;
  addPoint: (point: Point) => void;
  removePoint: (id: string) => void;
  updatePoint: (id: string, updates: Partial<Point>) => void;
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(defaultState);

  const updateState = (updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(defaultState);
    localStorage.removeItem("wizard_draft");
  };

  const addPoint = (point: Point) => {
    setState((prev) => ({
      ...prev,
      points: [...prev.points, point],
    }));
  };

  const removePoint = (id: string) => {
    setState((prev) => ({
      ...prev,
      points: prev.points.filter((p) => p.id !== id),
    }));
  };

  const updatePoint = (id: string, updates: Partial<Point>) => {
    setState((prev) => ({
      ...prev,
      points: prev.points.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  };

  return (
    <WizardContext.Provider
      value={{
        state,
        updateState,
        resetState,
        addPoint,
        removePoint,
        updatePoint,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within WizardProvider");
  }
  return context;
}
