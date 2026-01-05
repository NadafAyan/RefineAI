import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export default function MarketingPage() {
    return (
        <div className="min-h-screen bg-slate-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Gradient Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-blue-900/20" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent" />

                <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                                {siteConfig.hero.title}
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            {siteConfig.hero.subtitle}
                        </p>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <Link href={siteConfig.hero.ctaLink}>
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105"
                                >
                                    {siteConfig.hero.cta}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Section Title */}
                        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
                            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                {siteConfig.howItWorks.title}
                            </span>
                        </h2>

                        {/* Tabs */}
                        <Tabs defaultValue="problem" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-800">
                                {siteConfig.howItWorks.tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {/* Tab Contents */}
                            {siteConfig.howItWorks.tabs.map((tab) => (
                                <TabsContent key={tab.id} value={tab.id} className="mt-8">
                                    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-3xl text-purple-300">
                                                {tab.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* For Problem and Solution tabs - show content as list */}
                                            {tab.content && (
                                                <ul className="space-y-4">
                                                    {tab.content.map((item, index) => (
                                                        <li key={index} className="flex items-start gap-3">
                                                            <span className="text-purple-400 text-xl mt-1">•</span>
                                                            <span className="text-slate-300 text-lg leading-relaxed">
                                                                {item}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {/* For Features tab - show as cards */}
                                            {tab.features && (
                                                <div className="grid gap-6 md:grid-cols-1">
                                                    {tab.features.map((feature, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-6 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                                                        >
                                                            <h4 className="text-xl font-semibold text-purple-300 mb-2">
                                                                {feature.name}
                                                            </h4>
                                                            <p className="text-slate-400 leading-relaxed">
                                                                {feature.description}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </section>

            {/* Footer Spacer */}
            <div className="h-20" />
        </div>
    );
}
