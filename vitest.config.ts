import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: [
        "src/services/api/**/*.ts",
        "src/store/**/*.ts",
        "src/hooks/useSensorData.ts",
        "src/contexts/AuthContext.tsx",
        "src/contexts/ChatHistoryContext.tsx",
        "src/contexts/ThemeContext.tsx",
        "src/contexts/RGPDContext.tsx",
        "src/components/legal/MentionsLegales.tsx",
        "src/components/legal/PolitiqueConfidentialite.tsx",
        "src/components/layout/BottomNav.tsx",
        "src/components/layout/Header.tsx",
        "src/components/layout/Sidebar.tsx",
        "src/components/landing/LandingHeader.tsx",
        "src/components/landing/LandingFooter.tsx",
        "src/components/landing/LandingPage.tsx",
        "src/components/landing/sections/CTASection.tsx",
        "src/components/landing/sections/AboutSection.tsx",
        "src/components/landing/sections/PricingSection.tsx",
        "src/components/auth/AuthContainer.tsx",
        "src/components/ui/GlassCard.tsx",
        "src/components/ui/StatCard.tsx",
      ],
      exclude: ["**/*.d.ts"],
      thresholds: {
        lines: 90,
        statements: 90,
        functions: 90,
        branches: 70,
      },
    },
  },
});
