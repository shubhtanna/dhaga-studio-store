// The bag, live prices and the order hand-off all run in the browser.
const BAG_KEY = 'dhaga:bag'

export const rupees = (n) => '₹' + Number(n).toLocaleString('en-IN')

export function getBag() {
  try {
    return JSON.parse(localStorage.getItem(BAG_KEY)) || {}
  } catch {
    return {}
  }
}

export function saveBag(bag) {
  localStorage.setItem(BAG_KEY, JSON.stringify(bag))
  showCount()
}

export function showCount() {
  const total = Object.values(getBag()).reduce((a, b) => a + b, 0)
  document.querySelectorAll('[data-bag-count]').forEach((el) => {
    el.textContent = total
    el.classList.toggle('on', total > 0)
  })
}

let catalogRequest
export function loadCatalog() {
  catalogRequest ||= fetch('/api/catalog.json')
    .then((r) => r.json())
    .then((d) => d.items)
  return catalogRequest
}

// Prices and stock are not in the page: every tile asks for them here.
export async function fillCosts() {
  const slots = document.querySelectorAll('[data-cost]')
  if (!slots.length) return
  const live = await loadCatalog()
  slots.forEach((el) => {
    const row = live[el.dataset.cost]
    if (!row) return
    const saving = row.mrp > row.price ? Math.round((1 - row.price / row.mrp) * 100) : 0
    el.innerHTML = `<b>${rupees(row.price)}</b>` + (saving ? ` <s>${rupees(row.mrp)}</s> <i>${saving}% off</i>` : '')
  })
  document.querySelectorAll('[data-stock]').forEach((el) => {
    const row = live[el.dataset.stock]
    if (!row) return
    if (row.stock === 0) {
      el.textContent = 'Sold out for now'
      el.classList.add('none')
      document.querySelectorAll(`[data-add="${el.dataset.stock}"]`).forEach((b) => (b.disabled = true))
    } else if (row.stock <= 5) {
      el.textContent = `Only ${row.stock} left`
    }
  })
}

export function bindAddButtons() {
  document.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sku = btn.dataset.add
      const qtyBox = document.getElementById('qty')
      const qty = qtyBox ? Math.max(1, Math.min(5, Number(qtyBox.value) || 1)) : 1
      const bag = getBag()
      bag[sku] = Math.min(5, (bag[sku] || 0) + qty)
      saveBag(bag)
      const label = btn.textContent
      btn.textContent = 'In your bag ✓'
      setTimeout(() => (btn.textContent = label), 1500)
    })
  })
}
