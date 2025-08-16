#!/usr/bin/env node

/**
 * Netlify pre-build hook
 * Runs before the main build process to ensure environment is ready
 */

console.log('🚀 Starting Netlify pre-build hook...');

// Log build context information
console.log('📋 Build Context:');
console.log(`   - Node version: ${process.version}`);
console.log(`   - Platform: ${process.platform}`);
console.log(`   - Architecture: ${process.arch}`);
console.log(`   - Netlify context: ${process.env.CONTEXT || 'unknown'}`);
console.log(`   - Branch: ${process.env.BRANCH || 'unknown'}`);

// Check if this is a production build
const isProduction = process.env.CONTEXT === 'production';
const isDeploy = process.env.CONTEXT === 'deploy-preview';

if (isProduction) {
  console.log('🎯 Production build detected');
} else if (isDeploy) {
  console.log('🔍 Deploy preview build detected');
} else {
  console.log('🧪 Development/branch build detected');
}

// Verify critical environment variables
const criticalVars = ['AIRTABLE_API_TOKEN', 'AIRTABLE_BASE_ID'];
const missingVars = criticalVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.log(
    `❌ Missing critical environment variables: ${missingVars.join(', ')}`
  );
  console.log('🔧 Please configure these in your Netlify site settings');

  // Don't fail the build for deploy previews, but warn
  if (isProduction) {
    process.exit(1);
  } else {
    console.log('⚠️  Continuing with build (non-production context)');
  }
} else {
  console.log('✅ All critical environment variables are present');
}

// Set build optimizations
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

console.log('✨ Pre-build hook completed successfully!');
