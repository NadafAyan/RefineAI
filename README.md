# ✨ RefineAI

**RefineAI** is a smart, branching wizard designed to help you craft the perfect AI prompts. By guiding you through a structured workflow—defining intent, capturing raw thoughts, and selecting a persona—RefineAI leverages state-of-the-art LLMs (Llama 3.3 via Groq) to transform vague ideas into precise, high-quality prompts.

![RefineAI Demo](/docs/demo.png)

## 🚀 Key Features

- **🧙‍♂️ Branching Prompt Wizard**: A step-by-step interface that adapts to your goals (Coding, Writing, Analysis, etc.).
- **⚡ Powered by Groq**: Utilizes `llama-3.3-70b-versatile` for lightning-fast, high-intelligence prompt refinement.
- **🎭 Persona Management**: Select from built-in AI personas or create custom ones to tailor the voice and expertise of your output.
- **💾 History & Templates**: Automatically save your generated prompts and create reusable templates for recurring tasks.
- **🎨 Modern UI/UX**: Built with a sleek, dark-mode-first aesthetic using Tailwind CSS, Framer Motion animations, and shadcn/ui components.
- **🔐 Secure Authentication**: Integrated Firebase Authentication (Google & Email) for user profiles and data syncing.
- **⚙️ Customizable Settings**: Configure default models, tone, and themes to match your workflow.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Backend/Auth**: [Firebase](https://firebase.google.com/) (Auth & Firestore)
- **AI Inference**: [Groq API](https://groq.com/) (Llama 3.3)

## 🏁 Getting Started

Follow these steps to set up RefineAI locally.

### Prerequisites

- Node.js 18+ installed
- A Firebase project (for Auth & Firestore)
- A Groq API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/NadafAyan/RefineAI.git
    cd RefineAI
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your keys:

    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    
    # Groq API Key
    GROQ_API_KEY=gsk_your_groq_api_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## 📱 Usage

1.  **Sign In**: Log in using Google or Email to sync your data.
2.  **Start the Wizard**: Click "New Prompt" to begin the 4-step process.
3.  **Define Intent**: Choose what you want to do (e.g., "Code Assistant").
4.  **Brain Dump**: Type your raw ideas roughly—no need for perfect grammar.
5.  **Refine**: Let the AI generate a structured, optimized prompt for you.
6.  **Use**: Copy the result to your clipboard or save it as a template.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Ayan Nadaf](https://github.com/NadafAyan)
