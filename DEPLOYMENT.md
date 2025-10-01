# Deployment Guide

This guide will help you deploy the Intelligent Resume Enhancement System to production.

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free tier available)
- OpenAI and/or Gemini API keys

### Step 1: Push to Repository
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Visit [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your repository
4. Configure environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `GEMINI_API_KEY`: Your Google Gemini API key
5. Click "Deploy"

### Step 3: Configure Domain (Optional)
1. Go to your project dashboard
2. Navigate to "Settings" → "Domains"
3. Add your custom domain

## 🔧 Environment Variables

Set these in your Vercel dashboard under Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes* |
| `GEMINI_API_KEY` | Your Gemini API key | Yes* |
| `NEXTAUTH_SECRET` | Random string for auth | No |

*At least one AI API key is required

## 🌐 Alternative Deployment Options

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in site settings

### Railway
1. Connect repository to Railway
2. Railway will auto-detect Next.js
3. Add environment variables in project settings
4. Deploy automatically on push

### DigitalOcean App Platform
1. Create new app from repository
2. Select Node.js environment
3. Set build command: `npm run build`
4. Set run command: `npm start`
5. Add environment variables

## 📊 Performance Monitoring

### Vercel Analytics
- Enable in project settings
- Monitor Core Web Vitals
- Track user interactions

### Error Monitoring
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Mixpanel for user analytics

## 🔒 Security Checklist

- [ ] API keys stored as environment variables
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] CORS configured properly
- [ ] File upload size limits set
- [ ] Rate limiting implemented
- [ ] Input validation in place

## 🚀 Production Optimizations

### Performance
- Enable Vercel Edge Functions
- Configure caching headers
- Optimize images with Next.js Image component
- Enable compression

### Monitoring
```bash
# Add to package.json
"scripts": {
  "analyze": "cross-env ANALYZE=true next build",
  "start:prod": "next start -p $PORT"
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🐛 Troubleshooting

### Common Issues

**Build Failures**
- Check Node.js version (18+ required)
- Verify all dependencies are installed
- Check TypeScript errors

**API Errors**
- Verify API keys are set correctly
- Check API rate limits
- Monitor function timeout limits

**File Upload Issues**
- Verify file size limits (10MB default)
- Check CORS configuration
- Ensure proper content-type handling

### Debug Commands
```bash
# Check build locally
npm run build

# Type checking
npm run type-check

# Lint code
npm run lint

# Start production server locally
npm run start
```

## 📈 Scaling Considerations

### Database Integration
For user data persistence:
```bash
npm install prisma @prisma/client
```

### Caching
- Redis for session storage
- CDN for static assets
- Database query caching

### Load Balancing
- Multiple Vercel regions
- Edge functions for global distribution
- Database read replicas

## 🔄 Updates & Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit

# Check for outdated packages
npm outdated
```

### Monitoring
- Set up uptime monitoring
- Monitor API usage and costs
- Track error rates and performance

---

**Need help?** Check the main README.md or create an issue in the repository.
