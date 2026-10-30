import catalog from './catalog.json'

export const COLLECTIONS = [
  { slug: 'scarves', name: 'Scarves', blurb: 'Block-printed and tie-dyed, light for every season.' },
  { slug: 'shawls', name: 'Shawls & wraps', blurb: 'Warm weaves from the Himalayas to Bengal.' },
  { slug: 'dupattas', name: 'Dupattas', blurb: 'Ikat, Chanderi and Banarasi for occasions.' },
  { slug: 'stoles', name: 'Stoles', blurb: 'Everyday khadi, silk and kalamkari.' },
  { slug: 'home', name: 'Home textiles', blurb: 'Runners, cushions, rugs and throws.' },
]

export const DELIVERY = { freeFrom: 999, fee: 79 }

export const items = catalog
export const findItem = (slug) => items.find((i) => i.slug === slug)
export const inCollection = (slug) => items.filter((i) => i.collection === slug)
export const collectionName = (slug) => COLLECTIONS.find((c) => c.slug === slug)?.name ?? slug
export const PATTERNS = { scarves: 'stripes', shawls: 'checks', dupattas: 'diamonds', stoles: 'dots', home: 'lines' }
