// 支付宝配置文件
export default {
  // 应用ID（APPID）
  appId: '2021006170687735',

  // 网关地址（正式环境）
  gateway: 'https://openapi.alipay.com/gateway.do',

  // 签名类型
  signType: 'RSA2',

  // 回调地址（支付宝支付成功后通知你的服务器）
  // 测试时用localhost，正式环境需要换成公网域名
  notifyUrl: 'http://wanfeng.com/api/alipay/notify',

  // 支付完成后的跳转地址
  returnUrl: 'http://wanfeng.com/pay-result',

  // 密钥文件路径
  privateKeyPath: './certs/app_private_key.pem',
  alipayPublicKeyPath: './certs/alipay_public_key.pem',
}
