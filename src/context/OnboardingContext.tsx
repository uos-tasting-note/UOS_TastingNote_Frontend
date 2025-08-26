"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type FormData = {
  kakaoId: number;
  kakaoNickname: string;
  profileImageUrl?: string;
  nickname: string;
};

type OnboardingContextType = {
  form: FormData | null;
  setForm: (f: FormData) => void;
  file: File | null;
  setFile: (f: File | null) => void;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<FormData | null>(null);
  const [file, setFile] = useState<File | null>(null);

  return (
    <OnboardingContext.Provider value={{ form, setForm, file, setFile }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx)
    throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
