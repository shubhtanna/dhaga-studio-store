// Prices, cart and checkout run in the browser.
const CART_KEY = 'ds_cart_v1'
const inr = (n) => '₹' + Number(n).toLocaleString('en-IN')

export function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch {
    return []
  }
}

export function writeCart(lines) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines))
  updateCount()
}

export function updateCount() {
  const n = readCart().reduce((s, l) => s + l.qty, 0)
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = n
    el.hidden = n === 0
  })
}

let pricesPromise
export function loadPrices() {
  pricesPromise ||= fetch('/api/prices.json').then((r) => r.json()).then((d) => d.prices)
  return pricesPromise
}

// Fill every price slot on the page from the live price list.
export async function paintPrices() {
  const slots = document.querySelectorAll('[data-price-sku]')
  if (!slots.length) return
  const prices = await loadPrices()
  slots.forEach((el) => {
    const p = prices[el.dataset.priceSku]
    if (!p) return
    const off = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0
    el.innerHTML = `<span class="now">${inr(p.price)}</span>` + (off ? ` <s>${inr(p.mrp)}</s> <span class="off">${off}% off</span>` : '')
    el.classList.remove('loading')
  })
  document.querySelectorAll('[data-stock-sku]').forEach((el) => {
    const p = prices[el.dataset.stockSku]
    if (p && p.stock === 0) {
      el.textContent = 'Out of stock'
      el.classList.add('out')
      document.querySelectorAll(`[data-add="${el.dataset.stockSku}"]`).forEach((b) => (b.disabled = true))
    }
  })
}

export function wireAddButtons() {
  document.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sku = btn.dataset.add
      const lines = readCart()
      const line = lines.find((l) => l.sku === sku)
      if (line) line.qty = Math.min(5, line.qty + 1)
      else lines.push({ sku, qty: 1 })
      writeCart(lines)
      const label = btn.textContent
      btn.textContent = 'Added ✓'
      setTimeout(() => (btn.textContent = label), 1400)
    })
  })
}

export { inr }
