// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "." });

const customJestConfig = {
  clearMocks: true,
  moduleDirectories: ["node_modules", "src"],
  globals: {
    "ts-jest": {
      tsConfigFile: "tsconfig.json",
      enableTsDiagnostics: true,
    },
  },
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "@/layouts/*": "<rootDir>/layouts/$1",
    "@/providers/*": "<rootDir>/providers/$1",
    "^@/utils/(.*)$": "<rootDir>/utils/$1",
  },
  testRegex: "(/__tests__/.*|(\\.|/)test)\\.[jt]sx?$",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  setupFilesAfterEnv: ["<rootDir>/utils/setupTests.ts"],
  modulePathIgnorePatterns: ["cypress"],
};

module.exports = createJestConfig(customJestConfig);
