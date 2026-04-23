import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEY } from './onboardingSteps';

interface OnboardingContextValue {
  reopen: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue>({ reopen: () => {} });

export const useOnboardingContext = () => useContext(OnboardingContext);

interface Props {
  children: React.ReactNode;
  onOpen: () => void;
}

export const OnboardingProvider: React.FC<Props> = ({ children, onOpen }) => {
  const reopen = () => {
    localStorage.removeItem(STORAGE_KEY);
    onOpen();
  };

  return (
    <OnboardingContext.Provider value={{ reopen }}>
      {children}
    </OnboardingContext.Provider>
  );
};
