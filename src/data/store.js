import products from './products.json'

export const CATEGORIES = [
  { slug: 'scarves', name: 'Scarves', blurb: 'Block-printed and tie-dyed, light for every season' },
  { slug: 'shawls', name: 'Shawls & wraps', blurb: 'Warm weaves from the Himalayas to Bengal' },
  { slug: 'dupattas', name: 'Dupattas', blurb: 'Ikat, Chanderi and Banarasi for occasions' },
  { slug: 'stoles', name: 'Stoles', blurb: 'Everyday khadi, silk and kalamkari' },
  { slug: 'home', name: 'Home textiles', blurb: 'Runners, cushions, rugs and throws' },
]

export const FREE_SHIPPING_FROM = 999
export const SHIPPING_FEE = 79

export const allProducts = products
export const bySlug = (slug) => products.find((p) => p.slug === slug)
export const inCategory = (slug) => products.filter((p) => p.category === slug)
export const categoryName = (slug) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug
