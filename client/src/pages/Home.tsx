import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Calendar, FileText, Settings, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">SEO Agent for Odoo</CardTitle>
            <CardDescription>
              Automated AI-powered blogging system integrated with Odoo CMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Sign In to Continue</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">SEO Agent for Odoo Blog</h1>
          <p className="text-lg text-muted-foreground">
            Automated content generation and publication powered by AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Bot className="w-10 h-10 mb-2 text-blue-600" />
              <CardTitle>AI Writers</CardTitle>
              <CardDescription>
                Three AI models (Gemini, ChatGPT, Claude) generate content in parallel
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="w-10 h-10 mb-2 text-green-600" />
              <CardTitle>SEO Optimization</CardTitle>
              <CardDescription>
                Automatic scoring and optimization based on SEO, readability, and engagement
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="w-10 h-10 mb-2 text-purple-600" />
              <CardTitle>Scheduled Publishing</CardTitle>
              <CardDescription>
                Publishes automatically twice a week (Monday & Thursday at 9:00 AM)
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/configuration">
              <Settings className="w-4 h-4 mr-2" />
              Configuration
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
