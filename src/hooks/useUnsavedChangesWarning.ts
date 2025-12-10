import { useEffect } from 'react';

export function useUnsavedChangesWarning(
  hasUnsavedChanges: boolean,
  message: string = 'У вас є незбережені зміни. Ви впевнені, що хочете вийти?'
) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);

  const confirmNavigation = (_to: string): boolean => {
    if (hasUnsavedChanges) {
      return window.confirm(message);
    }
    return true;
  };

  return { confirmNavigation };
}