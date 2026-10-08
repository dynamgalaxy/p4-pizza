# P4 Pizza & Fast Food

Next.js App Router website with TypeScript and Tailwind CSS.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. Use `npm run build` for the production build.

## Edit

- Products, categories, variants, and prices: `lib/menu.ts`
- WhatsApp ordering number: `lib/config.ts`
- Temporary food photos: replace the files in `public/images/`
- Colors and layout: `app/globals.css`

Cart contents are stored in the visitor's browser. Checkout opens a prepared WhatsApp message; it does not take payment.
