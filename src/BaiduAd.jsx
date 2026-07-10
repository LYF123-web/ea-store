import { useEffect, useRef } from 'react'

// 百度联盟广告组件
export function BaiduAd({ adId, width = 728, height = 90, style = {} }) {
  const adRef = useRef(null)

  useEffect(() => {
    // 渲染百度广告
    if (window.baidu) {
      try {
        window.baidu.ag && window.baidu.ag.consumer.push(adId)
      } catch (e) {
        console.error('百度广告加载失败:', e)
      }
    }
  }, [adId])

  return (
    <div className="baidu-ad-container" style={{ textAlign: 'center', ...style }}>
      <div className="ad-label" style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>广告</div>
      <div
        ref={adRef}
        id={adId}
        style={{ width: `${width}px`, height: `${height}px`, margin: '0 auto' }}
      />
      {/* 百度联盟广告脚本占位 */}
      <script
        async
        src="https://cpro.baidu.com/cpro/ui/cpro.js"
        data-change-area="1"
      />
    </div>
  )
}

// 百度横幅广告 728x90
export function BaiduBannerAd({ style }) {
  return <BaiduAd adId="baidu-banner-001" width={728} height={90} style={style} />
}

// 百度信息流广告
export function BaiduFeedAd({ style }) {
  return (
    <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '16px', margin: '16px 0', border: '1px dashed #e0e0e0', ...style }}>
      <div style={{ fontSize: '11px', color: '#999', marginBottom: '8px', textAlign: 'right' }}>广告</div>
      <BaiduAd adId="baidu-feed-001" width={600} height={200} />
    </div>
  )
}

// 百度侧边栏广告 300x250
export function BaiduSidebarAd({ style }) {
  return (
    <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '16px', border: '1px dashed #e0e0e0', ...style }}>
      <div style={{ fontSize: '11px', color: '#999', marginBottom: '8px', textAlign: 'right' }}>广告</div>
      <BaiduAd adId="baidu-sidebar-001" width={300} height={250} />
    </div>
  )
}

// 百度底部广告
export function BaiduFooterAd({ style }) {
  return (
    <div style={{ margin: '20px 0', textAlign: 'center', padding: '16px', background: '#f9f9f9', ...style }}>
      <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>广告</div>
      <BaiduAd adId="baidu-footer-001" width={728} height={90} />
    </div>
  )
}
