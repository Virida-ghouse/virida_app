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
