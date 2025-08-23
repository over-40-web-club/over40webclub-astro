#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import Airtable from 'airtable';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
config();

// Environment variables
const AIRTABLE_API_TOKEN = process.env.AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Team';

if (!AIRTABLE_API_TOKEN || !AIRTABLE_BASE_ID) {
  console.error('❌ Environment variables AIRTABLE_API_TOKEN and AIRTABLE_BASE_ID are required');
  process.exit(1);
}

// Paths
const contentTeamDir = path.join(__dirname, '..', 'src', 'content', 'team');
const publicImagesTeamDir = path.join(__dirname, '..', 'public', 'images', 'team');

// Create directories if they don't exist
if (!fs.existsSync(contentTeamDir)) {
  fs.mkdirSync(contentTeamDir, { recursive: true });
}

if (!fs.existsSync(publicImagesTeamDir)) {
  fs.mkdirSync(publicImagesTeamDir, { recursive: true });
}

// Download image from URL
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(publicImagesTeamDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Image already exists: ${filename}`);
      resolve(filename);
      return;
    }

    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded image: ${filename}`);
        resolve(filename);
      });
    }).on('error', (error) => {
      fs.unlink(filePath, () => {}); // Delete the file if error
      console.warn(`⚠️  Failed to download image ${filename}: ${error.message}`);
      resolve(null);
    });
  });
}

// Generate safe filename from Twitter username
function generateSafeFilename(member, extension = '.jpg') {
  // Try to use Twitter username first
  const twitterUsername = member.fields['Twitter username'];
  if (twitterUsername && twitterUsername.trim() !== '') {
    const safeUsername = twitterUsername
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .trim();
    
    if (safeUsername) {
      return safeUsername + extension;
    }
  }
  
  // Fallback to name conversion if no Twitter username
  const name = member.fields.Name;
  if (!name || name.trim() === '') return `unknown${extension}`;
  
  // Convert Japanese characters to romaji-like representation
  const converted = name
    .replace(/ピータン/g, 'pitang')
    .replace(/そんほんす/g, 'son')
    .replace(/ながたく/g, 'nagataku')
    .replace(/だむごん/g, 'damgon')
    .replace(/訓志/g, 'kunshi')
    .replace(/にゆ/g, 'niyu')
    .replace(/ふみ/g, 'fumi')
    .replace(/とっぷ/g, 'top')
    .replace(/りり/g, 'riri')
    .replace(/あっがい/g, 'aggai')
    .replace(/みー/g, 'mii')
    .replace(/おとかつ/g, 'otokatsu')
    .replace(/みくのすけ/g, 'mikunosuke')
    .replace(/あべいさじ/g, 'abeisaji')
    .replace(/りつ子/g, 'ritsuko')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .trim();

  return (converted || 'unknown') + extension;
}

// Convert team member to markdown
function createMarkdownContent(member, imagePath, order) {
  const frontmatter = {
    id: member.id,
    name: member.fields.Name,
    image: imagePath,
    order: order,
    social: {}
  };

  // Add social links if they exist
  if (member.fields['Homepage URL']) {
    frontmatter.social.homepage = member.fields['Homepage URL'];
  }
  if (member.fields['Twitter username']) {
    frontmatter.social.twitter = member.fields['Twitter username'];
  }
  if (member.fields['GitHub username']) {
    frontmatter.social.github = member.fields['GitHub username'];
  }
  if (member.fields['Instagram username']) {
    frontmatter.social.instagram = member.fields['Instagram username'];
  }
  if (member.fields['YouTube URL']) {
    frontmatter.social.youtube = member.fields['YouTube URL'];
  }

  // Clean up empty social object
  if (Object.keys(frontmatter.social).length === 0) {
    delete frontmatter.social;
  }

  const yamlFrontmatter = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (typeof value === 'object') {
        const subEntries = Object.entries(value)
          .map(([subKey, subValue]) => `  ${subKey}: "${subValue}"`)
          .join('\n');
        return `${key}:\n${subEntries}`;
      }
      return `${key}: ${typeof value === 'string' ? `"${value}"` : value}`;
    })
    .join('\n');

  const bio = member.fields.Bio || '';
  
  return `---
${yamlFrontmatter}
---

${bio}
`;
}

// Main migration function
async function migrateAirtableToMarkdown() {
  try {
    console.log('🚀 Starting Airtable to Markdown migration...');
    
    // Configure Airtable
    Airtable.configure({ apiKey: AIRTABLE_API_TOKEN });
    const base = Airtable.base(AIRTABLE_BASE_ID);
    const table = base(AIRTABLE_TABLE_NAME);

    // Fetch records
    console.log('📊 Fetching team members from Airtable...');
    const records = await table
      .select({
        sort: [{ field: 'Order', direction: 'asc' }],
      })
      .all();

    console.log(`📋 Found ${records.length} team members`);

    // Process each record
    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      const member = {
        id: record.id,
        fields: record.fields
      };

      console.log(`\n👤 Processing: ${member.fields.Name}`);

      // Handle image
      let imagePath = null;
      if (member.fields.Photo && member.fields.Photo.length > 0) {
        const photo = member.fields.Photo[0];
        const imageUrl = photo.thumbnails?.large?.url || photo.url;
        const imageExtension = path.extname(photo.filename) || '.jpg';
        const safeFilename = generateSafeFilename(member, imageExtension);
        
        const downloadedFilename = await downloadImage(imageUrl, safeFilename);
        if (downloadedFilename) {
          imagePath = `/images/team/${downloadedFilename}`;
        }
      }

      // Fallback to existing image if no download
      if (!imagePath) {
        const fallbackFilename = generateSafeFilename(member, '.jpg');
        const fallbackPath = path.join(publicImagesTeamDir, fallbackFilename);
        if (fs.existsSync(fallbackPath)) {
          imagePath = `/images/team/${fallbackFilename}`;
          console.log(`📷 Using existing image: ${fallbackFilename}`);
        }
      }

      // Create markdown content
      const order = member.fields.Order || (index + 1);
      const markdownContent = createMarkdownContent(member, imagePath, order);

      // Write markdown file
      const markdownFilename = generateSafeFilename(member, '.md');
      const markdownPath = path.join(contentTeamDir, markdownFilename);
      
      fs.writeFileSync(markdownPath, markdownContent);
      console.log(`📝 Created markdown: ${markdownFilename}`);
    }

    console.log(`\n✅ Migration completed! ${records.length} team members migrated.`);
    console.log(`📁 Markdown files created in: ${contentTeamDir}`);
    console.log(`🖼️  Images downloaded to: ${publicImagesTeamDir}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateAirtableToMarkdown();