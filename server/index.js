import express from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import config from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

// 静态文件服务（前端构建后的文件）
const distPath = path.join(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  console.log('✅ 前端静态文件已挂载')
}

// 支付宝SDK
let alipaySdk = null
let AlipayFormData = null

async function initAlipay() {
  try {
const privateKey = config.getPrivateKey()
    const publicKey = config.getAlipayPublicKey()

    if (!privateKey || !publicKey) {
      console.log('⚠️  支付宝密钥未配置，使用模拟支付模式')
      return false
    }

    const alipayModule = await import('alipay-sdk')
    AlipayFormData = alipayModule.AlipayFormData

    alipaySdk = new alipayModule.AlipaySdk({
      appId: config.appId,
      privateKey,
      alipayPublicKey: publicKey,
      gateway: config.gateway,
      signType: config.signType,
    })

    console.log('✅ 支付宝SDK初始化成功')
    console.log(`   APPID: ${config.appId}`)
    return true
  } catch (error) {
    console.log('⚠️  支付宝SDK初始化失败:', error.message)
    return false
  }
}

// 订单存储（生产环境用数据库）
const orders = new Map()

// 创建订单
app.post('/api/create-order', async (req, res) => {
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

    if (alipaySdk) {
      // 使用 sdkExecute 生成支付参数
      const result = await alipaySdk.sdkExec('alipay.trade.page.pay', {
        bizContent: {
          out_trade_no: orderId,
          total_amount: parseFloat(amount).toFixed(2),
          subject: productName,
          product_code: 'FAST_INSTANT_TRADE_PAY',
        },
      })

      // 构建完整的支付URL
      const paymentUrl = `${config.gateway}?${result}`

      console.log('支付URL:', paymentUrl)

      res.json({
        success: true,
        orderId,
        paymentUrl,
        mode: 'real',
      })
    } else {
      // 模拟支付模式
      res.json({
        success: true,
        orderId,
        paymentUrl: `/mock-pay?orderId=${orderId}`,
        mode: 'mock',
      })
    }
  } catch (error) {
    console.error('创建订单失败:', error)
    res.status(500).json({ success: false, message: '创建订单失败: ' + error.message })
  }
})

// 支付宝支付页面（直接渲染支付表单）
app.get('/pay/:orderId', async (req, res) => {
  const { orderId } = req.params
  const order = orders.get(orderId)

  if (!order) {
    return res.status(404).send('订单不存在')
  }

  if (!alipaySdk) {
    return res.redirect(`/mock-pay?orderId=${orderId}`)
  }

  try {
    const formData = new AlipayFormData()
    formData.setMethod('get')
    formData.addField('notify_url', config.notifyUrl)
    formData.addField('return_url', config.returnUrl)
    formData.addField('bizContent', {
      out_trade_no: orderId,
      total_amount: order.amount.toFixed(2),
      subject: order.productName,
      product_code: 'FAST_INSTANT_TRADE_PAY',
    })

    const payForm = await alipaySdk.pageExec('alipay.trade.page.pay', {}, { formData })

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>正在跳转到支付宝...</title>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
          .loading { text-align: center; }
          .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #1677ff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="loading">
          <div class="spinner"></div>
          <p>正在跳转到支付宝收银台...</p>
          <p style="color:#999;font-size:12px;">订单号: ${orderId}</p>
        </div>
        ${payForm}
      </body>
      </html>
    `)
  } catch (error) {
    console.error('生成支付页面失败:', error)
    res.status(500).send('支付页面生成失败: ' + error.message)
  }
})

// 支付结果页面（支付宝支付成功后跳转）
app.get('/pay-result', (req, res) => {
  const { out_trade_no, trade_no, total_amount } = req.query

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>支付结果 - EA Store</title>
      <meta charset="utf-8">
      <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
        .result-box { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; max-width: 450px; }
        .success-icon { font-size: 80px; margin-bottom: 20px; }
        h2 { color: #27ae60; margin-bottom: 10px; }
        .info { background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: left; }
        .info p { margin: 8px 0; font-size: 14px; color: #666; }
        .info span { color: #333; font-weight: 600; }
        .btn { background: #1677ff; color: white; border: none; padding: 12px 40px; border-radius: 8px; font-size: 16px; cursor: pointer; margin-top: 20px; }
        .btn:hover { background: #0958d9; }
      </style>
    </head>
    <body>
      <div class="result-box">
        <div class="success-icon">✅</div>
        <h2>支付成功</h2>
        <p style="color:#666;">感谢您的购买！</p>
        <div class="info">
          <p>订单号: <span>${out_trade_no || '未知'}</span></p>
          <p>交易号: <span>${trade_no || '未知'}</span></p>
          <p>支付金额: <span style="color:#e74c3c;">¥${total_amount || '未知'}</span></p>
        </div>
        <button class="btn" onclick="window.location.href='/'">返回商城</button>
      </div>
    </body>
    </html>
  `)
})

