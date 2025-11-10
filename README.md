# 🚀 Inxora Studio — Launch Countdown

> A beautiful, interactive countdown website for the Inxora Studio launch. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

![Inxora Countdown](./preview.png)

## ✨ Features

- 🎯 **Accurate Countdown** — Real-time countdown to January 1st, 00:00 in user's local timezone
- 🎨 **Beautiful Design** — Dark theme with purple/blue accent colors matching Inxora branding
- ✨ **Smooth Animations** — Framer Motion micro-interactions and digit flip animations
- 🖱️ **Blob Custom Cursor** — Interactive blob cursor with mix-blend-mode effect (desktop only)
- ♿ **Accessible** — WCAG AA compliant with keyboard navigation and reduced-motion support
- 📱 **Responsive** — Mobile-first design that works on all screen sizes
- ⚡ **Performance** — Optimized bundle size and smooth 60fps animations
- 🎛️ **Configurable** — Easy feature toggles via environment variables

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion 11
- **Icons:** Lucide React
- **Date Utils:** date-fns 4.1
- **Fonts:** Inter (UI), Plus Jakarta Sans (Display), JetBrains Mono (Countdown)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/inxora-countdown.git
   cd inxora-countdown
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🎮 Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Feature Toggles
VITE_SHOW_CURSOR=true           # Enable/disable custom cursor
VITE_ENABLE_GSAP=false          # Enable/disable GSAP (not implemented)
VITE_ENABLE_LENIS=false         # Enable/disable Lenis (not implemented)

# Countdown Target (optional)
# VITE_TARGET_DATE=2026-01-01T00:00:00
```

### Changing the Target Date

By default, the countdown targets **January 1st, 00:00** of the next year in the user's local timezone.

**Option 1: Environment Variable**
```bash
VITE_TARGET_DATE=2026-06-15T12:00:00
```

**Option 2: Modify Hook Default** (in `src/hooks/useCountdown.ts`)
```typescript
const getTargetDate = useCallback(() => {
  if (options.targetDate) {
    return new Date(options.targetDate)
  }
  
  // Custom default date
  return new Date('2026-06-15T12:00:00')
}, [options.targetDate])
```

**Option 3: Pass to Component** (in `src/App.tsx`)
```tsx
<Countdown targetDate="2026-06-15T12:00:00" />
```

### Customizing Theme Colors

Edit `src/index.css` to change the color scheme:

```css
:root {
  --primary: 262.1 83.3% 57.8%;        /* Purple accent */
  --background: 224 71.4% 4.1%;        /* Dark background */
  --foreground: 210 20% 98%;           /* Light text */
  /* ... more colors */
}
```

### Disabling Custom Cursor

Set in `.env`:
```bash
VITE_SHOW_CURSOR=false
```

### Customizing Blob Cursor

Edit `src/App.tsx` to customize cursor properties:
```tsx
<CustomCursor 
  size={32}                    // Cursor size in pixels
  blur={0}                     // Backdrop blur effect
  hideDefaultCursor={true}     // Hide system cursor
  disabled={!showCursor}       // Disable cursor
/>
```

The blob cursor features:
- **Mix-blend-mode:** Inverts colors underneath for visibility
- **Spring physics:** Smooth, bouncy cursor movement
- **Interactive scaling:** Grows on hover, shrinks on click
- **Auto-hide:** Fades out when mouse leaves window
- **Mobile-aware:** Automatically disabled on screens < 768px
- **Accessibility:** Respects `prefers-reduced-motion`

## 📁 Project Structure

```
inxora-countdown/
├── public/              # Static assets
├── src/
│   ├── components/
│   │   ├── ui/          # UI components (Button, Badge)
│   │   ├── Countdown.tsx
│   │   ├── TimeUnit.tsx
│   │   └── CustomCursor.tsx
│   ├── hooks/
│   │   ├── useCountdown.ts
│   │   └── usePrefersReducedMotion.ts
│   ├── lib/
│   │   └── utils.ts     # Utility functions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables (local)
├── .env.example         # Environment template
├── tailwind.config.ts   # Tailwind configuration
├── vite.config.ts       # Vite configuration
└── package.json
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Web Hosting

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the contents of `dist/` folder to your web hosting

3. Configure your web server:
   - Point document root to the `dist/` folder
   - Enable gzip compression for `.js` and `.css` files
   - Set cache headers for static assets
   - Configure custom domain (e.g., `launch.inxora.studio`)

### Recommended Server Configuration

**Apache (.htaccess):**
```apache
# Enable gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Redirect to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**Nginx:**
```nginx
server {
  listen 80;
  server_name launch.inxora.studio;
  root /path/to/dist;
  index index.html;

  # Gzip compression
  gzip on;
  gzip_types text/css application/javascript;

  # Cache static assets
  location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # SPA routing
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Environment Variables

If your hosting supports environment variables, set them in your hosting control panel. Otherwise, you can modify `vite.config.ts` to use build-time variables.

## ♿ Accessibility Features

- ✅ WCAG AA contrast ratios
- ✅ Keyboard navigation support
- ✅ Focus states with visible outlines
- ✅ ARIA labels for interactive elements
- ✅ Respects `prefers-reduced-motion`
- ✅ Semantic HTML structure
- ✅ Screen reader friendly

## 🎨 Design System

### Typography

- **Display:** Plus Jakarta Sans (Headlines)
- **Body:** Inter (UI Text)
- **Monospace:** JetBrains Mono (Countdown Numbers)

### Color Palette

| Color | HSL | Usage |
|-------|-----|-------|
| Primary | `262.1 83.3% 57.8%` | Accent, CTAs, Highlights |
| Background | `224 71.4% 4.1%` | Page background |
| Foreground | `210 20% 98%` | Main text color |
| Muted | `215 27.9% 16.9%` | Secondary backgrounds |
| Border | `215 27.9% 16.9%` | Borders, dividers |

### Spacing & Layout

- Mobile-first responsive design
- Container max-width: 1280px
- Grid gap: 4px (mobile) → 8px (desktop)

## 🐛 Troubleshooting

**Custom cursor not showing:**
- Check `VITE_SHOW_CURSOR=true` in `.env`
- Custom cursor is disabled on mobile (<768px)
- Check browser console for errors

**Countdown showing wrong time:**
- Countdown uses user's local timezone by default
- To use specific timezone, pass ISO 8601 date string with timezone

**Build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📝 License

MIT License - feel free to use this project for your own countdown pages!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, reach out to:
- Website: [inxora.studio](https://inxora.studio)
- Email: hello@inxora.studio

---

Made with ❤️ by Inxora Studio
```
