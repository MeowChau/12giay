import { useId } from 'react'
import type { Backdrop, PortraitId } from '../types/ui'

export function SceneArtwork({ scene = 'hallway', className = '' }: { scene?: Backdrop; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const fill = (name: string) => `url(#${uid}-${name})`
  return (
    <div className={`scene-art scene-art--${scene} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1400 850" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id={`${uid}-sky`} x2="0" y2="1"><stop stopColor="#afdce1"/><stop offset=".6" stopColor="#fff0bb"/><stop offset="1" stopColor="#ebcd8f"/></linearGradient>
          <linearGradient id={`${uid}-wall`} x2="1" y2=".5"><stop stopColor="#f5edcc"/><stop offset=".7" stopColor="#e2dcc0"/><stop offset="1" stopColor="#c2ccb7"/></linearGradient>
          <linearGradient id={`${uid}-floor`} x2=".5" y2="1"><stop stopColor="#eee3bf"/><stop offset="1" stopColor="#c5bc96"/></linearGradient>
          <linearGradient id={`${uid}-light`} x2=".7" y2="1"><stop stopColor="#fff1b5" stopOpacity=".55"/><stop offset="1" stopColor="#fff1b5" stopOpacity="0"/></linearGradient>
          <radialGradient id={`${uid}-glow`}><stop stopColor="#fff1ab" stopOpacity=".5"/><stop offset="1" stopColor="#ffec9b" stopOpacity="0"/></radialGradient>
        </defs>
        <rect width="1400" height="850" fill="#e8dec0"/>
        {scene === 'hallway' && <>
          <path d="M0 0h1400L815 270H610Z" fill="#f6f0da"/>
          <path d="M0 0 610 270v310L0 850Z" fill={fill('wall')}/>
          <path d="m1400 0-585 270v310l585 270Z" fill="#d5d4bc"/>
          <path d="M610 270h205v310H610Z" fill="#fff4cb"/>
          <path d="M0 850 610 580h205l585 270Z" fill={fill('floor')}/>
          <path d="M642 310h138v270H642Z" fill="#a6bba9" stroke="#a3aa8d" strokeWidth="10"/>
          <path d="M656 327h109v170H656Z" fill={fill('sky')}/>
          <path d="M710 327v170m-54-85h109" stroke="#a4bba8" strokeWidth="5"/>
          <path d="M35 82 250 163v343L35 561Z" fill={fill('sky')} stroke="#fff9e7" strokeWidth="10"/>
          <path d="m281 173 140 53v236l-140 35Z" fill={fill('sky')} stroke="#fff9e7" strokeWidth="8"/>
          <path d="m447 234 91 34v164l-91 23Z" fill={fill('sky')} stroke="#fff9e7" strokeWidth="6"/>
          <path d="m557 275 39 15v124l-39 10Z" fill={fill('sky')} stroke="#fff9e7" strokeWidth="4"/>
          <path d="M137 121v414M35 320l215 8m100-130v282m-69-145 140-2m73-81v192m-47-109 91-2" stroke="#c6d0b7" strokeWidth="7"/>
          <path d="m0 605 610-142m-610 167 610-149" stroke="#fff3cf" strokeWidth="9"/>
          <path d="M885 242v371m120-424v480m179-562v654m-299-519 120-42v307l-120-34m120-273 179-64v434l-179-44" fill="#b9c9ac" stroke="#9cad93" strokeWidth="11"/>
          <path d="m1062 259 75-21v147l-75 7Z" fill="#e3e6c3" opacity=".4"/>
          <path d="m0 850 675-270m725 270L754 580M332 850l364-270m399 270L736 580M0 759h1400M220 680h960M431 624h556" stroke="#a59973" strokeOpacity=".22" strokeWidth="2"/>
          <path d="m36 561 213-55 587 344H397Zm245-64 140-35 494 388H731Z" fill={fill('light')}/>
          <path d="m405 121 336 124h42L486 121Z" fill="#fff7ce" opacity=".5"/>
          <path d="m1026 126-213 118h-28l174-118Z" fill="#fff5d0" opacity=".25"/>
          <ellipse cx="229" cy="323" rx="430" ry="490" fill={fill('glow')}/>
          <path d="m1050 794 134-46 106 39-135 51Z" fill="#fffdf0"/>
          <path d="m1117 813 111-31 70 35-107 30Z" fill="#e0e6cf"/>
          <path d="m1092 786 96-26m-74 40 72-21" stroke="#9fac90" strokeWidth="2"/>
        </>}
        {scene === 'classroom' && <>
          <rect width="1400" height="580" fill={fill('wall')}/><path d="M0 580h1400v270H0Z" fill={fill('floor')}/>
          <path d="M0 60h395v448H0Z" fill={fill('sky')} stroke="#fff8df" strokeWidth="15"/>
          <path d="M126 60v448M264 60v448M0 287h395" stroke="#bbcbb1" strokeWidth="10"/>
          <path d="M505 124h746v342H505Z" fill="#7d9e80" stroke="#c9b57d" strokeWidth="13"/>
          <path d="M563 196h260m-260 38h342m-342 38h176" stroke="#f7f5d9" strokeWidth="3" opacity=".38"/>
          <path d="M501 475h761" stroke="#d9bd7e" strokeWidth="12"/>
          {[0, 1, 2].map(row => [0, 1, 2].map(col => <g key={`${row}-${col}`} transform={`translate(${280 + col * 330 - row * 60} ${540 + row * 133}) scale(${.65 + row * .17})`}><path d="M0 0h260l56 48H-34Z" fill="#e7c589" stroke="#adab85" strokeWidth="4"/><path d="M-16 48v116m304-116v116M28 72h215v45H28Zm10 45v68m191-68v68" fill="#b4c2a4" stroke="#93a58c" strokeWidth="8"/></g>))}
          <path d="M0 505 393 507l540 343H226Z" fill={fill('light')}/>
          <ellipse cx="115" cy="305" rx="440" ry="510" fill={fill('glow')}/>
        </>}
        {scene === 'teacherroom' && <>
          <rect width="1400" height="600" fill={fill('wall')}/><path d="M0 600h1400v250H0Z" fill={fill('floor')}/>
          <rect x="73" y="92" width="369" height="420" fill={fill('sky')} stroke="#fff8e4" strokeWidth="15"/>
          <path d="M250 92v420M73 298h369" stroke="#b4c6ab" strokeWidth="9"/>
          <rect x="891" y="133" width="351" height="472" fill="#b8c6a5" stroke="#9aaa8f" strokeWidth="13"/>
          {[235, 361, 490].map(y => <g key={y}><path d={`M900 ${y}h331`} stroke="#e8d4a6" strokeWidth="9"/>{[0, 1, 2, 3, 4, 5, 6, 7].map(n => <rect key={n} x={919 + n * 37} y={y - 77 - n % 3 * 4} width="24" height={72 + n % 3 * 4} fill={['#d5b67d','#97bba6','#f1d99b'][n % 3]}/>)}</g>)}
          <path d="m342 621 559-35 186 129-734 55Z" fill="#dfbd82" stroke="#b2ad87" strokeWidth="8"/>
          <path d="M374 763v87m654-126v126" stroke="#a4ad91" strokeWidth="22"/>
          <path d="m585 629 183-8 52 58-196 15Z" fill="#fffdf0"/><path d="m623 644 120-5m-104 18 87-5" stroke="#a8b493" strokeWidth="3"/>
          <path d="M599 595v-86q0-48 40-53m0 0 75 20-83 25Z" fill="#c0d1ab" stroke="#9aae90" strokeWidth="9"/>
          <ellipse cx="166" cy="338" rx="485" ry="520" fill={fill('glow')}/>
        </>}
        {scene === 'chatroom' && <>
          <rect width="1400" height="850" fill="#e8e3ca"/>
          <path d="M0 0h360v850H0Z" fill="#d1dbbf"/><path d="M20 60h305v530H20Z" fill={fill('sky')} opacity=".35"/>
          <path d="M0 306h340M175 0v610" stroke="#b3c0a4" strokeWidth="16"/>
          <rect x="639" y="77" width="415" height="721" rx="40" fill="#8d9d82" stroke="#aebba0" strokeWidth="3"/>
          <rect x="654" y="93" width="385" height="686" rx="29" fill="#fffdf4"/>
          <path d="M783 110h126" stroke="#9aaa8d" strokeWidth="15" strokeLinecap="round"/>
          <circle cx="704" cy="176" r="21" fill="#efd18a"/>
          <path d="M746 166h120m-120 22h78" stroke="#a4b59c" strokeWidth="8" strokeLinecap="round"/>
          <rect x="685" y="232" width="323" height="207" rx="9" fill="#d5e4c9"/>
          <path d="m812 295 58 35-58 35Z" fill="#758d70"/>
          <rect x="685" y="467" width="231" height="55" rx="12" fill="#edf0df"/>
          <rect x="772" y="545" width="237" height="55" rx="12" fill="#f9e7ae"/>
          <rect x="685" y="624" width="201" height="55" rx="12" fill="#edf0df"/>
          <path d="M710 491h171m-85 79h184m-271 78h142" stroke="#9fad92" strokeWidth="7" opacity=".5" strokeLinecap="round"/>
          <ellipse cx="112" cy="294" rx="508" ry="519" fill={fill('glow')}/>
        </>}
      </svg>
    </div>
  )
}

export function Portrait({ character, className = '' }: { character: PortraitId; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const isKhai = character === 'khai'
  const isMai = character === 'mai'
  return (
    <svg className={`portrait ${className}`} viewBox="0 0 420 560" fill="none" aria-hidden="true" focusable="false">
      <defs><linearGradient id={`${uid}-shirt`} x2="1" y2="1"><stop stopColor="#fffef5"/><stop offset="1" stopColor="#c8d6c5"/></linearGradient><linearGradient id={`${uid}-skin`} x2="1" y2="1"><stop stopColor="#efd0b4"/><stop offset="1" stopColor="#c99c86"/></linearGradient></defs>
      <path d={isKhai ? 'M120 251q-24-75-5-139Q145 32 228 57q100 0 93 124l-19 90Z' : isMai ? 'M108 327Q66 159 126 85q71-76 153-8 67 72 36 256Z' : 'M95 297Q73 173 106 105q39-76 122-63 99 7 101 135l-3 124-53 34-132-9Z'} fill={isMai ? '#3a3032' : '#202d39'} stroke="#152531" strokeWidth="4"/>
      <path d="m171 276-6 54-32 21 73 96 83-96-37-23-5-52Z" fill={`url(#${uid}-skin)`}/>
      <path d="M172 287q39 28 75-2l2 27q-38 23-78-4Z" fill="#b68a78" opacity=".5"/>
      <path d="M50 560 70 391q6-40 68-55l29-10 42 31 44-30 33 11q65 15 74 52l20 170Z" fill={`url(#${uid}-shirt)`} stroke="#91a48e" strokeWidth="3"/>
      <path d="m166 327 43 30-30 52-40-68Zm87 0-44 30 30 52 40-68Z" fill="#fffef8" stroke="#8ca1a5" strokeWidth="2"/>
      <path d="m209 358-16 26 14 22-17 100 20 24 20-24-19-100 14-22Z" fill={isMai ? '#7e5d64' : '#3f596b'}/>
      <path d="m101 414-8 146m225-146 14 146M145 452h39v42h-39Z" stroke="#91a6ad" strokeWidth="3"/>
      <path d="M126 175q-20-13-19 17 0 26 22 27m169-44q21-11 18 18-1 23-21 27" fill="#cea28c"/>
      <path d="M123 154q-2 86 19 119 27 43 68 48 43-5 70-48 21-33 21-119Z" fill={`url(#${uid}-skin)`}/>
      <path d={isKhai ? 'M107 180q-2-114 87-117 101-19 120 107-40-6-71-55-16 44-61 52l21-44q-28 40-73 61l-3-30-14 52Z' : isMai ? 'M110 189q-13-114 94-130 114 9 110 142l-27-53q-42 12-80-39-28 55-77 61l-15 46Z' : 'M111 202q-21-115 69-137 114-25 132 131l-26-34q-51-7-73-51l-13 49-23-32-9 36-32-11-14 58Z'} fill={isMai ? '#3a3032' : '#263440'}/>
      <path d="m143 207 31-3m70 0 30 3" stroke="#53443e" strokeWidth="4" strokeLinecap="round"/>
      <path d="M143 223q16-10 32 0m69 0q16-10 32 0" stroke="#38424a" strokeWidth="4" strokeLinecap="round"/>
      <ellipse cx="161" cy="226" rx="5" ry="7" fill="#34444b"/><ellipse cx="258" cy="226" rx="5" ry="7" fill="#34444b"/>
      <path d="m208 232-4 20h8m-21 25q18 5 35-1" stroke="#a77b69" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="m136 245 23 4m100 0 20-4" stroke="#c7897e" strokeWidth="5" opacity=".38" strokeLinecap="round"/>
      {!isKhai && <path d={isMai ? 'M109 173q-15 124 20 169l-28-10q-27-76-9-156m212-12q36 95 4 176l-22 9q24-91 9-163' : 'M114 163q-11 70 19 139l-25-9q-31-59-17-115m206-17q22 78-7 145l32-11q20-85-2-125'} fill={isMai ? '#3a3032' : '#263440'}/>}
      {isMai && <path d="m289 161 17 5" stroke="#b2bbaa" strokeWidth="5" strokeLinecap="round"/>}
    </svg>
  )
}