// 模拟支付页面
app.get('/mock-pay', (req, res) => {
  const { orderId } = req.query
  const order = orders.get(orderId)

  if (!order) {
    return res.status(404).send('订单不存在')
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>模拟支付 - EA Store</title>
      <meta charset="utf-8">
      <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .pay-box { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 400px; width: 90%; }
        h2 { color: #333; margin-bottom: 20px; }
        .order-info { background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: left; }
        .order-info p { margin: 10px 0; font-size: 14px; color: #666; }
        .order-info span { color: #333; font-weight: 600; }
        .price { font-size: 24px; color: #e74c3c; font-weight: 700; }
        .btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 14px 50px; border-radius: 30px; font-size: 16px; cursor: pointer; margin: 10px; transition: transform 0.2s; }
        .btn:hover { transform: scale(1.05); }
        .btn-cancel { background: #e8e8e8; color: #666; }
        .btn-cancel:hover { background: #ddd; }
        .badge { display: inline-block; background: #fff3cd; color: #856404; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <div class="pay-box">
        <div class="badge">模拟测试</div>
        <h2>💳 收银台</h2>
        <div class="order-info">
          <p>订单号: <span>${orderId}</span></p>
          <p>商品: <span>${order.productName}</span></p>
          <p>金额: <span class="price">¥${order.amount}</span></p>
        </div>
        <button class="btn" onclick="confirmPay()">确认支付</button>
        <br>
        <button class="btn btn-cancel" onclick="window.close()">取消支付</button>
      </div>
      <script>
        async function confirmPay() {
          const btn = document.querySelector('.btn');
          btn.textContent = '支付中...';
          btn.disabled = true;

          try {
            const res = await fetch('/api/simulate-pay', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: '${orderId}' })
            });
            const data = await res.json();
            if (data.success) {
              document.querySelector('.pay-box').innerHTML = '<div style="font-size:60px;margin:20px 0;">✅</div><h2 style="color:#27ae60;">支付成功！</h2><p style="color:#666;margin:20px 0;">订单号: ${orderId}</p><button class="btn" onclick="window.location.href=\'/\'">返回商城</button>';
            } else {
              alert('支付失败: ' + data.message);
              btn.textContent = '确认支付';
              btn.disabled = false;
            }
          } catch (err) {
            alert('网络错误: ' + err.message);
            btn.textContent = '确认支付';
            btn.disabled = false;
          }
        }
      </script>
    </body>
    </html>
  `)
})

// 支付宝异步通知回调
app.post('/api/alipay/notify', (req, res) => {
  try {
    const params = req.body
    const { out_trade_no, trade_no, trade_status } = params

    console.log(`📬 收到支付宝回调: ${out_trade_no} - ${trade_status}`)

    if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
      const order = orders.get(out_trade_no)
      if (order) {
        order.status = 'paid'
        order.tradeNo = trade_no
        order.paidAt = new Date().toISOString()
        orders.set(out_trade_no, order)
        console.log(`✅ 订单 ${out_trade_no} 支付成功`)
      }
    }

    res.send('success')
  } catch (error) {
    console.error('回调处理失败:', error)
    res.send('fail')
  }
})

// 查询订单
app.get('/api/order/:orderId', (req, res) => {
  const order = orders.get(req.params.orderId)
  if (order) {
    res.json({ success: true, order })
  } else {
    res.status(404).json({ success: false, message: '订单不存在' })
  }
})

// 所有订单
app.get('/api/orders', (req, res) => {
  res.json({ success: true, orders: Array.from(orders.values()) })
})

// 模拟支付
app.post('/api/simulate-pay', (req, res) => {
  const { orderId } = req.body
  const order = orders.get(orderId)
  if (order) {
    order.status = 'paid'
    order.paidAt = new Date().toISOString()
    orders.set(orderId, order)
    console.log(`✅ 订单 ${orderId} 模拟支付成功`)
    res.json({ success: true, message: '模拟支付成功' })
  } else {
    res.status(404).json({ success: false, message: '订单不存在' })
  }
})

const PORT = process.env.PORT || 3001

// 启动服务
async function start() {
  console.log('')
  console.log('🚀 EA Store 后端服务启动中...')
  console.log('')

await initAlipay()

  // 前端路由兜底（SPA支持）
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../dist/index.html')
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath)
    } else {
      res.json({ message: 'EA Store API 服务运行中' })
    }
  })

  app.listen(PORT, () => {
    console.log('')
    console.log('========================================')
    console.log(`   地址: http://localhost:${PORT}`)
    console.log('========================================')
    console.log('')
    console.log('📋 API 接口:')
    console.log(`   POST /api/create-order    - 创建订单`)
    console.log(`   GET  /api/order/:id       - 查询订单`)
    console.log(`   GET  /api/orders          - 所有订单`)
    console.log(`   POST /api/simulate-pay    - 模拟支付`)
    console.log(`   GET  /mock-pay?orderId=x  - 模拟支付页面`)
    console.log('')
    console.log('💡 提示: 将支付宝密钥放入 certs 目录后重启即可使用真实支付')
    console.log('')
  })
}

start()

