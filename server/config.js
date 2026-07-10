import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '.env') })

// 支付宝配置
export default {
  appId: process.env.ALIPAY_APP_ID || '2021006170687735',

  gateway: 'https://openapi.alipay.com/gateway.do',

  signType: 'RSA2',

  notifyUrl: process.env.ALIPAY_NOTIFY_URL || 'http://localhost:3001/api/alipay/notify',

  returnUrl: process.env.ALIPAY_RETURN_URL || 'http://localhost:5173/pay-result',

  // 从环境变量读取密钥
  privateKey: process.env.ALIPAY_PRIVATE_KEY || '',

  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || '',

  // 兼容从文件读取（开发环境）
  getPrivateKey() {
    if (this.privateKey) {
      return this.privateKey.replace(/\\n/g, '\n')
    }
    try {
      return fs.readFileSync(path.join(__dirname, 'certs/app_private_key.pem'), 'ascii')
    } catch {
      return ''
    }
  },

  getAlipayPublicKey() {
    if (this.alipayPublicKey) {
      return this.alipayPublicKey.replace(/\\n/g, '\n')
    }
    try {
      return fs.readFileSync(path.join(__dirname, 'certs/alipay_public_key.pem'), 'ascii')
    } catch {
      return ''
    }
  },
}
