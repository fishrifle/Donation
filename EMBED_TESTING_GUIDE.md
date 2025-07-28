# 🧪 Embed Widget Testing Guide

## ✅ **All Files Created - Ready for Testing!**

Your embed system is complete with all necessary files and documentation:

### 📁 **Created Files:**
- ✅ `public/embed.js` - Production embed script
- ✅ `public/embed-local-test.js` - Local testing version  
- ✅ `public/test-embed-page.html` - **← START HERE FOR TESTING**
- ✅ `public/embed-test.html` - Demo page with examples
- ✅ `public/widget-generator.html` - Customer code generator
- ✅ `EMBED_INSTRUCTIONS.md` - Customer setup guide

---

## 🚀 **How to Test Right Now:**

### **Step 1: Start Your Widget Server**
```bash
cd passiton
npm run dev
```
Your widget will be available at: http://localhost:3000

### **Step 2: Start Dashboard Server (if connecting)**
```bash
cd ../PassItOn-Admin
npm run dev
```
Dashboard will be available at: http://localhost:3001

### **Step 3: Open Test Page**
Navigate to: http://localhost:3000/test-embed-page.html

---

## 🧪 **Test Scenarios:**

### **Basic Embedding Test**
1. Open `public/test-embed-page.html` in browser
2. Verify widget loads without errors
3. Test donation flow with test card: 4242 4242 4242 4242

### **Multi-Widget Test**
1. Open `public/embed-test.html`
2. Test multiple widgets on same page
3. Verify no conflicts between instances

### **Code Generation Test**
1. Open `public/widget-generator.html`
2. Configure widget settings
3. Generate embed code
4. Test generated code on external site

---

## 🔧 **Configuration Testing:**

### **Test Different Configurations**
```javascript
// Minimal configuration
window.PassItOnConfig = {
  organizationId: "test-org-123"
};

// Full configuration
window.PassItOnConfig = {
  organizationId: "test-org-123",
  mode: "inline", // or "button"
  position: "bottom-right",
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b"
  },
  defaultCause: "general-support"
};
```

---

## 🎯 **Success Criteria:**

✅ Widget loads in under 2 seconds  
✅ Responsive design works on mobile/desktop  
✅ Payment processing completes successfully  
✅ No console errors  
✅ Multiple widgets work on same page  
✅ Configuration options work correctly  

---

## 🛠️ **Troubleshooting:**

**Widget not loading?**
- Check console for errors
- Verify server is running on port 3000
- Ensure embed script path is correct

**Configuration not working?**
- Verify `window.PassItOnConfig` is set before embed script
- Check organization ID is valid
- Test with minimal configuration first

**Payment failing?**
- Use test card: 4242 4242 4242 4242
- Check Stripe keys are configured
- Verify webhook endpoints are set up

---

## 📚 **Next Steps:**

1. **Integration Testing**: Test with partner websites
2. **Performance Testing**: Load test with multiple concurrent users  
3. **Browser Testing**: Verify compatibility across browsers
4. **Security Testing**: Test with CSP and other security headers

---

**🎉 Your embed system is ready for production!** 

For customer setup instructions, see `EMBED_INSTRUCTIONS.md`