import { useEffect, useRef } from 'react'
import Icon from '../components/Icon'
import type { AnswerId, QuestionId, QuizQuestion, QuizState } from '../types/quiz'

type Props = {
  questions: readonly QuizQuestion[]
  state: QuizState
  canSubmit: boolean
  canViewEnding: boolean
  onAnswer: (questionId: QuestionId, answer: AnswerId) => void
  onNavigate: (index: number) => void
  onSubmit: () => void
  onRetry: () => void
  onTrueEnding: () => void
  onBack: () => void
  onSupport: () => void
  onMenu: () => void
}

export default function QuizScreen({ questions, state, canSubmit, canViewEnding, onAnswer, onNavigate, onSubmit, onRetry, onTrueEnding, onBack, onSupport, onMenu }: Props) {
  const questionRef = useRef<HTMLLegendElement>(null)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const previousQuestion = useRef(state.questionIndex)
  const previousResult = useRef(state.result)
  const question = questions[state.questionIndex]
  const answeredCount = questions.filter(item => state.answers[item.id]).length
  const roleName = state.role === 'an' ? 'An' : 'Khải'

  useEffect(() => {
    if (state.result) {
      resultRef.current?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else {
      questionRef.current?.focus({ preventScroll: true })
      if (previousQuestion.current !== state.questionIndex || previousResult.current) {
        questionRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
      }
    }
    previousQuestion.current = state.questionIndex
    previousResult.current = state.result
  }, [state.questionIndex, state.result])

  if (state.result) {
    const result = state.result
    return <section className="content-screen quiz-results">
      <div className="quiz-result-heading">
        <div><p className="eyebrow">Kết quả · Góc nhìn {roleName}</p><h1 tabIndex={-1} ref={resultRef}>{result.passed ? 'Bạn đã hoàn thành.' : 'Mình cùng xem lại.'}</h1><p className="muted">{result.passed ? 'Bạn có thể xem phần tiếp nối của câu chuyện.' : 'Bạn cần đúng ít nhất 9/10 câu để mở phần tiếp nối. Có thể làm lại không giới hạn.'}</p></div>
        <p className="quiz-score" role="status"><strong>{result.correctCount}</strong><span>/ 10</span><small>{result.passed ? 'Đạt' : 'Chưa đạt'}</small></p>
      </div>
      <div className="quiz-result-actions">
        {result.passed && <button className="button button--primary" disabled={!canViewEnding} onClick={onTrueEnding}>Xem True Ending <Icon name="arrow"/></button>}
        <button className="button button--secondary" onClick={onRetry}>Làm lại</button>
        <button className="text-button" onClick={onSupport}>Nơi tìm hỗ trợ <Icon name="external"/></button>
        <button className="text-button" onClick={onMenu}>Về menu</button>
      </div>
      <ol className="quiz-feedback" aria-label="Giải thích từng câu">
        {result.feedback.map(feedback => {
          const item = questions.find(candidate => candidate.id === feedback.questionId)!
          return <li className="feedback-item" key={item.id} data-correct={feedback.correct}>
            <div className="feedback-heading"><h2>{item.id} · {item.title}</h2><span>{feedback.correct ? 'Đúng' : 'Cần xem lại'}</span></div>
            <p className="feedback-question">{item.question}</p>
            <p className="feedback-answer">Đã chọn: {feedback.selected}. {item.options.find(option => option.id === feedback.selected)?.text}</p>
            {!feedback.correct && <p className="feedback-answer">Đáp án phù hợp: {feedback.correctAnswer}. {item.options.find(option => option.id === feedback.correctAnswer)?.text}</p>}
            <p className="feedback-explanation">{feedback.explanation}</p>
          </li>
        })}
      </ol>
      <div className="quiz-result-actions"><button className="button button--secondary" onClick={onRetry}>Làm lại</button><button className="text-button" onClick={onSupport}>Nơi tìm hỗ trợ</button></div>
    </section>
  }

  return <section className="content-screen quiz-screen">
    <div className="quiz-intro">
      <p className="eyebrow">Sau câu chuyện · Góc nhìn {roleName}</p>
      <h1>Dừng lại.<br/>{' '}Nghĩ thêm một chút.</h1>
      <p className="muted">Mười câu hỏi về ranh giới, sự đồng thuận và cách hỗ trợ an toàn.</p>
      <div className="quiz-meta"><span>10 câu hỏi</span><span>3–5 phút</span><span>Đạt từ 9/10</span></div>
      <nav className="quiz-index-nav" aria-label="Chuyển câu hỏi">{questions.map((item, index) => <button key={item.id} className={`${state.questionIndex === index ? 'is-current' : ''} ${state.answers[item.id] ? 'is-answered' : ''}`} aria-current={state.questionIndex === index ? 'step' : undefined} aria-label={`Câu ${index + 1}${state.answers[item.id] ? ', đã trả lời' : ', chưa trả lời'}`} onClick={() => onNavigate(index)}>{String(index + 1).padStart(2, '0')}</button>)}</nav>
      <p className="quiz-answer-count" role="status">Đã trả lời {answeredCount}/10 câu. Bạn có thể xem lại và đổi đáp án trước khi nộp.</p>
      <button className="text-button" onClick={onSupport}>Nơi tìm hỗ trợ <Icon name="external"/></button>
    </div>
    <div className="quiz-card">
      <div className="quiz-progress-heading"><span className="eyebrow">{question.title}</span><span><strong>{String(state.questionIndex + 1).padStart(2, '0')}</strong> / 10</span></div>
      <div className="quiz-progress" aria-hidden="true"><span style={{ width: `${(state.questionIndex + 1) * 10}%` }}/></div>
      <fieldset key={question.id}>
        <legend tabIndex={-1} ref={questionRef}>{question.question}</legend>
        <div className="quiz-options">{question.options.map(option => <label className={`quiz-option ${state.answers[question.id] === option.id ? 'is-selected' : ''}`} key={option.id}>
          <input type="radio" name={`quiz-${question.id}`} value={option.id} checked={state.answers[question.id] === option.id} onChange={() => onAnswer(question.id, option.id)}/>
          <span className="choice-letter">{option.id}</span><span>{option.text}</span><span className="radio-indicator" aria-hidden="true">{state.answers[question.id] === option.id && <Icon name="check"/>}</span>
        </label>)}</div>
      </fieldset>
      <div className="quiz-card-footer quiz-pagination">
        <button className="text-button" disabled={state.questionIndex === 0} onClick={() => onNavigate(state.questionIndex - 1)}><Icon name="back"/> Trước</button>
        <button className="text-button" disabled={state.questionIndex === questions.length - 1} onClick={() => onNavigate(state.questionIndex + 1)}>Sau <Icon name="arrow"/></button>
        <button className="button button--primary quiz-submit" disabled={!canSubmit} onClick={onSubmit}>Nộp bài</button>
      </div>
      <button className="text-button quiz-back" onClick={onBack}><Icon name="back"/> Về kết thúc</button>
    </div>
  </section>
}
