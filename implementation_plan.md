# Groq Integration Implementation Plan

## Goal
Integrate the Groq API (using Llama 3.3) to replace the current smart template engine for prompt generation. This will enable real AI generation with high speed and quality.

## User Review Required
- [ ] Confirm `GROQ_API_KEY` is available (I will assume I need to get it from the user or it's already set). user said "I will add this to .env later", but I should add the placeholder code.

## Proposed Changes

### 1. Dependencies
- **[NEW] Install `openai` package**: Groq uses the OpenAI SDK for compatibility.

### 2. Configuration (`lib/groq.ts`)
- **[NEW] Create Client**: Initialize OpenAI client with Groq base URL `https://api.groq.com/openai/v1`.

### 3. Server Action (`actions/generate-prompt.ts`)
- **[NEW] Create Action**: `generateRefinedPrompt`
    - Logic: Build meta-prompt -> Call Groq (`llama-3.3-70b-versatile`) -> Return refined text.
    - Error Handling: Try/Catch block returning success status.

### 4. Update Wizard (`app/(dashboard)/dashboard/page.tsx` or `hooks/usePromptWizard.tsx`)
- **[MODIFY] Logic Update**:
    - Replace the `/api/generate-prompt` fetch call with the `generateRefinedPrompt` server action.
    - Handle loading states and errors.
    - Trigger `savePrompt` (auto-save) on success.

## Verification Plan
### Manual Verification
### Manual Verification
- [x] Navigate to Dashboard/Wizard.
- [x] Fill in inputs (Objective, Persona, etc.).
- [x] Click "Generate".
- [x] Verify that `llama-3.3-70b-versatile` is called (via logs or speed).
- [x] Verify the output is displayed in the "Refined Prompt" box.
- [x] Verify the result is auto-saved to History.
- [x] **Automated Build Test**: `npm run build` passed successfully.
