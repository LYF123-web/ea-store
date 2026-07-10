import { useState } from 'react'
import './App.css'
import { BannerAd, FeedAd, SidebarAd, FooterAd } from './AdBanner'

// API地址（部署后前后端同域）
const API_BASE = '/api'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [cart, setCart] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: 'all', name: '全部', icon: '📦' },
    { id: 'ea', name: 'EA智能交易', icon: '🤖' },
    { id: 'indicator', name: '指标工具', icon: '📊' },
    { id: 'strategy', name: '交易策略', icon: '📈' },
    { id: 'course', name: '教程资料', icon: '📚' },
  ]

  const products = [
    {
      id: 0,
      name: '【测试商品】0.01元',
      category: 'ea',
      price: 0.01,
      originalPrice: 1,
      description: '用于测试支付宝支付功能',
      rating: 5.0,
      sales: 1,
      tags: ['测试'],
      image: '🧪',
    },
    {
      id: 1,
      name: '黄金突破策略EA',
      category: 'ea',
      price: 299,
      originalPrice: 599,
      description: '基于突破策略的黄金自动交易EA，支持多周期',
      rating: 4.8,
      sales: 1256,
      tags: ['热门', '好评'],
      image: '🥇',
    },
    {
      id: 2,
      name: '外汇网格EA',
      category: 'ea',
      price: 199,
      originalPrice: 399,
      description: '经典网格策略，支持多货币对同时交易',
      rating: 4.6,
      sales: 892,
      tags: ['稳定'],
      image: '💱',
    },
    {
      id: 3,
      name: '多指标共振系统',
      category: 'indicator',
      price: 149,
      originalPrice: 299,
      description: '融合MACD/RSI/布林带的综合信号指标',
      rating: 4.9,
      sales: 2103,
      tags: ['畅销', '好评'],
      image: '📉',
    },
    {
      id: 4,
      name: '量化交易入门到精通',
      category: 'course',
      price: 99,
      originalPrice: 199,
      description: '从零开始学习量化交易，含30个实战案例',
      rating: 4.7,
      sales: 3567,
      tags: ['新手推荐'],
      image: '🎓',
    },
    {
      id: 5,
      name: '剥头皮策略EA',
      category: 'ea',
      price: 399,
      originalPrice: 799,
      description: '高频剥头皮策略，适合低点差账户',
      rating: 4.5,
      sales: 645,
      tags: ['高收益'],
      image: '⚡',
    },
    {
      id: 6,
      name: '趋势跟踪策略包',
      category: 'strategy',
      price: 259,
      originalPrice: 518,
      description: '包含3套趋势跟踪策略及完整源码',
      rating: 4.8,
      sales: 1089,
      tags: ['套餐', '好评'],
      image: '🚀',
    },
    {
      id: 7,
      name: '自定义指标工具集',
      category: 'indicator',
      price: 79,
      originalPrice: 159,
      description: '20+实用自定义指标合集',
      rating: 4.4,
      sales: 1876,
      tags: ['超值'],
      image: '🔧',
    },
    {
      id: 8,
      name: 'MT5 Python对接教程',
      category: 'course',
      price: 159,
      originalPrice: 319,
      description: 'MT5与Python完美对接，实现本地量化',
      rating: 4.9,
      sales: 2234,
      tags: ['好评', '实用'],
      image: '🐍',
    },
  ]

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id)
    if (existing) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return

    setLoading(true)
    try {
      const productNames = cart.map(item => item.name).join('、')
      const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

      const response = await fetch(`${API_BASE}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: cart.map(item => item.id).join(','),
          productName: productNames.length > 50 ? productNames.slice(0, 50) + '...' : productNames,
          amount: totalAmount,
          buyerEmail: 'buyer@example.com',
        }),
      })

      const data = await response.json()

      if (data.success) {
        // 跳转到支付宝支付页面
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        } else {
          window.location.href = `/pay/${data.orderId}`
        }
      } else {
        alert('创建订单失败: ' + data.message)
      }
    } catch (error) {
      console.error('支付失败:', error)
      alert('支付服务连接失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDirectBuy = async (product) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          amount: product.price,
          buyerEmail: 'buyer@example.com',
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        } else {
          window.location.href = `/pay/${data.orderId}`
        }
      } else {
        alert('创建订单失败: ' + data.message)
      }
    } catch (error) {
      console.error('支付失败:', error)
      alert('支付服务连接失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const filteredProducts = products.filter((product) => {
    const matchCategory = activeTab === 'home' || activeTab === 'cart' || product.category === activeTab
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '')
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-left">
          <h1 className="logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
            EA Store
          </h1>
          <nav className="nav">
            <a
              href="#"
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('home') }}
            >
              首页
            </a>
            <a
              href="#"
              className={`nav-link ${activeTab === 'ea' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('ea') }}
            >
              EA智能交易
            </a>
            <a
              href="#"
              className={`nav-link ${activeTab === 'indicator' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('indicator') }}
            >
              指标工具
            </a>
            <a
              href="#"
              className={`nav-link ${activeTab === 'strategy' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('strategy') }}
            >
              交易策略
            </a>
            <a
              href="#"
              className={`nav-link ${activeTab === 'course' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('course') }}
            >
              教程资料
            </a>
          </nav>
        </div>
        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索EA、指标、策略..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="cart-icon" onClick={() => setActiveTab('cart')}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          <div className="user-info">
            <span className="user-name">登录</span>
          </div>
        </div>
      </header>

      {/* 顶部横幅广告 */}
      <BannerAd style={{ margin: '0 auto', maxWidth: '1400px' }} />

      <main className="main-content">
        {activeTab === 'home' && (
          <>
            <section className="hero-banner">
              <div className="hero-content">
                <h2>专业MT5/MT4交易工具</h2>
                <p>EA智能交易 | 自定义指标 | 量化策略 | 实战教程</p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">优质EA</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">10万+</span>
                    <span className="stat-label">用户选择</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">98%</span>
                    <span className="stat-label">好评率</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="category-section">
              <h2 className="section-title">商品分类</h2>
              <div className="category-grid">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="category-card"
                    onClick={() => setActiveTab(cat.id === 'all' ? 'home' : cat.id)}
                  >
                    <span className="category-icon">{cat.icon}</span>
                    <span className="category-name">{cat.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 分类后信息流广告 */}
            <FeedAd style={{ margin: '20px 0' }} />
          </>
        )}

        {activeTab === 'cart' ? (
          <section className="cart-section">
            <h2 className="section-title">购物车</h2>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>购物车是空的</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('home')}>
                  去选购
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <span className="item-image">{item.image}</span>
                      <div className="item-info">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                      </div>
                      <div className="item-price">¥{item.price}</div>
                      <div className="item-quantity">x{item.quantity}</div>
                      <button
                        className="btn-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>商品总数：</span>
                    <span>{cartCount} 件</span>
                  </div>
                  <div className="summary-row total">
                    <span>合计：</span>
                    <span className="total-price">¥{cartTotal}</span>
                  </div>
                  <button
                    className="btn btn-primary btn-checkout"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? '正在创建订单...' : '立即结算'}
                  </button>
                </div>
              </>
            )}
          </section>
        ) : (
          <div className="products-layout">
            <section className="products-section">
              <div className="section-header">
                <h2 className="section-title">
                  {activeTab === 'home' ? '热门商品' : categories.find(c => c.id === activeTab)?.name || '全部商品'}
                </h2>
                <div className="sort-controls">
                  <select>
                    <option>按销量排序</option>
                    <option>按价格排序</option>
                    <option>按评分排序</option>
                  </select>
                </div>
              </div>
              <div className="products-grid">
                {filteredProducts.map((product, index) => (
                  <div key={product.id}>
                    <div className="product-card">
                      <div className="product-image">{product.image}</div>
                      <div className="product-tags">
                        {product.tags.map((tag, i) => (
                          <span key={i} className={`tag tag-${tag === '热门' || tag === '畅销' ? 'hot' : tag === '好评' ? 'good' : 'default'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-desc">{product.description}</p>
                      <div className="product-meta">
                        <span className="product-rating">
                          <span className="stars">{renderStars(product.rating)}</span>
                          <span className="rating-number">{product.rating}</span>
                        </span>
                        <span className="product-sales">{product.sales}人付款</span>
                      </div>
                      <div className="product-price">
                        <span className="current-price">¥{product.price}</span>
                        <span className="original-price">¥{product.originalPrice}</span>
                        <span className="discount">{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>
                      </div>
                      <div className="product-actions">
                        <button className="btn btn-outline" onClick={() => addToCart(product)}>
                          加入购物车
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleDirectBuy(product)}
                          disabled={loading}
                        >
                          立即购买
                        </button>
                      </div>
                    </div>
                    {/* 每4个商品插入一个信息流广告 */}
                    {(index + 1) % 4 === 0 && <FeedAd style={{ margin: '20px 0' }} />}
                  </div>
                ))}
              </div>
            </section>

            {/* 侧边栏广告（仅首页显示） */}
            {activeTab === 'home' && (
              <aside className="sidebar">
                <SidebarAd />
              </aside>
            )}
          </div>
        )}
      </main>

      {/* 底部全宽广告 */}
      <FooterAd />

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>EA Store</h3>
            <p>专业MT5/MT4交易工具商城，为您的交易保驾护航</p>
          </div>
          <div className="footer-section">
            <h3>帮助中心</h3>
            <ul>
              <li><a href="#">如何安装EA</a></li>
              <li><a href="#">常见问题</a></li>
              <li><a href="#">售后服务</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>关于我们</h3>
            <ul>
              <li><a href="#">团队介绍</a></li>
              <li><a href="#">合作联系</a></li>
              <li><a href="#">用户协议</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>联系我们</h3>
            <ul>
              <li>客服微信：EA_Store</li>
              <li>客服QQ：12345678</li>
              <li>邮箱：support@eastore.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 EA Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
