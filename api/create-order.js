import { v4 as uuidv4 } from 'uuid'

// 内存存储（生产环境用数据库）
const orders = new Map()

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

    const orderId = `EA${Date.now()}${uuidv4().slice(0, 8).toUpperCase()}`

    orders.set(orderId, {
      id: orderId,
      productId,
      productName,
      amount: parseFloat(amount),
      buyerEmail,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    console.log(`📦 订单已创建: ${orderId} - ${productName} - ¥${amount}`)

    // 模拟支付模式（Vercel部署用）
    res.json({
      success: true,
      orderId,
      paymentUrl: `/pay/${orderId}`,
      mode: 'mock',
    })
  } catch (error) {
    console.error('创建订单失败:', error)
    res.status(500).json({ success: false, message: '创建订单失败' })
  }
}
