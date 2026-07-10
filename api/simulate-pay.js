// Vercel Serverless Function - ES Module
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { orderId } = req.body
    console.log('Simulate pay success:', orderId)

    return res.status(200).json({ success: true, message: '模拟支付成功' })
  } catch (error) {
    return res.status(500).json({ success: false, message: '支付失败' })
  }
}
