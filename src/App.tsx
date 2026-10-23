import { useEffect, useReducer, useRef, useState } from 'react'
import BackgroundMusic from './components/BackgroundMusic'
import Icon from './components/Icon'
import { anEndings } from './data/anStory'
import { epilogueClosing, epilogues } from './data/epilogues'
import { khaiEndings } from './data/khaiStory'
import { characters, endingPreviews, previewScreens, reassurance, supportContent } from './data/preview'
import { quizQuestions } from './data/quiz'
import { stories } from './data/stories'
import { resolveScreen } from './engine/access'
import { canAdvance, createInitialState, gameReducer, getCurrentLine, getCurrentScene, getRoute, getSelectedChoice } from './engine/narrative'
import { canViewEpilogue, loadProgress, recordCompletion, recordQuizPass, saveProgress } from './engine/progress'
import { canStartQuiz, createQuizState, hasAllAnswers, isEligibleAttempt, quizReducer } from './engine/quiz'
import { LandingScreen, RoleSelectScreen, WarningScreen } from './screens/IntroScreens'
import { EndingScreen, EpilogueScreen } from './screens/OutcomeScreens'
import QuizScreen from './screens/QuizScreen'
import StoryScreen from './screens/StoryScreen'
import SupportScreen from './screens/SupportScreen'
import type { GameAction, GameState } from './types/narrative'
import type { ScenePreview, Screen, Role } from './types/ui'
import './styles/app.css'

const reduceGame = (state: GameState, action: GameAction) => gameReducer(state, action, stories)

