import { useEffect, useRef } from 'react'

// Google AdSense 广告组件
export function GoogleAdSense({ slot, format = 'auto', responsive = true, style = {} }) {
  const adRef = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (adRef.current && !pushed.current) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        pushed.current = true
      } catch (e) {
        console.error('AdSense error:', e)
      }
    }
  }, [])

  return (
    <div className="ad-container" style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  )
}

// 横幅广告 (728x90)
export function BannerAd({ style }) {
  return (
    <GoogleAdSense
      slot="1111111111"
      format="auto"
      style={{ height: '90px', ...style }}
    />
  )
}

// 信息流广告
export function FeedAd({ style }) {
  return (
    <div className="feed-ad-wrapper" style={style}>
      <div className="ad-label">广告</div>
      <GoogleAdSense
        slot="2222222222"
        format="auto"
      />
    </div>
  )
}

// 侧边栏广告 (300x250)
export function SidebarAd({ style }) {
  return (
    <div className="sidebar-ad" style={style}>
      <div className="ad-label">广告</div>
      <GoogleAdSense
        slot="3333333333"
        format="auto"
        style={{ width: '300px', height: '250px' }}
      />
    </div>
  )
}

// 文章内嵌广告
export function InArticleAd({ style }) {
  return (
    <div className="in-article-ad" style={style}>
      <div className="ad-label">广告</div>
      <GoogleAdSense
        slot="4444444444"
        format="auto"
      />
    </div>
  )
}

// 底部全宽广告
export function FooterAd({ style }) {
  return (
    <div className="footer-ad" style={{ margin: '20px 0', textAlign: 'center', ...style }}>
      <GoogleAdSense
        slot="5555555555"
        format="auto"
        style={{ height: '90px' }}
      />
    </div>
  )
}

// 原生广告卡片
export function NativeAdCard({ style }) {
  return (
    <div className="native-ad-card" style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      background: '#fafafa',
      ...style
    }}>
      <div className="ad-label" style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>广告</div>
      <GoogleAdSense
        slot="6666666666"
        format="fluid"
        style={{ minHeight: '200px' }}
      />
    </div>
  )
}
