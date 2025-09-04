// pages/api/lookup.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { number, countryCode = 'MY' } = req.body || {}
    if (!number) {
      return res.status(400).json({ error: 'number required' })
    }

    const uid = process.env.NEUTRINO_USER_ID!
    const key = process.env.NEUTRINO_API_KEY!

    const params = new URLSearchParams({
      'user-id': uid,
      'api-key': key,
      number,
      'country-code': String(countryCode)
    })

    const r = await fetch('https://neutrinoapi.net/phone-validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    })

    const text = await r.text()
    res.status(r.status).send(text)  // 原样透传结果
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'proxy failed' })
  }
}
