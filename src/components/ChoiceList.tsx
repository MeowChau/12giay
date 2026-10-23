import Icon from './Icon'
import type { OptionPreview } from '../types/ui'

export default function ChoiceList({ options, selected, locked = false, onSelect }: { options: readonly OptionPreview[]; selected: string | null; locked?: boolean; onSelect: (id: string) => void }) {
  return <div className="choice-list" role="group" aria-label="Lựa chọn">{options.map((option, index) => <button key={option.id} className={`choice-button ${selected === option.id ? 'is-selected' : ''}`} aria-pressed={selected === option.id} disabled={locked} onClick={() => onSelect(option.id)}><span className="choice-letter">{String.fromCharCode(65 + index)}</span><span>{option.text}</span>{selected === option.id ? <Icon name="check"/> : <Icon name="arrow"/>}</button>)}</div>
}
