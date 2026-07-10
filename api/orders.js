// 模拟订单数据
const orders = new Map()

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method === 'GET') {
    return res.json({
      success: true,
      orders: Array.from(orders.values()),
    })
  }

  res.status(405).json({ success: false, message: 'Method not allowed' })
}
