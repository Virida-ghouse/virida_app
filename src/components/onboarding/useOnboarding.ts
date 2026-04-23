import { useState, useEffect } from 'react';
import { ONBOARDING_STEPS, STORAGE_KEY } from './onboardingSteps';

export const useOnboarding = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setIsOpen(true);
  }, []);

  const forceOpen = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentStep(0);
    setIsOpen(true);
  };

  const complete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const next = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      complete();
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const goTo = (index: number) => {
    if (index >= 0 && index < ONBOARDING_STEPS.length) setCurrentStep(index);
  };

  return {
    isOpen,
    currentStep,
    step: ONBOARDING_STEPS[currentStep],
    isFirst: currentStep === 0,
    isLast: currentStep === ONBOARDING_STEPS.length - 1,
    total: ONBOARDING_STEPS.length,
    next,
    prev,
    goTo,
    close: complete,
    forceOpen,
  };
};
