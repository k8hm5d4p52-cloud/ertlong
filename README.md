# ERTLONG - Streetwear E-Commerce

A dark-themed streetwear dropshipping store with live inventory, inspired by Mvtgats.com.

## Features

- 🛍️ Product catalog with live inventory status (In Stock / Restocking / Discontinued)
- 🛒 Full shopping cart with size/color selection
- 📱 Mobile-first, fully responsive design
- 💬 WhatsApp checkout flow
- 💳 PayPal / Crypto / Alipay payment integration
- ✈️ 12-15 day worldwide shipping
- 🔒 QC photo verification before shipping

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide React** (icons)
- **PayPal React SDK**

## Getting Started

### 1. Install dependencies

```bash
cd ertlong
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Build for production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Free)

1. Push this folder to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the repo
4. Deploy — zero config needed

### Deploy to Netlify (Free)

1. Push to GitHub
2. Connect at [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`

## Configuration

### WhatsApp Number

Edit `src/app/cart/page.tsx` — replace `12345678900` with your WhatsApp number (no + or spaces).

### Products

Edit `src/data/products.ts` to add/remove products.

### Domain

Update `NEXT_PUBLIC_SITE_URL` in your environment variables.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   ├── globals.css      # Global styles
│   ├── products/
│   │   ├── page.tsx    # All products
│   │   └── [id]/page.tsx # Product detail
│   └── cart/page.tsx    # Cart + checkout
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   └── ProductGrid.tsx
├── context/
│   └── CartContext.tsx  # Cart state management
├── data/
│   └── products.ts      # Product catalog
└── types/
    └── index.ts         # TypeScript types
```
