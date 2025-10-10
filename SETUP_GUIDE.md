# 🚀 Creo Authentication Setup Guide

## 📋 **Demo Accounts for Testing**

The system includes **demo accounts** for testing purposes (development only):

### 🔐 **Demo Login Credentials:**

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Super Admin** | `admin@creo.demo` | `demo123` | All Access, User Management, System Settings, Analytics, Content Management |
| **Content Manager** | `content@creo.demo` | `demo123` | Content Management, Order Processing, Analytics |
| **Support Admin** | `support@creo.demo` | `demo123` | User Support, Order Management, Basic Analytics |

### 🧪 **How to Test:**

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the test page:**
   ```
   http://localhost:3000/auth/test
   ```

3. **Use demo login buttons** to test different user roles

4. **Test protected routes:**
   - `/dashboard` (requires auth)
   - `/orders` (requires auth)
   - `/ai-generation` (requires auth)
   - `/stock-search` (public)

---

## 🔧 **Production Setup (Supabase)**

For production deployment, you need to set up Supabase:

### 1. **Create Supabase Project:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API

### 2. **Environment Variables:**
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_NEHTW_API_KEY=your_nehtw_api_key_here
NEXT_PUBLIC_NEHTW_BASE_URL=https://nehtw.com/api
```

### 3. **Create Real User Accounts:**
Once Supabase is set up, you can create real user accounts through:
- The signup form at `/auth/signin`
- Supabase dashboard
- Programmatically via Supabase API

---

## 🎯 **Testing the Authentication System**

### **Demo Mode (Development Only):**
- ✅ Works without Supabase setup
- ✅ Multiple test accounts available
- ✅ All authentication flows tested
- ✅ Protected routes working
- ✅ Loading states working
- ✅ Error handling working

### **Production Mode:**
- ✅ Requires Supabase setup
- ✅ Real user authentication
- ✅ Secure session management
- ✅ Production-ready security

---

## 🚀 **Quick Start Commands:**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test authentication flows
npm run test:auth

# Build for production
npm run build
```

---

## 📱 **Available Routes:**

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage |
| `/auth/signin` | Public | Sign in page |
| `/auth/test` | Public | Authentication testing page |
| `/dashboard` | Protected | User dashboard |
| `/orders` | Protected | Order management |
| `/ai-generation` | Protected | AI image generation |
| `/stock-search` | Public | Stock media search |
| `/admin` | Protected | Admin panel |

---

## 🔍 **Troubleshooting:**

### **Demo Login Not Working:**
- Ensure you're in development mode (`NODE_ENV=development`)
- Check browser console for errors
- Verify demo accounts are properly configured

### **Protected Routes Not Redirecting:**
- Check middleware configuration
- Verify authentication state
- Test with demo accounts first

### **Build Errors:**
- Run `npm run build` to check for issues
- Ensure all environment variables are set
- Check TypeScript compilation

---

## 📞 **Support:**

If you encounter any issues:
1. Check the test page at `/auth/test`
2. Review browser console for errors
3. Verify environment configuration
4. Test with demo accounts first

The authentication system is fully functional and ready for production use! 🎉

