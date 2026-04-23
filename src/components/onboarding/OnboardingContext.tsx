import React, { createContext, useContext } from 'react';
import { useOnboarding } from './useOnboarding';

interface OnboardingCtxValue {
  reopen: () => void;
  isOpen: boolean;
  currentStep: number;
  step: ReturnType<typeof useOnboarding>['step'];
  total: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  prev: () => void;
  goTo: (i: number) => void;
  close: () => void;
}

export const OnboardingContext = createContext<OnboardingCtxValue>({
  reopen: () => {},
  isOpen: false,
  currentStep: 0,
  step: { id: '', title: '', description: '', emoji: '' },
  total: 0,
  isFirst: true,
  isLast: false,
  next: () => {},
  prev: () => {},
  goTo: () => {},
  close: () => {},
});

export const useOnboardingContext = () => useContext(OnboardingContext);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useOnboarding();

  return (
    <OnboardingContext.Provider
      value={{
        reopen: state.forceOpen,
        isOpen: state.isOpen,
        currentStep: state.currentStep,
        step: state.step,
        total: state.total,
        isFirst: state.isFirst,
        isLast: state.isLast,
        next: state.next,
        prev: state.prev,
        goTo: state.goTo,
        close: state.close,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
