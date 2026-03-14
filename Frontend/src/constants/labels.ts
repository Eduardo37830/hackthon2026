export const labels = {
  loginTitle: "Login",
  username: "Username",
  password: "Password",
  submit: "Submit",
  appTitle: "Frontend",
  reactLogoAlt: "React logo",
  viteLogoAlt: "Vite logo",
  getStarted: "Get started",
  editInstructionPrefix: "Edit",
  editInstructionFile: "src/App.tsx",
  editInstructionMiddle: "and save to test",
  editInstructionSuffix: "HMR",
  countIsPrefix: "Count is",
  documentationTitle: "Documentation",
  documentationSubtitle: "Your questions, answered",
  exploreVite: "Explore Vite",
  learnMore: "Learn more",
  socialTitle: "Connect with us",
  socialSubtitle: "Join the Vite community",
  github: "GitHub",
  discord: "Discord",
  xCom: "X.com",
  bluesky: "Bluesky"
} as const

export type LabelKey = keyof typeof labels
