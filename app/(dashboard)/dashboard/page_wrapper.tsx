"use client";

import { Suspense } from "react";

function DashboardPageContent() {
    // Import the actual dashboard content here
    // This will be filled with the wizard implementation
    return <div>Loading...</div>;
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
            <div className="text-slate-400">Loading wizard...</div>
        </div>}>
            <DashboardPageContent />
        </Suspense>
    );
}
