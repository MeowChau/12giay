import { SceneArtwork } from '../components/Artwork'
import Icon from '../components/Icon'
import type { EndingPreview, Role } from '../types/ui'

type EndingData = { label: string; title: string; text: string; number: string }

export function EndingScreen({ ending, kind, reassurance, onQuiz, onReplay, onRoles, onSupport }: { ending: EndingData; kind: EndingPreview; reassurance: string; onQuiz: () => void; onReplay: () => void; onRoles: () => void; onSupport: () => void }) {
  return <section className="intro-screen outcome-screen"><SceneArtwork scene="classroom" className="intro-background"/><div className="outcome-shade"/><div className="outcome-copy"><span className="chapter-mark" aria-hidden="true">{ending.number}</span><p className="eyebrow">{ending.label}</p><h1>{ending.title}</h1><p className="outcome-text">{ending.text}</p><div className="outcome-actions">{kind === 'positive' && <button className="button button--primary" onClick={onQuiz}>Làm bài kiểm tra <Icon name="arrow"/></button>}<button className="button button--secondary" onClick={onRoles}>Chuyển góc nhìn <Icon name="arrow"/></button><button className="text-button" onClick={onReplay}>Chơi lại</button></div><div className="reassurance"><Icon name="shield"/><p>{reassurance}</p></div><button className="text-button" onClick={onSupport}>Nơi tìm hỗ trợ <Icon name="external"/></button></div></section>
}

export function EpilogueScreen({ role, text, closing, onRoles, onSupport, onMenu }: { role: Role; text: string; closing: string; onRoles: () => void; onSupport: () => void; onMenu: () => void }) {
  return <section className="intro-screen outcome-screen epilogue-screen"><SceneArtwork className="intro-background"/><div className="outcome-shade"/><div className="outcome-copy"><p className="eyebrow">True Ending · Góc nhìn {role === 'an' ? 'An' : 'Khải'}</p><h1>Sự thật ngoài khung hình</h1><p className="outcome-text epilogue-text">{text}</p><blockquote className="epilogue-closing">{closing}</blockquote><p className="completion-badge"><Icon name="check"/> Đã hoàn thành góc nhìn {role === 'an' ? 'An' : 'Khải'}</p><div className="outcome-actions"><button className="button button--primary" onClick={onRoles}>Chuyển góc nhìn <Icon name="arrow"/></button><button className="text-button" onClick={onSupport}>Nơi tìm hỗ trợ</button><button className="text-button" onClick={onMenu}>Về menu</button></div></div></section>
}
