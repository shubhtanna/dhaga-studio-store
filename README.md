# Dhaga Studio

Online storefront for Dhaga Studio, a handloom studio in Jaipur that sends scarves, shawls, dupattas and home textiles across India.

Built with [Astro](https://astro.build) as a static site. Pages are generated from `src/data/catalog.json`. Prices and stock are not in the HTML: every page asks `/api/catalog.json` for them in the browser. The bag and checkout also run in the browser.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

A demo store built for testing [AgentReady](https://github.com/Nisarg004/Agent_Ready). No real orders, payments or deliveries.
