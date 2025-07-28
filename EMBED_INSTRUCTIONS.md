# PassItOn Donation Widget - Easy Embed Guide

## 🎯 What This Does
This guide helps you add a donation button to your website that opens a secure donation form. Your visitors can donate without leaving your site!

## 📋 Before You Start
- You need access to edit your website's HTML code
- If you use WordPress, Squarespace, or similar platforms, look for "Custom HTML" or "Code Injection" options

## 🚀 Quick Setup (3 Steps)

### Step 1: Copy This Code
Copy and paste this code into your website's HTML, right before the closing `</body>` tag:

```html
<!-- PassItOn Donation Widget -->
<script>
  window.PassItOnConfig = {
    organizationId: 'YOUR_ORG_ID_HERE',    // Replace with your organization ID
    defaultAmount: 25,                      // Default donation amount in dollars
    color: '#3b82f6',                      // Button color (hex code)
    buttonText: 'Donate Now',              // Text on the donation button
    position: 'bottom-right'               // Where to show the button
  };
</script>
<script src="https://YOUR_DOMAIN_HERE/embed.js"></script>
```

### Step 2: Customize Your Settings
Replace these values with your information:

| Setting | What It Does | Example |
|---------|--------------|---------|
| `organizationId` | Your unique organization ID | `'org_123abc'` |
| `defaultAmount` | Starting donation amount | `50` (for $50) |
| `color` | Button color | `'#ff6b6b'` (coral red) |
| `buttonText` | Button label | `'Support Us'` |
| `position` | Button location | `'bottom-left'` or `'bottom-right'` |

### Step 3: Replace the Domain
Change `YOUR_DOMAIN_HERE` to your actual website domain (we'll provide this).

## 🎨 Button Position Options
- `'bottom-left'` - Bottom left corner
- `'bottom-right'` - Bottom right corner  
- `'top-left'` - Top left corner
- `'top-right'` - Top right corner

## 🌈 Color Examples
Use any hex color code:
- Blue: `'#3b82f6'`
- Green: `'#10b981'`
- Purple: `'#8b5cf6'`
- Red: `'#ef4444'`
- Orange: `'#f59e0b'`

## 🎯 Alternative Setup (For Specific Location)

If you want the button in a specific spot instead of floating, use this code:

```html
<!-- Place this where you want the button to appear -->
<div id="my-donate-button"></div>

<!-- Place this before closing </body> tag -->
<script>
  window.PassItOnConfig = {
    targetElementId: 'my-donate-button',   // This targets the div above
    organizationId: 'YOUR_ORG_ID_HERE',
    defaultAmount: 25,
    color: '#3b82f6',
    buttonText: 'Donate Now'
    // No position needed - it will appear in the div
  };
</script>
<script src="https://YOUR_DOMAIN_HERE/embed.js"></script>
```

## 💻 Platform-Specific Instructions

### WordPress
1. Go to **Appearance > Theme Editor**
2. Select **footer.php**
3. Add the code before `</body>`
4. Click **Update File**

**OR** use a plugin:
1. Install "Insert Headers and Footers" plugin
2. Go to **Settings > Insert Headers and Footers**
3. Paste code in "Scripts in Footer" section

### Squarespace
1. Go to **Settings > Advanced > Code Injection**
2. Paste code in "Footer" section
3. Click **Save**

### Wix
1. Go to your site editor
2. Click **Settings** in the top menu
3. Select **Custom Code**
4. Click **Add Custom Code**
5. Paste the code and set it to load on "All Pages"

### Shopify
1. Go to **Online Store > Themes**
2. Click **Actions > Edit Code**
3. Open **layout/theme.liquid**
4. Add code before `</body>`
5. Click **Save**

## 🛠️ Troubleshooting

### Button Not Showing?
- Check that you replaced `YOUR_DOMAIN_HERE` with the correct domain
- Make sure the code is before the closing `</body>` tag
- Clear your browser cache and refresh the page

### Button Wrong Color/Size?
- Verify your color code starts with `#` (like `#3b82f6`)
- Check that all quotes and commas are in the right places

### Donation Form Not Opening?
- Ensure your `organizationId` is correct
- Check browser console for error messages (F12 key)

## 📞 Need Help?
Contact support with:
- Your website URL
- Screenshot of any error messages
- Which platform you're using (WordPress, Squarespace, etc.)

## 🔒 Security Note
The donation widget uses secure HTTPS connections and doesn't store any payment information on your website. All transactions are processed securely through our platform.

---

*That's it! Your donation widget should now be live on your website. Test it by clicking the button to make sure everything works correctly.*