export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { orderId } = req.body

    console.log(`✅ 订单 ${orderId} 模拟支付成功`)

    res.json({ success: true, message: '模拟支付成功' })
  } catch (error) {
    console.error('支付失败:', error)
    res.status(500).json({ success: false, message: '支付失败' })
  }
}
