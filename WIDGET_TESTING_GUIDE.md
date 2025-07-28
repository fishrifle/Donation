# PassItOn Donation Widget - Testing Guide

## Overview
This guide explains how to test and use the PassItOn donation widget system during development and for client demonstrations.

## Quick Start
1. **Dashboard**: Run on port 3001 (`http://localhost:3001`)
2. **Widget**: Run on port 3000 (`http://localhost:3000`)
3. **Test Pages**: Available in the `public/` folder

## Test Pages

### 1. Basic Demo (`embed-test.html`)
- **Purpose**: Simple demonstration with mock functionality
- **URL**: `http://localhost:3000/embed-test.html`
- **Features**: 
  - Shows floating and inline widget demos
  - Mock donation buttons (alerts only)
  - Implementation examples

### 2. Live Configuration Test (`live-widget-test.html`)
- **Purpose**: Tests real dashboard integration
- **URL**: `http://localhost:3000/live-widget-test.html`
- **Features**:
  - Loads actual widget configuration from dashboard
  - Shows theme colors, fonts, and settings
  - Real-time preview of dashboard changes
- **⚠️ Important**: Refresh page after making dashboard changes

### 3. Full Integration Test (`test-embed-page.html`)
- **Purpose**: Tests complete donation flow
- **URL**: `http://localhost:3000/test-embed-page.html`
- **Features**:
  - Real donation form integration
  - Tests iframe embedding
  - Full payment flow (requires Stripe setup)

## Dashboard Configuration

### Accessing the Dashboard
1. Go to `http://localhost:3001`
2. Sign in with Clerk authentication
3. Navigate to **Widget Customize** section

### Making Changes
1. Update colors, fonts, amounts, etc.
2. Click **Save** button
3. **⚠️ IMPORTANT**: Refresh test pages to see changes
4. Changes are immediately available via API

### Default Theme Colors (Persevere Brand)
- **Primary Color**: `#0891B2` (Cyan-600)
- **Secondary Color**: `#0F766E` (Teal-700)
- **Header Color**: `#0F172A` (Slate-900)
- **Font**: Inter

## Widget Features

### Responsive Height
- Widget window automatically adjusts to content size
- Smooth transitions when form changes
- Minimum height: 400px
- Maximum height: 80% of screen height

### Embedding Options
- **Floating Widget**: Fixed position (bottom-right by default)
- **Inline Widget**: Embedded in page content
- **Custom Positioning**: Configurable via config options

### Close Button Behavior
- **Embedded Mode**: Only parent window close button (no duplicates)
- **Standalone Mode**: Internal close button available

## Configuration API

### Endpoint
```
GET /api/widget-config/{organizationId}
```

### Response Format
```json
{
  "id": "widget-id",
  "name": "Widget Name",
  "organizationId": "org-id",
  "organizationName": "Organization Name",
  "config": {
    "theme": {
      "primaryColor": "#0891B2",
      "secondaryColor": "#0F766E",
      "backgroundColor": "#FFFFFF",
      "textColor": "#1F2937",
      "headerColor": "#0F172A",
      "fontFamily": "Inter",
      "borderRadius": 8,
      "headerAlignment": "center"
    },
    "settings": {
      "showProgressBar": true,
      "showDonorList": true,
      "allowRecurring": true,
      "minimumDonation": 100,
      "suggestedAmounts": [1000, 3000, 6000, 10000, 20000],
      "showCoverFees": true,
      "defaultFrequency": "one-time"
    },
    "causes": []
  }
}
```

## Troubleshooting

### "Configuration Error: Failed to fetch"
- **Cause**: Dashboard not running or wrong port
- **Solution**: Ensure dashboard runs on port 3001
- **Check**: `http://localhost:3001/api/widget-config/{orgId}`

### "Causes table does not exist"
- **Cause**: Database migration not applied
- **Solution**: System handles gracefully, causes will be empty array
- **Impact**: Widget works, but no cause selection available

### Duplicate Close Buttons
- **Cause**: Both embed script and widget showing close buttons
- **Solution**: Fixed - widget detects embedding and hides internal button
- **Result**: Only one close button shows when embedded

### Widget Not Updating After Dashboard Changes
- **Cause**: Browser cache or static loading
- **Solution**: Refresh the test page after making changes
- **Note**: This is expected behavior in development

## Demo Preparation

### Before Demo
1. Start both servers (dashboard on 3001, widget on 3000)
2. Create test organization and widget via dashboard
3. Test all three test pages
4. Prepare example configurations to show

### Demo Flow
1. **Show Dashboard**: Widget customization interface
2. **Make Changes**: Update colors, amounts, settings
3. **Show Impact**: Refresh test page to display changes
4. **Test Integration**: Show different embedding options
5. **Test Donation Flow**: Complete donation process

### Key Selling Points
- **Easy Integration**: Just add script tag
- **Fully Customizable**: Colors, fonts, amounts, behavior
- **Responsive Design**: Adapts to content and screen size
- **Real-time Updates**: Changes reflect immediately
- **Professional Appearance**: Matches brand colors

## File Structure
```
public/
├── embed-test.html           # Basic demo
├── live-widget-test.html     # Dashboard integration test
├── test-embed-page.html      # Full integration test
├── embed-local-test.js       # Main embed script
├── embed.js                  # Production embed script
└── widget-generator.html     # Widget configuration tool
```

## Support
- Dashboard issues: Check port 3001 and Clerk authentication
- Widget issues: Check port 3000 and API connectivity
- Database issues: Check Supabase connection and migrations
- Payment issues: Verify Stripe configuration