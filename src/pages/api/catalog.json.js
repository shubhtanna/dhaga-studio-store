// Current prices and stock, fetched by the browser so a price change doesn't need a rebuild.
import { items } from '../../data/shop.js'

export function GET() {
  const rows = Object.fromEntries(items.map((i) => [i.sku, { price: i.price, mrp: i.mrp, stock: i.stock }]))
  return new Response(JSON.stringify({ currency: 'INR', items: rows }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
