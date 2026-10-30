# Dhaga Studio

Online storefront for Dhaga Studio, an independent handloom studio in Jaipur that ships across India.

Built with [Astro](https://astro.build) as a static site. Product pages are generated at build time from
`src/data/products.json`; live prices and stock come from `/api/prices.json` and are filled in by the
browser, so a sale doesn't need a full rebuild. The bag and checkout run in the browser.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

Demo store built for testing [AgentReady](https://github.com/Nisarg004/Agent_Ready). No real orders, payments or deliveries.
