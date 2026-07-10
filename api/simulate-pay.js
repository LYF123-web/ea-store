export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { orderId } = req.body
    console.log('模拟支付成功:', orderId)

    res.json({ success: true, message: '模拟支付成功' })
  } catch (error) {
    res.status(500).json({ success: false, message: '支付失败' })
  }
}
