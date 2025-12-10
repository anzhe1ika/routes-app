import { useEffect, useRef } from "react";

export function useAutoSave<T>(
  data: T,
  saveFunction: (data: T) => void,
  delay: number = 2000
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Пропускаємо перший рендер
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Якщо є попередній таймер — очищаємо
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Створюємо новий таймер
    timeoutRef.current = setTimeout(() => {
      saveFunction(data);
    }, delay);

    // Очищаємо таймер при розмонтуванні або зміні залежностей
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveFunction, delay]);
}
