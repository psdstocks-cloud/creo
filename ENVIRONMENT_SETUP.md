# 🚀 Creo Production Environment Setup Guide

This guide will help you set up the production environment for the Creo SaaS platform with virtual payments for testing.

## 📋 Required Environment Variables

### **Supabase Configuration**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **NEHTW API Configuration**
```env
NEXT_PUBLIC_NEHTW_API_KEY=your_nehtw_api_key
NEXT_PUBLIC_NEHTW_BASE_URL=https://nehtw.com/api
```

### **Virtual Payment System (Development)**
```env
# Virtual payment system for testing (no real Stripe keys needed)
NEXT_PUBLIC_VIRTUAL_PAYMENTS=true
NEXT_PUBLIC_PAYMENT_SUCCESS_RATE=0.9
```

### **Optional: Real Stripe Integration (Future)**
```env
# Uncomment when ready for real payments
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🛠️ Setup Instructions

### **Step 1: Supabase Setup**

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Configure Authentication:**
   - Enable email authentication
   - Set up email templates
   - Configure redirect URLs

3. **Set up Database Tables:**
   ```sql
   -- Users table (extends Supabase auth.users)
   CREATE TABLE public.user_profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     full_name TEXT,
     avatar_url TEXT,
     credits DECIMAL(10,2) DEFAULT 0.00,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Orders table
   CREATE TABLE public.orders (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     type TEXT NOT NULL, -- 'stock' or 'ai'
     status TEXT NOT NULL DEFAULT 'processing',
     task_id TEXT,
     job_id TEXT,
     cost DECIMAL(10,2),
     metadata JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Payments table
   CREATE TABLE public.payments (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     currency TEXT DEFAULT 'USD',
     status TEXT NOT NULL,
     payment_intent_id TEXT,
     credits_added DECIMAL(10,2),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### **Step 2: NEHTW API Setup**

1. **Get NEHTW API Key:**
   - Contact NEHTW for API access
   - Obtain your API key and base URL

2. **Test API Connection:**
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        "https://nehtw.com/api/stocksites"
   ```

### **Step 3: Vercel Deployment**

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel link
   ```

2. **Set Environment Variables in Vercel:**
   - Go to your project dashboard
   - Navigate to Settings > Environment Variables
   - Add all required variables

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## 🔧 Development vs Production

### **Development Mode**
- Uses virtual payment system
- Demo accounts available
- Local Supabase instance (optional)
- Mock NEHTW responses (optional)

### **Production Mode**
- Real Supabase authentication
- Real NEHTW API integration
- Virtual payments (for testing) or Stripe (for real payments)
- Error monitoring and logging

## 🧪 Testing the Setup

### **1. Test Authentication**
```bash
# Visit your deployed URL
# Try signing up with a test email
# Check Supabase dashboard for new user
```

### **2. Test NEHTW Integration**
```bash
# Go to /stock-search
# Try searching for stock media
# Check browser network tab for API calls
```

### **3. Test Virtual Payments**
```bash
# Go to /billing
# Try purchasing credits
# Check for success/error notifications
```

## 🚨 Troubleshooting

### **Common Issues:**

1. **Supabase Connection Failed**
   - Check URL format: `https://xxx.supabase.co`
   - Verify anon key is correct
   - Check CORS settings

2. **NEHTW API Errors**
   - Verify API key is valid
   - Check rate limiting (2s between requests)
   - Ensure base URL is correct

3. **Build Failures**
   - Check all environment variables are set
   - Verify TypeScript compilation
   - Check for missing dependencies

### **Debug Commands:**
```bash
# Check environment variables
vercel env ls

# View build logs
vercel logs

# Test locally with production env
vercel dev
```

## 📊 Monitoring & Analytics

### **Recommended Tools:**
- **Vercel Analytics** - Built-in performance monitoring
- **Sentry** - Error tracking and performance monitoring
- **Supabase Dashboard** - Database and auth monitoring
- **NEHTW Dashboard** - API usage monitoring

## 🔐 Security Checklist

- [ ] Environment variables are properly secured
- [ ] Supabase RLS policies are configured
- [ ] API keys are not exposed in client code
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Error messages don't leak sensitive info

## 📈 Performance Optimization

### **Vercel Optimizations:**
- Enable Edge Functions for API routes
- Use Image Optimization for media
- Implement proper caching strategies
- Monitor Core Web Vitals

### **Database Optimizations:**
- Add proper indexes
- Use connection pooling
- Implement query optimization
- Set up database backups

## 🎯 Next Steps

1. **Set up monitoring and alerting**
2. **Implement real Stripe payments**
3. **Add user analytics**
4. **Set up automated backups**
5. **Implement CI/CD pipeline**

---

**Need Help?** Check the troubleshooting section or contact the development team.