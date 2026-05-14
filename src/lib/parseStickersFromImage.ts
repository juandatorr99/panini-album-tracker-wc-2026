const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

const PROMPT = `You are helping track a Panini FIFA World Cup 2026 sticker album.
The user has written a list of sticker codes they own.
Valid sticker codes follow these patterns:
- Team player codes: 3-letter country code + 1-2 digit number (e.g. ARG1, ARG20, BRA5, FRA13)
- World Cup intro/museum codes: FWC followed by a number (e.g. FWC1, FWC3, FWC19)
- Coca-Cola insert codes: CC followed by a number (e.g. CC1, CC14)

From this handwritten image, extract every sticker code you can see.
Return ONLY a JSON array of strings with no explanation.
Example: ["ARG1","BRA5","FWC3","CC2"]
If you cannot read any codes, return an empty array: []`

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
  apiKey: string,
  validCodes: Set<string>
): Promise<{ found: string[]; raw: string }> {
  const base64 = await resizeImage(file)
  const mediaType = 'image/jpeg'

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-allow-browser': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            { type: 'text', text: PROMPT },
          ],
        },
      ],
    }),
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