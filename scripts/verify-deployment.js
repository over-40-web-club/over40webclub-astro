#!/usr/bin/env node

/**
 * Deployment verification script
 * Checks that all required environment variables are set and accessible
 */

// Load environment variables from .env file if it exists
import { readFileSync } from 'fs';
import { join } from 'path';

try {
  const envPath = join(process.cwd(), '.env');
  const envFile = readFileSync(envPath, 'utf8');
  const envVars = envFile
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'));

  envVars.forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (error) {
  // .env file doesn't exist or can't be read, continue with system env vars
}

const requiredEnvVars = [
  'SITE_URL',
];

const optionalEnvVars = ['NODE_ENV', 'NETLIFY', 'CONTEXT'];

console.log('🔍 Verifying deployment configuration...\n');

// Check required environment variables
let missingRequired = [];
let presentRequired = [];

requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value) {
    missingRequired.push(varName);
  } else {
    presentRequired.push(varName);
    // Don't log sensitive values, just confirm they exist
    if (varName.includes('TOKEN')) {
      console.log(`✅ ${varName}: [HIDDEN]`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  }
});

// Check optional environment variables
console.log('\n📋 Optional environment variables:');
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`ℹ️  ${varName}: ${value}`);
  } else {
    console.log(`⚪ ${varName}: not set`);
  }
});

// Report results
console.log('\n📊 Summary:');
console.log(
  `✅ Required variables present: ${presentRequired.length}/${requiredEnvVars.length}`
);

if (missingRequired.length > 0) {
  console.log(`❌ Missing required variables: ${missingRequired.join(', ')}`);
  console.log('\n🔧 To fix this:');
  console.log('1. Check your .env file (for local development)');
  console.log('2. Verify Netlify environment variables (for production)');
  console.log('3. See DEPLOYMENT.md for detailed setup instructions');
  process.exit(1);
} else {
  console.log('🎉 All required environment variables are configured!');
}

// Test Airtable connection if in build context
if (process.env.NETLIFY || process.env.NODE_ENV === 'production') {
  console.log('\n🔗 Testing Airtable connection...');

  try {
    // Basic validation of Airtable configuration
    const token = process.env.AIRTABLE_API_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (
      token &&
      token.startsWith('pat') &&
      baseId &&
      baseId.startsWith('app')
    ) {
      console.log('✅ Airtable configuration format looks correct');
    } else {
      console.log('⚠️  Airtable configuration format may be incorrect');
      if (!token.startsWith('pat')) {
        console.log('   - API token should start with "pat"');
      }
      if (!baseId.startsWith('app')) {
        console.log('   - Base ID should start with "app"');
      }
    }
  } catch (error) {
    console.log(`❌ Error testing Airtable configuration: ${error.message}`);
  }
}

console.log('\n✨ Deployment verification complete!');
