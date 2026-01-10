/**
 * Odoo XML-RPC Client
 * Handles communication with Odoo CMS for blog post management using XML-RPC protocol
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const xmlrpc = require('xmlrpc');

export interface OdooProduct {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price?: number;
}

export interface OdooCategory {
  id: number;
  name: string;
  description?: string;
}

export interface OdooBlogPost {
  id?: number;
  name: string; // title
  content: string; // HTML content
  blog_id: number;
  tag_ids?: number[];
  meta_description?: string;
  is_published?: boolean;
}

export class OdooClient {
  private commonClient: any;
  private objectClient: any;
  private baseUrl: string;
  private database: string;
  private username: string;
  private password: string;
  private uid: number | null = null;

  constructor(baseUrl: string, database: string, username: string, password: string) {
    this.baseUrl = baseUrl;
    this.database = database;
    this.username = username;
    this.password = password;

    // Parse URL to get host and port
    const url = new URL(baseUrl);
    const host = url.hostname;
    const port = url.port ? parseInt(url.port) : (url.protocol === 'https:' ? 443 : 80);
    const path = '/xmlrpc/2';
    const secure = url.protocol === 'https:';

    // Create XML-RPC clients
    const clientOptions = {
      host,
      port,
      path: `${path}/common`,
    };
    
    const objectOptions = {
      host,
      port,
      path: `${path}/object`,
    };

    if (secure) {
      this.commonClient = xmlrpc.createSecureClient(clientOptions);
      this.objectClient = xmlrpc.createSecureClient(objectOptions);
    } else {
      this.commonClient = xmlrpc.createClient(clientOptions);
      this.objectClient = xmlrpc.createClient(objectOptions);
    }
  }

  /**
   * Authenticate with Odoo and get user ID
   */
  private async authenticate(): Promise<number> {
    if (this.uid !== null) {
      return this.uid;
    }

    return new Promise((resolve, reject) => {
      this.commonClient.methodCall('authenticate', [
        this.database,
        this.username,
        this.password,
        {}
      ], (error: any, uid: any) => {
        if (error) {
          console.error('[OdooClient] Authentication failed:', error);
          reject(error);
        } else if (!uid) {
          reject(new Error('Authentication failed: Invalid credentials'));
        } else {
          this.uid = uid;
          console.log('[OdooClient] Authenticated successfully, UID:', uid);
          resolve(uid);
        }
      });
    });
  }

  /**
   * Execute a method on an Odoo model
   */
  private async execute_kw(
    model: string,
    method: string,
    args: any[] = [],
    kwargs: any = {}
  ): Promise<any> {
    const uid = await this.authenticate();

    return new Promise((resolve, reject) => {
      this.objectClient.methodCall('execute_kw', [
        this.database,
        uid,
        this.password,
        model,
        method,
        args,
        kwargs
      ], (error: any, result: any) => {
        if (error) {
          console.error(`[OdooClient] ${model}.${method} failed:`, error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Test connection to Odoo API
   */
  async testConnection(): Promise<boolean> {
    try {
      const uid = await this.authenticate();
      return uid > 0;
    } catch (error) {
      console.error('[OdooClient] Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get products from Odoo
   */
  async getProducts(limit: number = 50): Promise<OdooProduct[]> {
    try {
      const products = await this.execute_kw(
        'product.template',
        'search_read',
        [[]],
        {
          fields: ['id', 'name', 'description', 'categ_id', 'list_price'],
          limit
        }
      );

      return products.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        category: Array.isArray(item.categ_id) ? item.categ_id[1] : '',
        price: item.list_price || 0,
      }));
    } catch (error) {
      console.error('[OdooClient] Failed to fetch products:', error);
      return [];
    }
  }

  /**
   * Get categories from Odoo
   */
  async getCategories(): Promise<OdooCategory[]> {
    try {
      const categories = await this.execute_kw(
        'product.category',
        'search_read',
        [[]],
        {
          fields: ['id', 'name', 'complete_name']
        }
      );

      return categories.map((item: any) => ({
        id: item.id,
        name: item.complete_name || item.name,
        description: '',
      }));
    } catch (error) {
      console.error('[OdooClient] Failed to fetch categories:', error);
      return [];
    }
  }

  /**
   * Create a new blog post in Odoo
   */
  async createBlogPost(post: OdooBlogPost): Promise<number | null> {
    try {
      console.log('[OdooClient] Creating blog post:', post.name);
      
      const postData: any = {
        name: post.name,
        content: post.content,
        blog_id: post.blog_id,
        // meta_description doesn't exist in Odoo 16
        // Use website_meta_description or seo_name instead if needed
      };

      // Add tag_ids if provided
      if (post.tag_ids && post.tag_ids.length > 0) {
        postData.tag_ids = [[6, 0, post.tag_ids]]; // Odoo many2many format: [(6, 0, [ids])]
      }

      // Set published state
      if (post.is_published) {
        postData.is_published = true;
      }

      const postId = await this.execute_kw(
        'blog.post',
        'create',
        [postData]
      );

      console.log('[OdooClient] Blog post created with ID:', postId);
      return postId;
    } catch (error) {
      console.error('[OdooClient] Failed to create blog post:', error);
      return null;
    }
  }

  /**
   * Update an existing blog post in Odoo
   */
  async updateBlogPost(postId: number, updates: Partial<OdooBlogPost>): Promise<boolean> {
    try {
      const updateData: any = {};

      if (updates.name) updateData.name = updates.name;
      if (updates.content) updateData.content = updates.content;
      if (updates.blog_id) updateData.blog_id = updates.blog_id;
      // meta_description doesn't exist in Odoo 16
      // if (updates.meta_description) updateData.meta_description = updates.meta_description;
      if (updates.tag_ids) updateData.tag_ids = [[6, 0, updates.tag_ids]];
      if (updates.is_published !== undefined) updateData.is_published = updates.is_published;

      await this.execute_kw(
        'blog.post',
        'write',
        [[postId], updateData]
      );

      console.log('[OdooClient] Blog post updated:', postId);
      return true;
    } catch (error) {
      console.error('[OdooClient] Failed to update blog post:', error);
      return false;
    }
  }

  /**
   * Publish a blog post in Odoo
   */
  async publishBlogPost(postId: number): Promise<boolean> {
    try {
      await this.execute_kw(
        'blog.post',
        'write',
        [[postId], { is_published: true }]
      );

      console.log('[OdooClient] Blog post published:', postId);
      return true;
    } catch (error) {
      console.error('[OdooClient] Failed to publish blog post:', error);
      return false;
    }
  }

  /**
   * Get blog list from Odoo
   */
  async getBlogs(): Promise<Array<{ id: number; name: string }>> {
    try {
      const blogs = await this.execute_kw(
        'blog.blog',
        'search_read',
        [[]],
        {
          fields: ['id', 'name']
        }
      );

      return blogs.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
    } catch (error) {
      console.error('[OdooClient] Failed to fetch blogs:', error);
      return [];
    }
  }

  /**
   * Get blog posts from a specific blog
   */
  async getBlogPosts(blogId: number, limit: number = 10): Promise<OdooBlogPost[]> {
    try {
      const posts = await this.execute_kw(
        'blog.post',
        'search_read',
        [[['blog_id', '=', blogId]]],
        {
          fields: ['id', 'name', 'content', 'blog_id', 'tag_ids', 'meta_description', 'is_published'],
          limit
        }
      );

      return posts.map((item: any) => ({
        id: item.id,
        name: item.name,
        content: item.content || '',
        blog_id: Array.isArray(item.blog_id) ? item.blog_id[0] : item.blog_id,
        tag_ids: item.tag_ids || [],
        meta_description: item.meta_description || '',
        is_published: item.is_published || false,
      }));
    } catch (error) {
      console.error('[OdooClient] Failed to fetch blog posts:', error);
      return [];
    }
  }
}


/**
 * Create and initialize an Odoo client
 * Note: For XML-RPC, we need username instead of API key
 * The API key should be used as the password
 */
export async function createOdooClient(
  baseUrl: string,
  database: string,
  username: string,
  password: string
): Promise<OdooClient> {
  const client = new OdooClient(baseUrl, database, username, password);
  
  // Test connection
  const connected = await client.testConnection();
  if (!connected) {
    throw new Error('Failed to connect to Odoo');
  }
  
  return client;
}
