import type { VercelRequest, VercelResponse } from '@vercel/node'

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: { message: 'Method not allowed' } })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'ANTHROPIC_API_KEY is not configured on the server' } })
  }

  const { imageBase64, mediaType } = (req.body ?? {}) as { imageBase64?: string; mediaType?: string }
  if (!imageBase64 || !mediaType) {
    return res.status(400).json({ error: { message: 'imageBase64 and mediaType are required' } })
  }

  const upstream = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
            { type: 'text', text: PROMPT },
          ],
        },
      ],
    }),
  })

  const data = await upstream.json().catch(() => ({}))
  return res.status(upstream.status).json(data)
}
