# Intelligent Resume Enhancement System

An AI-powered platform that optimizes resumes for better performance in Applicant Tracking Systems (ATS). Upload your resume as a PDF, get detailed ATS analysis, and receive an AI-enhanced version optimized for better job application success.

## 🚀 Features

- **PDF Resume Upload**: Support for both digital and scanned PDF resumes
- **OCR Technology**: Extract text from scanned resume images using Tesseract.js
- **ATS Score Analysis**: Comprehensive scoring across keywords, formatting, readability, and structure
- **AI Enhancement**: Powered by OpenAI GPT and Google Gemini APIs
- **Real-time Processing**: Live progress tracking and instant results
- **Professional PDF Generation**: Download enhanced resumes in professional PDF format
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Privacy Focused**: No permanent storage of user data

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization for ATS scores
- **React Dropzone** - File upload interface
- **Lucide React** - Modern icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PDF Processing**: pdf-lib, Tesseract.js for OCR
- **AI Integration**: OpenAI GPT-3.5/4 and Google Gemini APIs
- **File Handling**: Formidable for multipart form data

### Deployment
- **Vercel** - Optimized for Next.js applications
- **Edge Functions** - Fast, globally distributed API responses

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- OpenAI API key and/or Google Gemini API key

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd intelligent-resume-enhancement-system
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### API Keys Setup

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and navigate to API keys
3. Generate a new API key
4. Add to your `.env.local` file

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Create a new project
3. Generate an API key
4. Add to your `.env.local` file

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT models | Optional* |
| `GEMINI_API_KEY` | Google Gemini API key | Optional* |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | No |
| `DATABASE_URL` | Database connection string | No |

*At least one AI API key is required

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── upload/        # Resume upload endpoint
│   │   ├── enhance/       # AI enhancement endpoint
│   │   └── generate-pdf/  # PDF generation endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── file-upload.tsx   # File upload component
│   ├── ats-score-display.tsx # ATS score visualization
│   ├── resume-enhancement-form.tsx # Enhancement form
│   └── results-display.tsx # Results page
├── lib/                  # Utility libraries
│   ├── pdf-processor.ts  # PDF processing logic
│   ├── ats-analyzer.ts   # ATS scoring algorithm
│   ├── ai-enhancer.ts    # AI enhancement logic
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
│   └── index.ts          # Main type definitions
└── public/               # Static assets
```

## 🔄 Workflow

1. **Resume Upload**: User uploads PDF resume
2. **Text Extraction**: Extract text using PDF parser or OCR
3. **ATS Analysis**: Analyze resume for ATS compatibility
4. **AI Enhancement**: Use AI to improve content and structure
5. **PDF Generation**: Create enhanced resume in PDF format
6. **Download**: User downloads optimized resume

## 🎯 ATS Scoring Algorithm

The system evaluates resumes across four key areas:

- **Keywords (25%)**: Industry-relevant terms and skills
- **Formatting (25%)**: Section structure and organization  
- **Readability (25%)**: Sentence structure and clarity
- **Structure (25%)**: Proper sections and chronological order

Each area is scored 0-100, with an overall weighted average.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Navigate to your project settings
   - Add environment variables from `.env.example`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploy to Other Platforms

The application can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify
- DigitalOcean App Platform

## 🔒 Security & Privacy

- **No Data Storage**: Resumes are processed in memory and not stored
- **Secure API Calls**: All AI API calls use secure HTTPS
- **Input Validation**: Comprehensive validation for file uploads
- **Rate Limiting**: Built-in protection against abuse
- **Error Handling**: Graceful error handling without data exposure

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 📈 Performance Optimization

- **Edge Functions**: Fast API responses using Vercel Edge Runtime
- **Image Optimization**: Automatic image optimization with Next.js
- **Code Splitting**: Automatic code splitting for faster loading
- **Caching**: Intelligent caching strategies for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🔮 Future Enhancements

- [ ] Multiple resume templates
- [ ] Job description matching
- [ ] LinkedIn profile optimization
- [ ] Cover letter generation
- [ ] Multi-language support
- [ ] Resume analytics dashboard
- [ ] Integration with job boards

---

**Built with ❤️ for better career outcomes**
