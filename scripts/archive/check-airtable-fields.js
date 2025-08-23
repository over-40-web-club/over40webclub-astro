#!/usr/bin/env node

import { config } from 'dotenv';
import Airtable from 'airtable';

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

async function checkAirtableFields() {
  try {
    console.log('🔍 Checking Airtable fields...');
    
    // Configure Airtable
    Airtable.configure({ apiKey: AIRTABLE_API_TOKEN });
    const base = Airtable.base(AIRTABLE_BASE_ID);
    const table = base(AIRTABLE_TABLE_NAME);

    // Fetch first record to examine fields
    const records = await table.select({ maxRecords: 1 }).all();
    
    if (records.length > 0) {
      const firstRecord = records[0];
      console.log('\n📋 Available fields in first record:');
      console.log('Record ID:', firstRecord.id);
      console.log('Fields:', Object.keys(firstRecord.fields));
      
      console.log('\n📝 Sample data:');
      Object.entries(firstRecord.fields).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          console.log(`${key}:`, JSON.stringify(value, null, 2));
        } else {
          console.log(`${key}:`, value);
        }
      });
    } else {
      console.log('❌ No records found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAirtableFields();