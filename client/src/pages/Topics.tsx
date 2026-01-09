import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Topics() {
  const { data: topics, isLoading } = trpc.topics.pending.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">SEO Topics</h1>
            <p className="text-muted-foreground">Pending topics for blog posts</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading topics...</div>
        ) : topics && topics.length > 0 ? (
          <div className="grid gap-6">
            {topics.filter(topic => topic && topic.id).map(topic => (
              <Card key={`topic-${topic.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{topic.topicName}</CardTitle>
                      <CardDescription>
                        SEO Difficulty: {topic.seoDifficulty}/100
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{topic.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {topic.keywords && (
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">Keywords</div>
                      <div className="flex flex-wrap gap-2">
                        {(topic.keywords ? JSON.parse(topic.keywords) : []).map((keyword: string, idx: number) => (
                          <Badge key={`topic-keyword-${topic.id}-${idx}`} variant="outline">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {topic.relatedProducts && (
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">Related Products</div>
                      <div className="flex flex-wrap gap-2">
                        {(topic.relatedProducts ? JSON.parse(topic.relatedProducts) : []).map((product: string, idx: number) => (
                          <Badge key={`topic-product-${topic.id}-${idx}`} variant="secondary">{product}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {topic.outline && (
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">Outline</div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(JSON.parse(topic.outline), null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div>
                      Created: {new Date(topic.createdAt).toLocaleDateString()}
                    </div>
                    {topic.usedAt && (
                      <div>
                        Used: {new Date(topic.usedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No pending topics. Topics are generated automatically before publication.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
