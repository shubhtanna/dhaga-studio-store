// Live prices and stock. Pages fetch this in the browser, so a sale or a sold-out
// title shows up without rebuilding every item page.
import { allProducts } from '../../data/store.js'

export function GET() {
  const prices = Object.fromEntries(allProducts.map((b) => [b.sku, { price: b.price, mrp: b.mrp, stock: b.stock }]))
  return new Response(JSON.stringify({ currency: 'INR', updated: new Date().toISOString(), prices }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
