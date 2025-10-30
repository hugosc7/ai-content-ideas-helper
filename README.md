# AI Content Ideas Helper

A serverless React webapp that generates high-engaging content ideas using OpenAI's API. Designed for easy WordPress deployment with a custom dark theme and gradient branding.

## Features

- **AI-Powered Content Generation**: Generate 15 high-engaging content ideas based on your business context
- **Bookmarking System**: Save your favorite ideas in organized groups
- **Export Options**: Download ideas as TXT files
- **Iterative Feedback**: Generate more ideas based on your preferences
- **Responsive Design**: Mobile-first design that works on all devices
- **WordPress Ready**: Easy deployment to WordPress sites
- **SEO Optimized**: Built with SEO best practices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom color scheme
- **Backend**: Cloudflare Workers (serverless function)
- **API**: OpenAI GPT-4 for content generation

## Color Scheme

- Background: `#0B0113` (dark purple)
- Main text: White
- Accent colors: `#FECE00` (yellow), `#D16A97` (pink)
- Brand gradient: `linear-gradient(90deg, #FECE00 0%, #F44C0A 50%, #F23DBE 100%)`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Cloudflare Worker

1. Deploy the Cloudflare Worker:
   ```bash
   cd cloudflare-worker
   npx wrangler deploy
   ```

2. Add your OpenAI API key as a secret:
   ```bash
   npx wrangler secret put OPENAI_API_KEY
   ```

3. Update the worker URL in `src/utils/api.ts`:
   ```typescript
   const CLOUDFLARE_WORKER_URL = 'https://your-worker.your-subdomain.workers.dev';
   ```

### 3. Build for Production

```bash
npm run build
```

This creates a `dist` folder with all the necessary files.

### 4. Deploy to WordPress

1. Upload the entire `dist` folder to your WordPress site:
   ```
   wp-content/uploads/tools/ai-content-ideas-helper/
   ```

2. Embed in your WordPress page/post using an iframe:
   ```html
   <iframe 
     src="/wp-content/uploads/tools/ai-content-ideas-helper/wordpress-embed.html" 
     width="100%" 
     height="800" 
     frameborder="0"
     style="border: none; border-radius: 8px;">
   </iframe>
   ```

3. Or use the shortcode (if you create a custom plugin):
   ```php
   [ai_content_ideas]
   ```

## File Structure

```
ai-content-ideas-helper/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── cloudflare-worker/      # Serverless backend
├── dist/                   # Built files for WordPress
├── wordpress-embed.html    # WordPress iframe wrapper
└── README.md
```

## Customization

### Colors
Update the color scheme in `tailwind.config.js`:

```javascript
colors: {
  'bg-primary': '#0B0113',
  'accent-yellow': '#FECE00',
  'accent-pink': '#D16A97',
  // ... add your colors
}
```

### Content Strategy
Modify the system prompt in `cloudflare-worker/index.js` to customize the AI's content generation approach.

### Styling
All styles are in `src/index.css` using Tailwind CSS. The app is fully responsive and optimized for WordPress embedding.

## Security

- API key is stored securely in Cloudflare Workers environment
- CORS is configured for your WordPress domain
- Input validation and sanitization included
- No sensitive data stored in the frontend

## Performance

- Optimized bundle size with code splitting
- Lazy loading for better performance
- Critical CSS inlined for faster loading
- Mobile-first responsive design

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use and modify for your projects.

## Support

For issues or questions, please check the code comments or create an issue in your repository.
