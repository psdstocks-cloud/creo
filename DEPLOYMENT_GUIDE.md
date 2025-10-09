# 🚀 Creo Deployment Guide

## 📋 **Admin User Credentials**

**Email:** `admin@creo.com`  
**Password:** `CreoAdmin2024!`

## 🔧 **Supabase Setup**

### 1. **Create Supabase Project:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API

### 2. **Run Admin Setup Script:**
```bash
# Set your Supabase credentials
export NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Run the admin setup script
node scripts/setup-supabase-admin.js
```

### 3. **Environment Variables for Vercel:**
Set these in your Vercel dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_NEHTW_API_KEY=your_nehtw_api_key_here
NEXT_PUBLIC_NEHTW_BASE_URL=https://nehtw.com/api
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 🚀 **Deployment Steps**

### 1. **Commit and Push to Git:**
```bash
git add .
git commit -m "Add Supabase admin user setup"
git push origin main
```

### 2. **Deploy to Vercel:**
1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy the application

### 3. **Verify Deployment:**
1. Visit your deployed app: `https://your-app.vercel.app`
2. Go to: `https://your-app.vercel.app/auth/signin`
3. Login with admin credentials
4. Access admin features at: `https://your-app.vercel.app/admin`

## 🔐 **Admin Access**

Once deployed, you can login with:
- **URL:** `https://your-app.vercel.app/auth/signin`
- **Email:** `admin@creo.com`
- **Password:** `CreoAdmin2024!`

## 📱 **Available Admin Features**

| Route | Description |
|-------|-------------|
| `/dashboard` | Main admin dashboard |
| `/admin` | Admin panel |
| `/orders` | Order management |
| `/ai-generation` | AI image generation |
| `/stock-search` | Stock media search |

## 🔒 **Security Notes**

- Admin user is created in Supabase Auth
- Credentials are production-ready
- User has full administrative privileges
- Keep credentials secure and private

## 🆘 **Troubleshooting**

### **Login Issues:**
1. Verify Supabase environment variables are set correctly
2. Check that the admin user was created in Supabase Auth
3. Ensure the app is deployed with correct environment variables

### **Deployment Issues:**
1. Check Vercel build logs for errors
2. Verify all environment variables are set
3. Ensure Supabase project is active

## 📞 **Support**

If you encounter any issues:
1. Check the deployment logs in Vercel
2. Verify Supabase project is working
3. Test with the admin credentials provided

The admin account is ready for production use! 🎉
