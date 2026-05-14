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
): Promise<{ found: string[]; raw: string }> {
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

  let parsed: string[] = []
  try {
    const match = raw.match(/\[.*\]/s)
    if (match) parsed = JSON.parse(match[0]) as string[]
  } catch {
    parsed = Array.from(raw.matchAll(/\b(FWC\d{1,2}|CC\d{1,2}|[A-Z]{2,3}\d{1,2})\b/g), (m) => m[1])
  }

  const found = [...new Set(parsed.map((c) => c.toUpperCase()).filter((c) => validCodes.has(c)))]
  return { found, raw }
}
