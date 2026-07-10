// Vercel Serverless Function - ES Module
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { productId, productName, amount, buyerEmail } = req.body

    // Generate order ID
    const orderId = 'EA' + Date.now() + Math.random().toString(36).slice(2, 8).toUpperCase()

    console.log('Order created:', orderId, productName, amount)

    // Return success with mock payment URL
    return res.status(200).json({
      success: true,
      orderId,
      paymentUrl: '/pay/' + orderId,
      mode: 'mock',
    })
  } catch (error) {
    console.error('Create order error:', error)
    return res.status(500).json({ success: false, message: '创建订单失败' })
  }
}
