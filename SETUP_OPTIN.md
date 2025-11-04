# Opt-In Integration Setup Guide

This guide will help you set up Mailchimp and Google Sheets integration for the AI Content Ideas Helper.

## Overview

When users submit the form for the first time, they'll be prompted to enter their name and email. This information is then automatically added to:
1. **Mailchimp** - For email marketing
2. **Google Sheets** - For data tracking

## Mailchimp Setup

### Step 1: Get Your Mailchimp API Key

1. Log in to your Mailchimp account
2. Click on your profile icon (top right) → **Account**
3. Go to **Extras** → **API keys**
4. Create a new API key or copy an existing one
5. The API key format is: `xxxxx-us10` (where `us10` is your data center)

### Step 2: Get Your List ID

1. In Mailchimp, go to **Audience** → **All contacts**
2. Click on **Settings** → **Audience name and defaults**
3. Your List ID is shown at the bottom (e.g., `a1b2c3d4e5`)

### Step 3: Add to Cloudflare Worker

In your Cloudflare Worker dashboard, add these environment variables:

- **Variable name**: `MAILCHIMP_API_KEY`
- **Value**: Your Mailchimp API key (e.g., `xxxxx-us10`)

- **Variable name**: `MAILCHIMP_LIST_ID`
- **Value**: Your Mailchimp List ID (e.g., `a1b2c3d4e5`)

## Google Sheets Setup

### Option 1: Google Apps Script Web App (Recommended)

This is the easiest method for serverless functions.

#### Step 1: Create a Google Sheet

1. Create a new Google Sheet
2. Add headers in row 1:
   - Timestamp
   - Name
   - Email
   - Business Name
   - Website URL
   - ICA
   - Services
   - Key Transformation
   - Audience Context
   - Top Performing Content Title

#### Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete the default code and paste this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add row with timestamp
    const row = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.businessName || '',
      data.websiteUrl || '',
      data.ica || '',
      data.services || '',
      data.keyTransformation || '',
      data.audienceContext || '',
      data.topPerformingContentTitle || ''
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (💾) and give it a name like "Content Ideas Webhook"

#### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type" → **Web app**
3. Set:
   - **Description**: Content Ideas Webhook
   - **Execute as**: Me
   - **Who has access**: Anyone (or "Anyone with Google account" if you want to restrict)
4. Click **Deploy**
5. Copy the **Web App URL** (looks like: `https://script.google.com/macros/s/.../exec`)

#### Step 4: Add to Cloudflare Worker

In your Cloudflare Worker dashboard, add this environment variable:

- **Variable name**: `GOOGLE_APPS_SCRIPT_WEBHOOK_URL`
- **Value**: Your Web App URL from Step 3

### Option 2: Google Sheets API v4 (Advanced)

This requires OAuth 2.0 or Service Account setup. See Google's documentation for details.

## Testing

1. **Test Mailchimp**: Submit the form with your email and check if it appears in your Mailchimp list
2. **Test Google Sheets**: Check if a new row is added to your Google Sheet after submission

## Troubleshooting

### Mailchimp Issues

- **"Member Exists"**: This is normal - the user is already in your list
- **401 Unauthorized**: Check that your API key is correct
- **404 Not Found**: Verify your List ID is correct

### Google Sheets Issues

- **403 Forbidden**: Make sure your Apps Script web app is deployed with "Anyone" access
- **No data appearing**: Check the Apps Script execution logs (View → Executions)

## Environment Variables Summary

Add these to your Cloudflare Worker:

```
MAILCHIMP_API_KEY=your-api-key-here
MAILCHIMP_LIST_ID=your-list-id-here
GOOGLE_APPS_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
```

## Notes

- The opt-in only appears on the **first** content generation (not on "Generate More")
- If Mailchimp or Google Sheets fails, the app will still generate ideas (errors are logged but don't block the response)
- User data is only collected when they opt-in via the modal

