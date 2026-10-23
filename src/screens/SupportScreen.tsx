import Icon from '../components/Icon'

type Content = { title: string; text: string; links: { label: string; detail: string; href: string }[] }

export default function SupportScreen({ content, onBack }: { content: Content; onBack: () => void }) {
  return <section className="content-screen support-screen"><div className="support-intro"><span className="symbol-circle"><Icon name="shield"/></span><p className="eyebrow">Nơi tìm hỗ trợ</p><h1>{content.title}</h1><p className="support-caption">Bạn xứng đáng được lắng nghe.<br/>Bạn xứng đáng được bảo vệ.</p></div><div className="support-body"><p className="support-text">{content.text}</p><div className="support-links">{content.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"><span><strong>{link.label}</strong><span>{link.detail} · Mở trong tab mới</span></span><Icon name="external"/></a>)}</div><p className="support-note">Nội dung hỗ trợ luôn mở, không phụ thuộc lựa chọn hay kết quả bài kiểm tra.</p><button className="button button--secondary" onClick={onBack}><Icon name="back"/> Quay lại</button></div></section>
}