function App() {
  const [game, dispatch] = useReducer(reduceGame, 'an', createInitialState)
  const [quiz, dispatchQuiz] = useReducer(quizReducer, 'an', createQuizState)
  const [progress, setProgress] = useState(() => loadProgress())
  const [screen, setScreen] = useState<Screen>('warning')
  const [returnScreen, setReturnScreen] = useState<Screen>('landing')
  const [epilogueRole, setEpilogueRole] = useState<Role | null>(null)
  const mainRef = useRef<HTMLElement>(null)

  const route = getRoute(game, stories)
  const activeScreen = resolveScreen(screen, game, quiz, progress, epilogueRole, stories)
  const endingKind = route.screen === 'ending' ? route.endingType : 'negative'
  const endingData = { ...endingPreviews[endingKind], text: game.role === 'an' ? anEndings[endingKind] : khaiEndings[endingKind] }
  const story = stories[game.role]
  const currentScene = getCurrentScene(game, stories) ?? story.scenes[0]
  const currentLine = getCurrentLine(game, stories) ?? currentScene.lines[0]
  const selectedChoice = getSelectedChoice(game, currentScene)?.id ?? null
  const choices = selectedChoice || game.lineIndex === currentScene.lines.length - 1 ? currentScene.choices ?? [] : []
  const scene: ScenePreview = {
    id: currentLine.background ?? currentScene.background,
    title: currentScene.title, location: currentScene.location, speaker: currentLine.speaker,
    portrait: currentLine.portrait ?? currentScene.portrait, line: currentLine.text,
    lineType: currentLine.type, evidence: currentLine.evidence,
  }
  const steps = story.scenes.filter(item => item.kind === 'decision').map((item, index) => ({
    id: item.id, label: `Lựa chọn 0${index + 1}`, current: item.id === game.sceneId,
    completed: item.choices?.some(choice => game.appliedChoiceIds.includes(choice.id)) ?? false,
  }))

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [activeScreen])

  useEffect(() => { saveProgress(progress) }, [progress])

  useEffect(() => {
    if (screen !== 'support') return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setScreen(returnScreen)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [screen, returnScreen])

  function openSupport() {
    if (screen !== 'support') setReturnScreen(screen)
    setScreen('support')
  }

  function startRole(role: Role) {
    dispatch({ type: 'reset', role })
    dispatchQuiz({ type: 'reset', role })
    setScreen('story')
  }

  function advanceStory() {
    const action: GameAction = { type: 'advance', sceneId: game.sceneId, lineIndex: game.lineIndex }
    const next = reduceGame(game, action)
    dispatch(action)
    setProgress(previous => recordCompletion(previous, next, stories))
  }

  function goToMenu() {
    if (activeScreen === 'story' && game.sceneId !== `${game.role}_intro`) {
      if (!window.confirm('Về menu sẽ bắt đầu lại lượt chơi. Bạn muốn tiếp tục?')) return
      dispatch({ type: 'reset' })
      dispatchQuiz({ type: 'reset', role: game.role })
    }
    setScreen('landing')
  }

  function openQuiz() {
    if (!canStartQuiz(game, stories)) return
    dispatchQuiz({ type: 'reset', role: game.role })
    setScreen('quiz')
  }

  function submitQuiz() {
    if (!isEligibleAttempt(game, quiz, stories)) return
    const action = { type: 'submit', role: game.role } as const
    const submitted = quizReducer(quiz, action)
    if (submitted === quiz) return
    dispatchQuiz(action)
    setProgress(previous => recordQuizPass(previous, game, submitted, stories))
  }

  function openEpilogue(role: Role) {
    if (!canViewEpilogue(progress, role)) return
    setEpilogueRole(role)
    setScreen('epilogue')
  }

  function canNavigate(target: Screen) {
    if (target === 'ending') return route.screen === 'ending'
    if (target === 'quiz') return canStartQuiz(game, stories)
    if (target === 'epilogue') return canViewEpilogue(progress, game.role)
    return true
  }

  function navigate(target: Screen) {
    if (!canNavigate(target)) return
    if (target === 'story') { startRole(game.role); return }
    if (target === 'epilogue') { openEpilogue(game.role); return }
    if (target === 'quiz' && quiz.role !== game.role) dispatchQuiz({ type: 'reset', role: game.role })
    setScreen(target)
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Đến nội dung chính</a>
      <header className="topbar">
        <button className="brand" onClick={goToMenu} aria-label="12 GIÂY — Về trang đầu"><span className="brand-mark">12</span><span className="brand-copy"><strong>12 GIÂY</strong><span>Sự thật ngoài khung hình</span></span></button>
        <div className="topbar-actions">{import.meta.env.VITE_BGM_AVAILABLE === 'true' && <BackgroundMusic/>}{activeScreen !== 'landing' && activeScreen !== 'warning' && <button className="nav-button menu-button" onClick={goToMenu}>Về menu</button>}<button className={`nav-button ${activeScreen === 'support' ? 'is-active' : ''}`} onClick={openSupport}><Icon name="help"/><span>Nơi tìm hỗ trợ</span></button></div>
      </header>
      <main id="main-content" className={`main-content main-content--${activeScreen}`} tabIndex={-1} ref={mainRef}>
        {activeScreen === 'warning' && <WarningScreen onContinue={() => setScreen('landing')} onSupport={openSupport}/>}
        {activeScreen === 'landing' && <LandingScreen progress={progress} onStart={() => setScreen('roles')} onSupport={openSupport} onReview={openEpilogue}/>}
        {activeScreen === 'roles' && <RoleSelectScreen characters={characters} onSelect={startRole}/>}
        {activeScreen === 'story' && <StoryScreen
          steps={steps} sceneIndex={story.scenes.indexOf(currentScene)} sceneCount={story.scenes.length}
          role={game.role} scene={scene} choices={choices} selectedChoice={selectedChoice}
          canContinue={canAdvance(game, stories)}
          onChoice={choiceId => dispatch({ type: 'choose', sceneId: game.sceneId, choiceId })}
          onNext={advanceStory}
        />}
        {activeScreen === 'ending' && <EndingScreen
          ending={endingData} kind={endingKind} reassurance={reassurance} onQuiz={openQuiz}
          onReplay={() => startRole(game.role)} onRoles={() => setScreen('roles')} onSupport={openSupport}
        />}
        {activeScreen === 'quiz' && <QuizScreen
          questions={quizQuestions} state={quiz}
          canSubmit={!quiz.result && hasAllAnswers(quiz.answers)} canViewEnding={canViewEpilogue(progress, quiz.role)}
          onAnswer={(questionId, answerId) => dispatchQuiz({ type: 'answer', role: quiz.role, questionId, answerId })}
          onNavigate={index => dispatchQuiz({ type: 'navigate', role: quiz.role, index })}
          onSubmit={submitQuiz} onRetry={() => dispatchQuiz({ type: 'retry', role: quiz.role })}
          onTrueEnding={() => openEpilogue(quiz.role)} onBack={() => setScreen('story')}
          onSupport={openSupport} onMenu={goToMenu}
        />}
        {activeScreen === 'epilogue' && epilogueRole && <EpilogueScreen
          role={epilogueRole} text={epilogues[epilogueRole]} closing={epilogueClosing}
          onRoles={() => setScreen('roles')} onSupport={openSupport} onMenu={goToMenu}
        />}
        {activeScreen === 'support' && <SupportScreen content={supportContent} onBack={() => setScreen(returnScreen)}/>}
      </main>
      <footer className="preview-bar">
        <div className="preview-label"><span className="preview-dot"/> 12 GIÂY · DEMO <span className="preview-note">{activeScreen === 'epilogue' ? 'True Ending' : game.role === 'an' ? 'Góc nhìn An' : 'Góc nhìn Khải'}</span></div>
        <nav className="preview-navigation" aria-label="Điều hướng">{previewScreens.map(item => <button key={item.id} disabled={!canNavigate(item.id)} className={activeScreen === item.id ? 'is-active' : ''} aria-current={activeScreen === item.id ? 'page' : undefined} onClick={() => navigate(item.id)}>{item.label}</button>)}</nav>
      </footer>
    </div>
  )
}

export default App
