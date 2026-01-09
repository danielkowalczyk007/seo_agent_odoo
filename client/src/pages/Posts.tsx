import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

function ExportCSVButton({ postId }: { postId: number }) {
  const { data, isLoading } = trpc.socialMedia.exportToCSV.useQuery({ blogPostId: postId });

  const handleExport = () => {
    if (!data) return;

    const blob = new Blob([data.csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleExport}
      disabled={isLoading || !data}
    >
      <Download className="w-4 h-4 mr-2" />
      Export Social Media Posts
    </Button>
  );
}

export default function Posts() {
  const { data: posts, isLoading } = trpc.posts.list.useQuery();

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
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">All generated blog posts</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading posts...</div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.filter(post => post && post.id).map(post => (
              <Card key={`post-detail-${post.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                      <CardDescription>
                        {post.metaDescription || 'No meta description'}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={
                        post.status === 'published' ? 'default' : 
                        post.status === 'draft' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {post.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">AI Writer</div>
                      <div className="font-medium capitalize">{post.aiWriter}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Score</div>
                      <div className="font-medium">{post.totalScore}/100</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">SEO Score</div>
                      <div className="font-medium">{post.seoScore}/100</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Readability</div>
                      <div className="font-medium">{post.readabilityScore}/100</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Engagement Score</div>
                      <div className="font-medium">{post.engagementScore}/100</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Views</div>
                      <div className="font-medium">{post.views}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Created</div>
                      <div className="font-medium">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {post.publishedDate && (
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground">Published</div>
                      <div className="font-medium">
                        {new Date(post.publishedDate).toLocaleString()}
                      </div>
                    </div>
                  )}

                  {post.keywords && (
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-2">Keywords</div>
                      <div className="flex flex-wrap gap-2">
                        {(post.keywords ? JSON.parse(post.keywords) : []).map((keyword: string, idx: number) => (
                          <Badge key={`keyword-${post.id}-${idx}`} variant="outline">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {post.odooPostId && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View in Odoo (ID: {post.odooPostId})
                      </Button>
                    )}
                    <ExportCSVButton postId={post.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No posts yet. Trigger a publication to generate your first post.
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
