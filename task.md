# Building Settings Page

## Theme Support Setup
- [x] Install next-themes package
- [x] Create ThemeProvider component
- [x] Update app/layout.tsx to wrap with ThemeProvider
- [x] Test theme switching (light/dark/system)

## Settings Data Model
- [x] Create user settings TypeScript interface
- [x] Define Firestore schema for user preferences
- [x] Create useSettings hook for Firestore operations

## Settings Page Layout
- [x] Create app/(dashboard)/settings/page.tsx
- [x] Single column layout (max-width: 800px, centered)
- [x] Three main cards structure

## Profile & Identity Card
- [x] Display user avatar with photoURL
- [x] Editable display name input
- [x] Disabled email field
- [x] Save Changes button with loading state
- [x] Firebase updateProfile integration
- [x] Toast notification on success

## App Preferences Card
- [x] Theme toggle with 3 options (Light/Dark/System)
- [x] Sun, Moon, Monitor icons
- [x] useTheme hook integration
- [x] Default Model dropdown selector
- [x] Default Tone slider
- [x] Save Preferences button
- [x] Firestore save integration

## Data & Privacy Card
- [x] Red border/background styling (danger zone)
- [x] Export Data button
- [x] Download personal data as JSON
- [x] Fetch history and templates collections
- [x] Delete Account button
- [x] Confirmation dialog
- [x] Delete user data from Firestore
- [x] Delete Firebase auth account

## Verification
- [ ] Test profile update
- [ ] Test theme switching
- [ ] Test preferences save
- [ ] Test data export
- [ ] Test account deletion flow

## AI Integration (Groq)
- [x] Install openai package
- [x] Configure Groq client in lib/groq.ts
- [x] Create generateRefinedPrompt server action
- [x] Integrate server action into usePromptWizard hook
- [x] Verify Llama 3.3 generation in browser

## Fix Build Errors
- [x] Fix unused variables in auth pages
- [x] Fix unescaped characters in history/templates
- [x] Fix dashboard useEffect dependency and hoisting
- [x] Fix marketing page types and imports
- [x] Fix API route types (any -> unknown)
- [x] Fix residual `any` types in auth pages (strict type guarding)
