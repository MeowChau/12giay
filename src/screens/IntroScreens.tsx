import { Portrait, SceneArtwork } from '../components/Artwork'
import Icon from '../components/Icon'
import type { CharacterPreview, Role } from '../types/ui'
import type { Progress } from '../types/progress'

export function WarningScreen({ onContinue, onSupport }: { onContinue: () => void; onSupport: () => void }) {
  return (
    <section className="intro-screen warning-screen">
      <SceneArtwork className="intro-background" />
      <div className="warning-panel">
        <span className="symbol-circle"><Icon name="shield" /></span>
        <p className="eyebrow">Trước khi câu chuyện bắt đầu</p>
        <h1>Một khoảng lặng<br />cho chính bạn.</h1>
        <p className="body-copy">Câu chuyện có nội dung về bạo lực lời nói, sự cô lập và bắt nạt trên mạng. Không có hình ảnh bạo lực đồ họa.</p>
        <p className="body-copy muted">Bạn có thể dừng lại bất cứ lúc nào. Hãy trải nghiệm theo nhịp của mình.</p>
        <button className="button button--primary" onClick={onContinue}>Tôi hiểu — tiếp tục <Icon name="arrow" /></button>
        <button className="text-button" onClick={onSupport}>Nơi tìm hỗ trợ <Icon name="external" /></button>
      </div>
      <span className="scene-caption">Một câu chuyện về ranh giới, trách nhiệm và sự lắng nghe.</span>
    </section>
  )
}

export function LandingScreen({ progress, onStart, onSupport, onReview }: { progress: Progress; onStart: () => void; onSupport: () => void; onReview: (role: Role) => void }) {
  return (
    <section className="intro-screen landing-screen">
      <SceneArtwork className="intro-background landing-art" />
      <div className="landing-shade" />
      <div className="landing-copy">
        <p className="eyebrow"><span className="small-line" /> Một câu chuyện. Hai góc nhìn.</p>
        <h1 className="game-title"><span>12</span><span>GIÂY<span className="title-period">.</span></span></h1>
        <p className="game-subtitle">Sự thật ngoài khung hình</p>
        <p className="landing-quote">“Một đoạn video không thể kể hết<br className="desktop-break" /> câu chuyện của một con người.”</p>
        <div className="landing-actions"><button className="button button--primary" onClick={onStart}>Bắt đầu <Icon name="arrow" /></button><button className="text-button" onClick={onSupport}>Nơi tìm hỗ trợ</button></div>
        <p className="experience-note">Visual novel 2D <span>·</span> 5–10 phút mỗi góc nhìn</p>
        {(progress.completedRoles.an || progress.completedRoles.khai) && <section className="achievement-list" aria-label="Thành tích theo góc nhìn"><p className="eyebrow">Hành trình của bạn</p>{(['an', 'khai'] as const).map(role => <div className="achievement-row" key={role}><span>{role === 'an' ? 'An' : 'Khải'} <small>{progress.completedRoles[role] ? 'Đã hoàn thành cốt truyện' : 'Chưa trải nghiệm'}</small></span>{progress.quizPassedRoles[role] && <button className="text-button achievement-review" data-role={role} onClick={() => onReview(role)}>Xem lại True Ending <Icon name="arrow"/></button>}</div>)}</section>}
      </div>
      <div className="video-frame" aria-hidden="true"><span className="frame-corner corner-tl"/><span className="frame-corner corner-tr"/><span className="frame-corner corner-bl"/><span className="frame-corner corner-br"/><span className="frame-label">NGOÀI KHUNG HÌNH</span><span className="frame-time">00:12</span></div>
      <div className="film-strip" aria-hidden="true"><span>01 — TIẾNG CƯỜI</span><div className="film-rule"/><span>12″</span></div>
    </section>
  )
}

export function RoleSelectScreen({ characters, onSelect }: { characters: CharacterPreview[]; onSelect: (role: Role) => void }) {
  return (
    <section className="content-screen role-screen">
      <div className="section-heading"><p className="eyebrow">Cùng một câu chuyện</p><h1>Bạn sẽ nhìn từ đâu?</h1><p className="muted">Mỗi góc nhìn hé lộ một phần. Không góc nhìn nào kể hết tất cả.</p></div>
      <div className="role-grid">{characters.map(character => <button className={`role-card role-card--${character.id}`} key={character.id} onClick={() => onSelect(character.id)}>
        <div className="role-art"><span className="role-number" aria-hidden="true">{character.number}</span><Portrait character={character.id}/><span className="role-art-caption">MỘT GÓC NHÌN</span></div>
        <div className="role-copy"><div className="role-name"><h2>{character.name}</h2><span className="round-arrow"><Icon name="arrow"/></span></div><p className="role-subtitle">{character.subtitle}</p><p className="role-description">{character.description}</p></div>
      </button>)}</div>
      <p className="section-footnote">Bạn có thể trải nghiệm góc nhìn còn lại sau khi kết thúc một lượt.</p>
    </section>
  )
}
