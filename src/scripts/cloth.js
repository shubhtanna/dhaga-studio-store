// Draws a product as a folded piece of cloth (inline SVG), with a weave that matches its craft.
// Used both at build time (Astro) and in the browser (search, bag), so it must stay plain JS.

const PAPER = '#efe7da'
const SHADE = '#1f1b16'
const GOLD = '#c4a052'

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * t).toString(16).padStart(2, '0')).join('')

const WEAVE_BY_NAME = [
  ['block-print', 'buti'], ['bandhani', 'dots'], ['ajrakh', 'diamond'], ['leheriya', 'waves'],
  ['ikat', 'ikat'], ['kantha', 'kantha'], ['wool', 'check'], ['chanderi', 'zari'], ['banarasi', 'zari'],
  ['phulkari', 'flower'], ['jamdani', 'buti'], ['kalamkari', 'vine'], ['runner', 'bands'], ['dhurrie', 'bands'],
]
export const weaveOf = (slug) => (WEAVE_BY_NAME.find(([k]) => slug.includes(k)) || [, 'slub'])[1]

function weave(kind, c) {
  const { base, light, dark } = c
  const r = (x, y, w, h, f, o = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" opacity="${o}"/>`
  switch (kind) {
    case 'buti': return [28, 28, r(0, 0, 28, 28, base) +
      [[14, 9.5], [18.5, 14], [14, 18.5], [9.5, 14]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${light}"/>`).join('') +
      `<circle cx="14" cy="14" r="2" fill="${GOLD}"/>` + [[0, 0], [28, 0], [0, 28], [28, 28]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="${light}" opacity=".7"/>`).join('')]
    case 'dots': return [12, 12, r(0, 0, 12, 12, base) + `<circle cx="3" cy="3" r="1.5" fill="${light}"/><circle cx="9" cy="9" r="1.5" fill="${light}"/><circle cx="9" cy="3" r=".7" fill="${light}" opacity=".6"/>`]
    case 'diamond': return [32, 32, r(0, 0, 32, 32, base) + `<polygon points="16,3 29,16 16,29 3,16" fill="${dark}"/><polygon points="16,10 22,16 16,22 10,16" fill="${light}"/>` +
      [[0, 0], [32, 0], [0, 32], [32, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="${light}"/>`).join('')]
    case 'waves': return [18, 18, r(0, 0, 18, 18, base) + r(0, 0, 5, 18, light, 0.9) + r(10, 0, 2, 18, dark, 0.6), 'rotate(32)']
    case 'ikat': return [40, 26, r(0, 0, 40, 26, base) + `<polygon points="20,2 37,13 20,24 3,13" fill="${light}"/><polygon points="20,8 28,13 20,18 12,13" fill="${dark}"/>` +
      r(1, 12, 4, 2, light) + r(35, 12, 4, 2, light) + r(18, 0, 4, 2, light, 0.6)]
    case 'kantha': return [22, 10, r(0, 0, 22, 10, base) + `<path d="M1 5h6M11 5h6" stroke="${light}" stroke-width="1.3" stroke-linecap="round"/>`]
    case 'check': return [44, 44, r(0, 0, 44, 44, base) + r(0, 0, 44, 8, dark, 0.45) + r(0, 0, 8, 44, dark, 0.45) + r(0, 24, 44, 1.5, light, 0.8) + r(24, 0, 1.5, 44, light, 0.8)]
    case 'zari': return [30, 30, r(0, 0, 30, 30, base) + `<polygon points="15,11 19,15 15,19 11,15" fill="${GOLD}"/><circle cx="0" cy="0" r="1.2" fill="${GOLD}"/><circle cx="30" cy="0" r="1.2" fill="${GOLD}"/><circle cx="0" cy="30" r="1.2" fill="${GOLD}"/><circle cx="30" cy="30" r="1.2" fill="${GOLD}"/>`]
    case 'flower': return [30, 30, r(0, 0, 30, 30, base) + `<polygon points="15,5 17.5,12.5 25,15 17.5,17.5 15,25 12.5,17.5 5,15 12.5,12.5" fill="${GOLD}"/><circle cx="15" cy="15" r="2" fill="${light}"/>`]
    case 'vine': return [40, 28, r(0, 0, 40, 28, base) + `<path d="M0 18 Q10 6 20 18 T40 18" stroke="${light}" stroke-width="1.6" fill="none"/><circle cx="10" cy="11" r="2.4" fill="${dark}"/><circle cx="30" cy="22" r="2.4" fill="${GOLD}"/>`]
    case 'bands': return [60, 60, r(0, 0, 60, 60, base) + r(0, 0, 60, 9, light, 0.85) + r(0, 22, 60, 3, dark, 0.7) + r(0, 36, 60, 12, GOLD, 0.45)]
    default: return [30, 10, r(0, 0, 30, 10, base) + r(0, 3, 18, 0.8, light, 0.5) + r(10, 7, 20, 0.8, dark, 0.25)]
  }
}

let counter = 0

export function clothSvg(item, { label = true } = {}) {
  const id = `w${++counter}${item.slug.replace(/[^a-z]/g, '').slice(0, 6)}`
  const tone = mix(item.tone, '#857a68', 0.2)
  const c = { base: tone, light: mix(tone, PAPER, 0.72), dark: mix(tone, SHADE, 0.38) }
  const bg = mix(item.tone, PAPER, 0.9)
  const [w, h, body, turn] = weave(weaveOf(item.slug), c)
  const defs = `<defs>
    <pattern id="${id}p" width="${w}" height="${h}" patternUnits="userSpaceOnUse"${turn ? ` patternTransform="${turn}"` : ''}>${body}</pattern>
    <pattern id="${id}t" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0H4M0 0V4" stroke="#000" stroke-opacity=".07" stroke-width=".6"/></pattern>
    <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".24"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
    <radialGradient id="${id}r" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient>
    <filter id="${id}b" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="${id}c" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="4"/></filter>
  </defs>`
  const fill = (shape) => [`url(#${id}p)`, `url(#${id}t)`, `url(#${id}s)`].map((f) => shape(f)).join('')

  let art
  if (item.slug.includes('cushion')) {
    const d = 'M112 136 Q200 118 288 136 Q306 238 288 340 Q200 358 112 340 Q94 238 112 136Z'
    art = `<ellipse cx="200" cy="372" rx="120" ry="14" fill="${SHADE}" opacity=".2" filter="url(#${id}b)"/>
      <path d="${d}" fill="url(#${id}p)"/><path d="${d}" fill="url(#${id}t)"/><path d="${d}" fill="url(#${id}r)"/>
      <path d="${d}" fill="none" stroke="${c.dark}" stroke-width="3" opacity=".55"/>`
  } else {
    const fold = (x, y, fw, fh) => `<g transform="translate(${x} ${y})">
      ${fill((f) => `<rect width="${fw}" height="${fh}" rx="10" fill="${f}"/>`)}
      <path d="M${fw - 16} 2 Q${fw} 2 ${fw} 18 V${fh - 18} Q${fw} ${fh - 2} ${fw - 16} ${fh - 2} Z" fill="#000" opacity=".1"/>
      <rect x="8" y="1" width="${fw - 28}" height="3" rx="1.5" fill="#fff" opacity=".35"/></g>`
    const under = (x, y, fw) => `<rect x="${x + 8}" y="${y - 6}" width="${fw - 16}" height="12" rx="6" fill="${SHADE}" opacity=".22" filter="url(#${id}c)"/>`
    const fringe = ['scarves', 'shawls', 'dupattas', 'stoles'].includes(item.collection) || item.slug.includes('dhurrie')
      ? Array.from({ length: 13 }, (_, i) => `<path d="M${74 + i * 6} 384 q${(i % 3) - 1} 9 ${(i % 2) * 2 - 1} 18" stroke="${c.dark}" stroke-width="1.6" stroke-linecap="round" fill="none"/>`).join('')
      : ''
    art = `<ellipse cx="200" cy="396" rx="165" ry="15" fill="${SHADE}" opacity=".2" filter="url(#${id}b)"/>
      ${fold(56, 290, 288, 96)}${fringe}${under(76, 298, 248)}${fold(76, 206, 248, 92)}${under(98, 214, 204)}${fold(98, 128, 204, 86)}`
  }
  const aria = label ? ` role="img" aria-label="${item.name}"` : ' aria-hidden="true"'
  return `<svg class="cloth" viewBox="0 0 400 480" preserveAspectRatio="xMidYMid slice"${aria}>${defs}<rect width="400" height="480" fill="${bg}"/>${art}</svg>`
}
