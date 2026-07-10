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
    const { productId, productName, amount, buyerEmail } = req.body

    // 生成订单号
    const orderId = 'EA' + Date.now() + Math.random().toString(36).slice(2, 8).toUpperCase()

    console.log('订单已创建:', orderId, productName, amount)

    // 返回模拟支付URL
    res.json({
      success: true,
      orderId,
      paymentUrl: '/pay/' + orderId,
      mode: 'mock',
    })
  } catch (error) {
    console.error('创建订单失败:', error)
    res.status(500).json({ success: false, message: '创建订单失败' })
  }
}
