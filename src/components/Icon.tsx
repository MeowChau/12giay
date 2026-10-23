type IconName = 'arrow' | 'back' | 'help' | 'close' | 'play' | 'external' | 'check' | 'shield' | 'music' | 'musicOff'

const paths: Record<IconName, string> = {
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  back: 'M20 12H5m6-6-6 6 6 6',
  help: 'M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4m0 3h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  close: 'm6 6 12 12M6 18 18 6',
  play: 'm9 5 11 7-11 7V5Z',
  external: 'M14 4h6v6m0-6L10 14M9 4H4v16h16v-5',
  check: 'm5 12 4 4L19 6',
  shield: 'M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7l-9-4Zm-4 9 3 3 5-5',
  music: 'M9 18V5l11-2v13M9 8l11-2M9 18a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Zm11-2a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Z',
  musicOff: 'm3 3 18 18M9 9v9a3 3 0 1 1-3-3m3-10 11-2v13m-7-9 7-1',
}

export default function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
