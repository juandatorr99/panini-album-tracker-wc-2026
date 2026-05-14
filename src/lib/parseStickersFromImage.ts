async function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 1024
      const scale = Math.min(1, MAX / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85).split(',')[1])
    }
    img.onerror = reject
    img.src = url
  })
}

export async function parseStickersFromImage(
  file: File,
  validCodes: Set<string>
): Promise<{ found: string[]; crossedOut: string[]; raw: string }> {
  const base64 = await resizeImage(file)
  const mediaType = 'image/jpeg'

  const res = await fetch('/api/parse-stickers', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ imageBase64: base64, mediaType }),
  })

  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid API key')
    if (res.status === 429) throw new Error('Rate limited — try again shortly')
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: { message?: string } }).error?.message ?? `API error ${res.status}`)
  }

  const data = await res.json() as { content: Array<{ type: string; text?: string }> }
  const raw = data.content.find((b) => b.type === 'text')?.text ?? ''

  let foundRaw: string[] = []
  let crossedRaw: string[] = []

  const objMatch = raw.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try {
      const obj = JSON.parse(objMatch[0]) as { found?: unknown; crossedOut?: unknown }
      if (Array.isArray(obj.found)) foundRaw = obj.found.filter((c): c is string => typeof c === 'string')
      if (Array.isArray(obj.crossedOut)) crossedRaw = obj.crossedOut.filter((c): c is string => typeof c === 'string')
    } catch {
      /* fall through */
    }
  }

  if (foundRaw.length === 0 && crossedRaw.length === 0) {
    const arrMatch = raw.match(/\[[\s\S]*\]/)
    if (arrMatch) {
      try {
        const arr = JSON.parse(arrMatch[0]) as unknown
        if (Array.isArray(arr)) foundRaw = arr.filter((c): c is string => typeof c === 'string')
      } catch {
        foundRaw = Array.from(raw.matchAll(/\b(FWC\d{1,2}|CC\d{1,2}|[A-Z]{2,3}\d{1,2})\b/g), (m) => m[1])
      }
    } else {
      foundRaw = Array.from(raw.matchAll(/\b(FWC\d{1,2}|CC\d{1,2}|[A-Z]{2,3}\d{1,2})\b/g), (m) => m[1])
    }
  }

  const found = foundRaw.map((c) => c.toUpperCase()).filter((c) => validCodes.has(c))
  const crossedOut = [...new Set(crossedRaw.map((c) => c.toUpperCase()).filter((c) => validCodes.has(c)))]
  return { found, crossedOut, raw }
}
