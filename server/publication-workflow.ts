/**
 * Publication Workflow
 * Handles article approval and social media post generation
 */

import { generateSocialMediaPosts, BlogArticle } from './social-media-generator';
import { createOdooClient } from './odoo-client';
import { 
  updateBlogPost, 
  createPublicationLog, 
  getConfig,
  getBlogPostById 
} from './db';
import { getDb } from './db';
import { socialMediaPosts } from '../drizzle/schema';
import { notifyOwner } from './_core/notification';

/**
 * Approve article and trigger social media post generation
 */
export async function approveArticle(postId: number): Promise<void> {
  console.log(`[Workflow] Approving article ${postId}...`);
  
  try {
    // Update approval status
    await updateBlogPost(postId, {
      approvalStatus: 'approved',
    });
    
    // Get article details
    const post = await getBlogPostById(postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }
    
    // Generate social media posts
    console.log(`[Workflow] Generating social media posts for article ${postId}...`);
    const article: BlogArticle = {
      title: post.title,
      metaDescription: post.metaDescription || '',
      keywords: JSON.parse(post.keywords || '[]'),
      url: `https://powergo.pl/blog/${post.odooPostId}`,
    };
    
    const socialPosts = await generateSocialMediaPosts(article);
    console.log(`[Workflow] Generated ${socialPosts.length} social media posts`);
    
    // Save social media posts to database
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }
    
    for (const socialPost of socialPosts) {
      await db.insert(socialMediaPosts).values({
        blogPostId: postId,
        platform: socialPost.platform,
        content: socialPost.content,
        hashtags: JSON.stringify(socialPost.hashtags),
        status: 'draft',
      });
    }
    
    console.log(`[Workflow] Article ${postId} approved and social media posts generated`);
    
    // Notify owner
    await notifyOwner({
      title: 'Artykuł zatwierdzony',
      content: `Artykuł "${post.title}" został zatwierdzony. Wygenerowano ${socialPosts.length} postów social media.`,
    });
    
  } catch (error) {
    console.error(`[Workflow] Failed to approve article ${postId}:`, error);
    throw error;
  }
}

/**
 * Reject article
 */
export async function rejectArticle(postId: number, reason?: string): Promise<void> {
  console.log(`[Workflow] Rejecting article ${postId}...`);
  
  try {
    await updateBlogPost(postId, {
      approvalStatus: 'rejected',
    });
    
    // Get article details for notification
    const post = await getBlogPostById(postId);
    
    // Notify owner
    await notifyOwner({
      title: 'Artykuł odrzucony',
      content: `Artykuł "${post?.title}" został odrzucony. ${reason ? `Powód: ${reason}` : ''}`,
    });
    
    console.log(`[Workflow] Article ${postId} rejected`);
  } catch (error) {
    console.error(`[Workflow] Failed to reject article ${postId}:`, error);
    throw error;
  }
}

/**
 * Publish approved article to Odoo and social media
 */
export async function publishApprovedArticle(postId: number): Promise<void> {
  console.log(`[Workflow] Publishing approved article ${postId}...`);
  
  try {
    // Get article details
    const post = await getBlogPostById(postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }
    
    // Check if approved
    if (post.approvalStatus !== 'approved') {
      throw new Error(`Post ${postId} is not approved (status: ${post.approvalStatus})`);
    }
    
    // Get Odoo config
    const odooUrlConfig = await getConfig('odoo_url');
    const odooDatabaseConfig = await getConfig('odoo_database');
    const odooUsernameConfig = await getConfig('odoo_username');
    const odooPasswordConfig = await getConfig('odoo_password');
    const odooBlogIdConfig = await getConfig('odoo_blog_id');
    
    if (!odooUrlConfig || !odooDatabaseConfig || !odooUsernameConfig || !odooPasswordConfig || !odooBlogIdConfig) {
      throw new Error('Odoo configuration not found');
    }
    
    // Publish to Odoo
    console.log(`[Workflow] Publishing to Odoo blog...`);
    const odooClient = await createOdooClient(
      odooUrlConfig.value,
      odooDatabaseConfig.value,
      odooUsernameConfig.value,
      odooPasswordConfig.value
    );
    const odooPostId = await odooClient.createBlogPost({
      name: post.title,
      content: post.content,
      blog_id: parseInt(odooBlogIdConfig.value),
      meta_description: post.metaDescription || undefined,
      is_published: true,
    });
    
    // Update post with Odoo ID
    await updateBlogPost(postId, {
      odooPostId,
      status: 'published',
      publishedDate: new Date(),
    });
    
    // Log publication
    await createPublicationLog({
      postId,
      status: 'success',
      errorMessage: `Published to Odoo (ID: ${odooPostId})`,
    });
    
    console.log(`[Workflow] Article ${postId} published successfully (Odoo ID: ${odooPostId})`);
    
    // Notify owner
    await notifyOwner({
      title: 'Artykuł opublikowany',
      content: `Artykuł "${post.title}" został opublikowany na blogu powergo.pl (Odoo ID: ${odooPostId}).`,
    });
    
    // TODO: Publish social media posts to Odoo Social Media module
    // This requires Odoo Social Media API integration (Etap 2)
    
  } catch (error) {
    console.error(`[Workflow] Failed to publish article ${postId}:`, error);
    
    // Log failure
    await createPublicationLog({
      postId,
      status: 'failed',
      errorMessage: `Failed to publish: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
    
    throw error;
  }
}

/**
 * Run publication cycle for specific category
 */
export async function runPublicationForCategory(category: 'kompensacja' | 'svg'): Promise<void> {
  console.log(`[Workflow] Running publication for category: ${category}`);
  
  // Get pending topics for this category
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }
  
  const { topics } = await import('../drizzle/schema');
  const { eq, and } = await import('drizzle-orm');
  
  const pendingTopics = await db
    .select()
    .from(topics)
    .where(
      and(
        eq(topics.status, 'pending'),
        eq(topics.category, category)
      )
    )
    .limit(1);
  
  if (pendingTopics.length === 0) {
    console.log(`[Workflow] No pending topics found for category: ${category}`);
    return;
  }
  
  const topic = pendingTopics[0];
  console.log(`[Workflow] Selected topic: "${topic.topicName}" (category: ${category})`);
  
  // Continue with article generation...
  // (This will be integrated with existing scheduler logic)
}
