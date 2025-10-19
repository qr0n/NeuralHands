# Deployment Fix - Environment Variables

## Issue
The app was making requests to `localhost` instead of the deployed domain `https://neuralhands.ir0n.xyz`, causing API calls to fail in production.

## Changes Made

### 1. Updated `.env.local`
```bash
NEXT_PUBLIC_API_URL=https://neuralhands.ir0n.xyz
NEXT_PUBLIC_API_BASE=https://neuralhands.ir0n.xyz
```

Both variables are set to support different parts of the codebase.

### 2. Updated `src/lib/api-client.ts`
- Now supports both `NEXT_PUBLIC_API_BASE` and `NEXT_PUBLIC_API_URL`
- Provides better error messages if environment variables are missing

### 3. Updated `src/components/pages/TranslatorPage.tsx`
- Changed fallback URL from `http://neuralhands.ir0n.xyz:8000` to `https://neuralhands.ir0n.xyz`
- Uses HTTPS for production deployment

### 4. Updated `.env.example`
- Synchronized with actual environment variable usage
- Added clear documentation for both production and development setups

## How Environment Variables Work

### In Production (Vercel/Netlify/etc.)
1. Set environment variables in your hosting platform's dashboard:
   - `NEXT_PUBLIC_API_URL=https://neuralhands.ir0n.xyz`
   - `NEXT_PUBLIC_API_BASE=https://neuralhands.ir0n.xyz`

2. The `.env.local` file is **NOT** deployed (it's in `.gitignore`)

3. The hosting platform injects these variables during build time

### In Development
1. Use `.env.local` file (already configured)
2. For local backend development, change to:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_API_BASE=http://localhost:8000
   ```

## Backend API Endpoints

Your app makes requests to these endpoints:

1. **Authentication** (using relative paths - ✅ works correctly):
   - `/api/auth/session`
   - `/api/auth/login`
   - `/api/auth/register`
   - `/api/auth/logout`

2. **Gemini Analysis** (using environment variables):
   - `${NEXT_PUBLIC_API_URL}/analyze`

## Next Steps for Deployment

### If you're using Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - `NEXT_PUBLIC_API_URL` = `https://neuralhands.ir0n.xyz`
   - `NEXT_PUBLIC_API_BASE` = `https://neuralhands.ir0n.xyz`
4. Redeploy your application

### If you're using other hosting:
- Make sure to set the environment variables in your platform's settings
- Redeploy after setting the variables

### If you have a separate backend server:
If your backend API is running on a different domain (e.g., `https://api.neuralhands.ir0n.xyz`), update the environment variables:
```bash
NEXT_PUBLIC_API_URL=https://api.neuralhands.ir0n.xyz
NEXT_PUBLIC_API_BASE=https://api.neuralhands.ir0n.xyz
```

## Testing

After redeploying:
1. Open browser console (F12)
2. Try the Translator/ASL features
3. Check Network tab - requests should go to `https://neuralhands.ir0n.xyz` instead of `localhost`
4. Verify no CORS errors

## Verification Checklist

- [ ] Environment variables set in hosting platform
- [ ] Application redeployed
- [ ] Browser console shows no localhost errors
- [ ] API requests go to correct domain
- [ ] Authentication works
- [ ] Gemini analysis works (if backend is running)

## Important Notes

- ⚠️ **Don't commit `.env.local`** - it's already in `.gitignore`
- ✅ **Do commit `.env.example`** - it's the template for others
- 🔐 **Never commit sensitive API keys** in environment files
- 🌐 **Always use HTTPS in production** for security

## Rollback

If you need to rollback, the changes are minimal:
1. Revert the environment variables in your hosting platform
2. The code now has proper fallbacks that point to your production domain
