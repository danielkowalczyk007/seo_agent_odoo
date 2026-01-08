# SEO Agent for Odoo Blog

Automated AI-powered blogging system that integrates with Odoo CMS to publish SEO-optimized content twice a week.

## Features

### 🤖 AI-Powered Content Generation
- **Three AI Models**: Gemini, ChatGPT (OpenAI), and Claude (Anthropic) generate content in parallel
- **Automatic Selection**: System automatically selects the best version based on scoring criteria
- **SEO Optimization**: Content is optimized for search engines with proper keyword density and structure

### 📊 Intelligent Scoring System
- **SEO Score (30%)**: Keyword density, heading structure, content length
- **Readability Score (30%)**: Sentence length, paragraph structure, formatting
- **Engagement Score (40%)**: Call-to-action, questions, emphasis

### 🔄 Automated Publishing
- **Scheduled Publication**: Automatically publishes twice a week (Monday & Thursday at 9:00 AM GMT+1)
- **Odoo Integration**: Seamlessly creates and publishes posts to your Odoo blog
- **Manual Trigger**: Option to manually trigger publication on demand

### 📈 Performance Monitoring
- **Dashboard**: Real-time overview of posts, publications, and performance
- **Publication Logs**: Track all publication attempts and results
- **Post Analytics**: View scores, keywords, and performance metrics

## Setup Instructions

### 1. Prerequisites

- Odoo instance with REST API module installed
- API keys for:
  - Google Gemini
  - OpenAI (ChatGPT)
  - Anthropic (Claude)

### 2. Configuration

1. **Sign in** to the application
2. Navigate to **Configuration** page
3. Fill in the following settings:

#### Odoo Configuration
- **Odoo URL**: Your Odoo instance URL (e.g., https://powergo.pl)
- **Odoo API Key**: REST API key from your Odoo instance
- **Odoo Database**: Database name (usually "odoo")
- **Odoo Blog ID**: The ID of the blog where posts will be published

#### AI Models Configuration
- **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Anthropic API Key**: Get from [Anthropic Console](https://console.anthropic.com/)

4. Click **Save Configuration**

### 3. Getting Odoo REST API Key

To use this system with Odoo, you need to install the REST API module:

1. Install the **rest_api_odoo** module from Odoo Apps
2. Add to your `odoo.conf`: `server_wide_modules = web, base, rest_api_odoo`
3. Restart Odoo
4. Go to **Settings → Users → Your User**
5. Find the **API Key** field
6. Generate or copy your API key

### 4. Finding Your Blog ID

1. Log in to Odoo backend
2. Go to **Website → Configuration → Blogs**
3. Open your blog
4. Check the URL - the ID is the number after `/blog/`
   - Example: `/blog/1` → Blog ID is `1`

## Usage

### Dashboard

The dashboard provides an overview of:
- Total posts generated
- Published posts count
- Draft posts count
- Successful publications
- Recent posts with scores
- Publication logs

### Manual Publication

Click the **Trigger Publication** button on the dashboard to manually start the publication process:

1. System fetches products and categories from Odoo
2. Generates SEO topics based on data
3. Three AI models write articles in parallel
4. System evaluates and selects the best version
5. Post is optimized and published to Odoo

### Viewing Posts

Navigate to the **Posts** page to see all generated posts with:
- Title and meta description
- AI writer (Gemini, ChatGPT, or Claude)
- Scores (Total, SEO, Readability, Engagement)
- Keywords
- Publication status
- Odoo post ID

### Managing Topics

The **Topics** page shows pending SEO topics that will be used for future publications:
- Topic name
- Keywords
- SEO difficulty
- Related products
- Content outline

## Publication Schedule

The system automatically publishes blog posts:

- **Monday at 9:00 AM GMT+1**
- **Thursday at 9:00 AM GMT+1**

You will receive email notifications for:
- ✅ Successful publications
- ❌ Failed publications with error details

## How It Works

### 1. Topic Generation
- Analyzes products and categories from Odoo
- Generates SEO-optimized topics with keywords
- Estimates SEO difficulty for each topic
- Selects the best topic for publication

### 2. Content Generation
- Three AI models (Gemini, ChatGPT, Claude) write articles simultaneously
- Each model receives the same outline and keywords
- Target length: 1500-3000 words
- Content is generated in Polish

### 3. Scoring & Selection
- Each article is scored on:
  - **SEO (30%)**: Keyword density, headings, length
  - **Readability (30%)**: Sentence length, paragraphs, formatting
  - **Engagement (40%)**: CTAs, questions, emphasis
- Best article is automatically selected

### 4. Optimization
- Meta description is generated (150-160 characters)
- Internal links to products are added
- Content is formatted for Odoo CMS

### 5. Publication
- Post is created in Odoo as draft
- Post is published to the blog
- Database is updated with post details
- Owner receives email notification

## Technical Architecture

### Backend Modules

- **odoo-client.ts**: Odoo REST API integration
- **ai-writers.ts**: AI model integrations (Gemini, ChatGPT, Claude)
- **seo-generator.ts**: Topic generation and keyword research
- **seo-optimizer.ts**: Article scoring and optimization
- **scheduler.ts**: Publication scheduling and automation

### Database Schema

- **blog_posts**: Stores all generated posts with scores
- **topics**: Stores SEO topics and keywords
- **publication_log**: Tracks publication attempts
- **configuration**: Stores API keys and settings

### Frontend Pages

- **Home**: Landing page with feature overview
- **Dashboard**: Main control panel
- **Configuration**: Settings and API keys
- **Posts**: List of all generated posts
- **Topics**: Pending SEO topics

## Troubleshooting

### Publication Fails

1. Check Odoo API configuration in Configuration page
2. Verify API key is valid
3. Check publication logs for error messages
4. Ensure Odoo REST API module is installed

### AI Generation Fails

1. Verify all three AI API keys are configured
2. Check API key validity and quotas
3. At least one AI model must succeed for publication

### No Topics Generated

1. Ensure Odoo has products and categories
2. Check Odoo API connection
3. Manually trigger publication to generate topics

## Support

For issues or questions:
- Check the publication logs in Dashboard
- Review error messages in email notifications
- Verify all configuration settings

## Credits

Built with:
- React 19 + TypeScript
- tRPC for type-safe API
- Tailwind CSS for styling
- Drizzle ORM for database
- Google Gemini, OpenAI, and Anthropic APIs
