/**
 * Odoo REST API Client
 * Handles communication with Odoo CMS for blog post management
 */

import axios, { AxiosInstance } from 'axios';

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
  private client: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;
  private database: string;

  constructor(baseUrl: string, apiKey: string, database: string = 'odoo') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.database = database;

    this.client = axios.create({
      baseURL: `${baseUrl}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      timeout: 30000,
    });
  }

  /**
   * Test connection to Odoo API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/version');
      return response.status === 200;
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
      const response = await this.client.get('/records/product.template', {
        params: {
          limit,
          fields: ['id', 'name', 'description', 'categ_id', 'list_price'],
        },
      });

      return response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        category: item.categ_id?.[1] || '',
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
      const response = await this.client.get('/records/product.category', {
        params: {
          fields: ['id', 'name', 'complete_name'],
        },
      });

      return response.data.map((item: any) => ({
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
      const response = await this.client.post('/records/blog.post', {
        name: post.name,
        content: post.content,
        blog_id: post.blog_id,
        tag_ids: post.tag_ids || [],
        meta_description: post.meta_description || '',
        is_published: post.is_published || false,
      });

      return response.data.id || null;
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
      await this.client.put(`/records/blog.post/${postId}`, updates);
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
      await this.client.put(`/records/blog.post/${postId}`, {
        is_published: true,
      });
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
      const response = await this.client.get('/records/blog.blog', {
        params: {
          fields: ['id', 'name'],
        },
      });

      return response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
    } catch (error) {
      console.error('[OdooClient] Failed to fetch blogs:', error);
      return [];
    }
  }
}

/**
 * Create Odoo client instance from configuration
 */
export async function createOdooClient(
  baseUrl: string,
  apiKey: string,
  database?: string
): Promise<OdooClient> {
  const client = new OdooClient(baseUrl, apiKey, database);
  
  // Test connection
  const isConnected = await client.testConnection();
  if (!isConnected) {
    throw new Error('Failed to connect to Odoo API');
  }

  return client;
}
