import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Configuration() {
  const { data: config, isLoading } = trpc.config.get.useQuery();
  const setConfigMutation = trpc.config.set.useMutation({
    onSuccess: () => {
      toast.success("Configuration saved successfully");
    },
    onError: (error) => {
      toast.error(`Failed to save configuration: ${error.message}`);
    },
  });

  const [formData, setFormData] = useState({
    odooUrl: '',
    odooApiKey: '',
    odooDatabase: '',
    odooBlogId: '',
    geminiApiKey: '',
    openaiApiKey: '',
    anthropicApiKey: '',
  });

  useEffect(() => {
    if (config) {
      setFormData({
        odooUrl: config.odooUrl || '',
        odooApiKey: config.odooApiKey || '',
        odooDatabase: config.odooDatabase || '',
        odooBlogId: config.odooBlogId || '',
        geminiApiKey: config.geminiApiKey || '',
        openaiApiKey: config.openaiApiKey || '',
        anthropicApiKey: config.anthropicApiKey || '',
      });
    }
  }, [config]);

  const handleSave = async () => {
    const keyMapping: Record<string, string> = {
      odooUrl: 'odoo_url',
      odooApiKey: 'odoo_api_key',
      odooDatabase: 'odoo_database',
      odooBlogId: 'odoo_blog_id',
      geminiApiKey: 'gemini_api_key',
      openaiApiKey: 'openai_api_key',
      anthropicApiKey: 'anthropic_api_key',
    };

    console.log('[Configuration] Saving formData:', formData);

    for (const [camelKey, value] of Object.entries(formData)) {
      // Save all fields, even empty ones (to allow clearing values)
      const snakeKey = keyMapping[camelKey] || camelKey;
      console.log(`[Configuration] Saving ${camelKey} -> ${snakeKey}: ${value ? 'has value' : 'empty'}`);
      try {
        await setConfigMutation.mutateAsync({ key: snakeKey, value: value || '' });
      } catch (error) {
        console.error(`[Configuration] Failed to save ${snakeKey}:`, error);
        throw error;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Configuration</h1>
            <p className="text-muted-foreground">Configure Odoo API and AI models</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Odoo Configuration</CardTitle>
              <CardDescription>
                Configure your Odoo instance connection and blog settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="odooUrl">Odoo URL</Label>
                <Input
                  id="odooUrl"
                  placeholder="https://powergo.pl"
                  value={formData.odooUrl}
                  onChange={(e) => setFormData({ ...formData, odooUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="odooApiKey">Odoo API Key</Label>
                <Input
                  id="odooApiKey"
                  type="password"
                  placeholder="Your Odoo REST API key"
                  value={formData.odooApiKey}
                  onChange={(e) => setFormData({ ...formData, odooApiKey: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="odooDatabase">Odoo Database</Label>
                <Input
                  id="odooDatabase"
                  placeholder="odoo"
                  value={formData.odooDatabase}
                  onChange={(e) => setFormData({ ...formData, odooDatabase: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="odooBlogId">Odoo Blog ID</Label>
                <Input
                  id="odooBlogId"
                  type="number"
                  placeholder="2"
                  value={formData.odooBlogId}
                  onChange={(e) => setFormData({ ...formData, odooBlogId: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Models Configuration</CardTitle>
              <CardDescription>
                Configure API keys for Gemini, ChatGPT, and Claude
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="geminiApiKey">Gemini API Key</Label>
                <Input
                  id="geminiApiKey"
                  type="password"
                  placeholder="Your Gemini API key"
                  value={formData.geminiApiKey}
                  onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                <Input
                  id="openaiApiKey"
                  type="password"
                  placeholder="Your OpenAI API key"
                  value={formData.openaiApiKey}
                  onChange={(e) => setFormData({ ...formData, openaiApiKey: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anthropicApiKey">Anthropic API Key</Label>
                <Input
                  id="anthropicApiKey"
                  type="password"
                  placeholder="Your Anthropic API key"
                  value={formData.anthropicApiKey}
                  onChange={(e) => setFormData({ ...formData, anthropicApiKey: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publication Schedule</CardTitle>
              <CardDescription>
                Automatic publication schedule (configured in system)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Monday</div>
                    <div className="text-sm text-muted-foreground">9:00 AM GMT+1</div>
                  </div>
                  <div className="text-sm text-green-600">Active</div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Thursday</div>
                    <div className="text-sm text-muted-foreground">9:00 AM GMT+1</div>
                  </div>
                  <div className="text-sm text-green-600">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button 
              onClick={handleSave}
              disabled={setConfigMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
