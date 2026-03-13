import React from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Path,
  G,
  Line,
} from 'react-native-svg';
import { COLORS } from '../constants/theme';

// ─── Color palette (more purple-grey like original) ──────────────────
const C = {
  body: '#B5B0C4',        // lavender-grey body
  bodyLight: '#D4D0DE',   // lighter belly/face
  mask: '#2A2A2E',        // near-black mask
  earOuter: '#2A2A2E',    // black ears
  earInner: '#4A4A50',    // slightly lighter inner ear
  outline: '#1A1A1E',     // bold black outlines
  white: '#FFFFFF',
  pupil: '#1A1A1E',
  nose: '#2A2A2E',
  tongue: '#F48FB1',
  mouthInner: '#3A3A3E',
  blush: 'rgba(255, 150, 170, 0.5)',
  heart: '#EF5353',
  tailDark: '#2A2A2E',
  tailLight: '#B5B0C4',
  sparkle: '#FFD700',
  heartEye: '#EF5353',
};

const STROKE = 3;

// ─── Ears ─────────────────────────────────────────────────────────────

function Ears({ outline }) {
  return (
    <G>
      {/* Left ear - big, pointed, black */}
      <Path
        d="M 58 48 L 38 8 L 72 32 Z"
        fill={C.earOuter}
        stroke={outline}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <Path
        d="M 60 44 L 46 18 L 68 34 Z"
        fill={C.earInner}
        opacity={0.4}
      />
      {/* Right ear - big, pointed, black */}
      <Path
        d="M 142 48 L 162 8 L 128 32 Z"
        fill={C.earOuter}
        stroke={outline}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <Path
        d="M 140 44 L 154 18 L 132 34 Z"
        fill={C.earInner}
        opacity={0.4}
      />
    </G>
  );
}

// ─── Head ─────────────────────────────────────────────────────────────

function Head({ outline }) {
  return (
    <G>
      {/* Main head - very round */}
      <Circle
        cx="100"
        cy="68"
        r="50"
        fill={C.body}
        stroke={outline}
        strokeWidth={STROKE}
      />
      {/* Lighter lower face area */}
      <Ellipse
        cx="100"
        cy="82"
        rx="30"
        ry="22"
        fill={C.bodyLight}
      />
      {/* Fur tuft on top */}
      <Path
        d="M 88 22 Q 92 14 96 20 Q 98 12 102 18 Q 104 10 108 18 Q 112 12 112 22"
        fill={C.body}
        stroke={outline}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  );
}

// ─── Mask (bandit mask across eyes) ───────────────────────────────────

function Mask() {
  return (
    <Path
      d="M 48 56
         Q 56 46 72 50
         Q 86 53 100 56
         Q 114 53 128 50
         Q 144 46 152 56
         Q 156 68 146 76
         Q 136 82 124 74
         Q 114 68 100 68
         Q 86 68 76 74
         Q 64 82 54 76
         Q 44 68 48 56 Z"
      fill={C.mask}
    />
  );
}

// ─── Eyes (MUCH bigger - key difference) ──────────────────────────────

function Eyes({ mood, outline }) {
  if (mood === 'sleeping') {
    return (
      <G>
        {/* Closed eyes - thick curved lines */}
        <Path
          d="M 64 62 Q 75 54 86 62"
          fill="none"
          stroke={C.white}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Path
          d="M 114 62 Q 125 54 136 62"
          fill="none"
          stroke={C.white}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </G>
    );
  }

  if (mood === 'love') {
    return (
      <G>
        {/* Big heart eyes */}
        <Path
          d="M 64 58 C 64 50 70 46 75 54 C 80 46 86 50 86 58 C 86 68 75 76 75 76 C 75 76 64 68 64 58 Z"
          fill={C.heartEye}
          stroke={outline}
          strokeWidth={2}
        />
        <Path
          d="M 114 58 C 114 50 120 46 125 54 C 130 46 136 50 136 58 C 136 68 125 76 125 76 C 125 76 114 68 114 58 Z"
          fill={C.heartEye}
          stroke={outline}
          strokeWidth={2}
        />
      </G>
    );
  }

  const lookRight = mood === 'thinking';
  const big = mood === 'excited';

  // Eyes are VERY large - ~15px radius
  const eyeRx = big ? 14 : 13;
  const eyeRy = big ? 16 : 15;
  const pupilR = big ? 9 : 8;
  const highlightR = big ? 4 : 3.5;
  const smallHighlightR = 1.8;
  const pupilOffX = lookRight ? 3 : 0;
  const pupilOffY = lookRight ? -1 : 0;

  return (
    <G>
      {/* Left eye - BIG white oval */}
      <Ellipse
        cx="75"
        cy="62"
        rx={eyeRx}
        ry={eyeRy}
        fill={C.white}
        stroke={outline}
        strokeWidth={2}
      />
      {/* Left pupil - large, fills most of eye */}
      <Circle cx={75 + pupilOffX} cy={62 + pupilOffY} r={pupilR} fill={C.pupil} />
      {/* Left highlight - single large white dot (upper-right) */}
      <Circle cx={79 + pupilOffX} cy={57 + pupilOffY} r={highlightR} fill={C.white} />
      {/* Small secondary highlight */}
      <Circle cx={73 + pupilOffX} cy={67 + pupilOffY} r={smallHighlightR} fill={C.white} />

      {/* Right eye - BIG white oval */}
      <Ellipse
        cx="125"
        cy="62"
        rx={eyeRx}
        ry={eyeRy}
        fill={C.white}
        stroke={outline}
        strokeWidth={2}
      />
      {/* Right pupil */}
      <Circle cx={125 + pupilOffX} cy={62 + pupilOffY} r={pupilR} fill={C.pupil} />
      {/* Right highlight */}
      <Circle cx={129 + pupilOffX} cy={57 + pupilOffY} r={highlightR} fill={C.white} />
      <Circle cx={123 + pupilOffX} cy={67 + pupilOffY} r={smallHighlightR} fill={C.white} />
    </G>
  );
}

// ─── Nose ─────────────────────────────────────────────────────────────

function Nose({ outline }) {
  return (
    <G>
      <Ellipse cx="100" cy="82" rx="5" ry="3.5" fill={C.nose} stroke={outline} strokeWidth={1.5} />
      <Ellipse cx="98" cy="81" rx="1.5" ry="1" fill="rgba(255,255,255,0.25)" />
    </G>
  );
}

// ─── Mouth ────────────────────────────────────────────────────────────

function Mouth({ mood }) {
  if (mood === 'excited' || mood === 'eating') {
    // Big open happy mouth
    return (
      <G>
        <Path
          d="M 86 88 Q 93 104 100 104 Q 107 104 114 88 Z"
          fill={C.mouthInner}
          stroke={C.outline}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
        <Ellipse cx="100" cy="99" rx="7" ry="5.5" fill={C.tongue} />
      </G>
    );
  }
  if (mood === 'sleeping') {
    return (
      <Path
        d="M 94 88 Q 100 92 106 88"
        fill="none"
        stroke={C.outline}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    );
  }
  if (mood === 'thinking') {
    return (
      <Path
        d="M 92 90 Q 96 87 100 90 Q 104 93 108 90"
        fill="none"
        stroke={C.outline}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    );
  }
  if (mood === 'love') {
    // Cat smile
    return (
      <Path
        d="M 86 86 Q 93 96 100 92 Q 107 96 114 86"
        fill="none"
        stroke={C.outline}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
  // Default - open smile showing tongue
  return (
    <G>
      <Path
        d="M 88 86 Q 94 98 100 98 Q 106 98 112 86"
        fill={C.mouthInner}
        stroke={C.outline}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Ellipse cx="100" cy="95" rx="5" ry="4" fill={C.tongue} />
    </G>
  );
}

// ─── Blush marks ──────────────────────────────────────────────────────

function Blush() {
  return (
    <G>
      <Ellipse cx="56" cy="78" rx="9" ry="6" fill={C.blush} />
      <Ellipse cx="144" cy="78" rx="9" ry="6" fill={C.blush} />
    </G>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────

function Body({ outline }) {
  return (
    <G>
      {/* Main body - round chubby */}
      <Ellipse
        cx="100"
        cy="158"
        rx="46"
        ry="48"
        fill={C.body}
        stroke={outline}
        strokeWidth={STROKE}
      />
      {/* Belly - lighter area */}
      <Ellipse
        cx="100"
        cy="162"
        rx="30"
        ry="34"
        fill={C.bodyLight}
      />
      {/* White heart on chest */}
      <Path
        d="M 93 138 C 93 133 96 131 100 136 C 104 131 107 133 107 138 C 107 144 100 150 100 150 C 100 150 93 144 93 138 Z"
        fill={C.white}
        stroke={outline}
        strokeWidth={1.5}
      />
    </G>
  );
}

// ─── Arms ─────────────────────────────────────────────────────────────

function ArmSegment({ path, outline }) {
  return (
    <G>
      <Path d={path} fill="none" stroke={C.body} strokeWidth={14} strokeLinecap="round" />
      <Path d={path} fill="none" stroke={outline} strokeWidth={STROKE} strokeLinecap="round" />
    </G>
  );
}

function Paw({ cx, cy, outline }) {
  return <Circle cx={cx} cy={cy} r="7" fill={C.bodyLight} stroke={outline} strokeWidth={STROKE} />;
}

function ArmsDefault({ outline }) {
  return (
    <G>
      <ArmSegment path="M 58 145 Q 38 150 34 165 Q 32 172 38 175" outline={outline} />
      <Paw cx={38} cy={175} outline={outline} />
      <ArmSegment path="M 142 145 Q 162 150 166 165 Q 168 172 162 175" outline={outline} />
      <Paw cx={162} cy={175} outline={outline} />
    </G>
  );
}

function ArmsExcited({ outline }) {
  return (
    <G>
      <ArmSegment path="M 58 142 Q 32 125 28 108" outline={outline} />
      <Paw cx={28} cy={108} outline={outline} />
      <ArmSegment path="M 142 142 Q 168 125 172 108" outline={outline} />
      <Paw cx={172} cy={108} outline={outline} />
    </G>
  );
}

function ArmsWaving({ outline }) {
  return (
    <G>
      <ArmSegment path="M 58 145 Q 38 150 34 165 Q 32 172 38 175" outline={outline} />
      <Paw cx={38} cy={175} outline={outline} />
      <ArmSegment path="M 142 140 Q 170 118 175 95" outline={outline} />
      <Paw cx={175} cy={95} outline={outline} />
      {/* Motion lines */}
      <Line x1="182" y1="88" x2="190" y2="82" stroke={COLORS.textMuted} strokeWidth={2} strokeLinecap="round" />
      <Line x1="184" y1="96" x2="192" y2="93" stroke={COLORS.textMuted} strokeWidth={2} strokeLinecap="round" />
      <Line x1="183" y1="104" x2="191" y2="103" stroke={COLORS.textMuted} strokeWidth={1.5} strokeLinecap="round" />
    </G>
  );
}

function ArmsThinking({ outline }) {
  return (
    <G>
      <ArmSegment path="M 58 145 Q 38 150 34 165 Q 32 172 38 175" outline={outline} />
      <Paw cx={38} cy={175} outline={outline} />
      <ArmSegment path="M 142 145 Q 155 130 140 108 Q 132 98 125 95" outline={outline} />
      <Paw cx={125} cy={95} outline={outline} />
    </G>
  );
}

function ArmsLove({ outline }) {
  return (
    <G>
      <ArmSegment path="M 58 142 Q 40 130 55 115 Q 68 105 82 110" outline={outline} />
      <Paw cx={82} cy={110} outline={outline} />
      <ArmSegment path="M 142 142 Q 160 130 145 115 Q 132 105 118 110" outline={outline} />
      <Paw cx={118} cy={110} outline={outline} />
    </G>
  );
}

function ArmsEating({ outline }) {
  return (
    <G>
      <ArmSegment path="M 58 142 Q 38 128 42 110" outline={outline} />
      <Paw cx={42} cy={110} outline={outline} />
      {/* Food item - apple */}
      <Circle cx="42" cy="100" r="9" fill="#EF5353" stroke={outline} strokeWidth={1.5} />
      <Path d="M 42 91 Q 44 86 47 88" fill="none" stroke="#E8813A" strokeWidth={2} strokeLinecap="round" />
      <Ellipse cx="46" cy="89" rx="4" ry="2" fill="#E8813A" transform="rotate(-30, 46, 89)" />
      <ArmSegment path="M 142 145 Q 162 150 166 165 Q 168 172 162 175" outline={outline} />
      <Paw cx={162} cy={175} outline={outline} />
    </G>
  );
}

function Arms({ mood, outline }) {
  switch (mood) {
    case 'excited': return <ArmsExcited outline={outline} />;
    case 'waving': return <ArmsWaving outline={outline} />;
    case 'thinking': return <ArmsThinking outline={outline} />;
    case 'love': return <ArmsLove outline={outline} />;
    case 'eating': return <ArmsEating outline={outline} />;
    default: return <ArmsDefault outline={outline} />;
  }
}

// ─── Legs ─────────────────────────────────────────────────────────────

function Legs({ outline }) {
  return (
    <G>
      <Ellipse cx="78" cy="205" rx="14" ry="10" fill={C.body} stroke={outline} strokeWidth={STROKE} />
      <Ellipse cx="74" cy="212" rx="16" ry="8" fill={C.bodyLight} stroke={outline} strokeWidth={STROKE} />
      <Ellipse cx="122" cy="205" rx="14" ry="10" fill={C.body} stroke={outline} strokeWidth={STROKE} />
      <Ellipse cx="126" cy="212" rx="16" ry="8" fill={C.bodyLight} stroke={outline} strokeWidth={STROKE} />
    </G>
  );
}

// ─── Tail (thick striped) ─────────────────────────────────────────────

function TailStanding({ outline }) {
  const tailPath = "M 145 180 Q 175 170 185 145 Q 192 125 182 108 Q 175 98 178 88";
  return (
    <G>
      {/* Base tail */}
      <Path d={tailPath} fill="none" stroke={C.tailLight} strokeWidth={18} strokeLinecap="round" />
      {/* Dark stripes */}
      <Path d="M 170 166 Q 180 158 184 148" fill="none" stroke={C.tailDark} strokeWidth={18} strokeLinecap="round" />
      <Path d="M 188 132 Q 190 124 186 115" fill="none" stroke={C.tailDark} strokeWidth={18} strokeLinecap="round" />
      <Path d="M 180 102 Q 176 96 178 88" fill="none" stroke={C.tailDark} strokeWidth={16} strokeLinecap="round" />
      {/* Outline */}
      <Path d={tailPath} fill="none" stroke={outline} strokeWidth={STROKE} strokeLinecap="round" />
    </G>
  );
}

// ─── Sleeping body (curled up) ────────────────────────────────────────

function SleepingBody({ outline }) {
  return (
    <G>
      <Ellipse cx="100" cy="165" rx="55" ry="38" fill={C.body} stroke={outline} strokeWidth={STROKE} />
      <Ellipse cx="100" cy="168" rx="38" ry="26" fill={C.bodyLight} />
      {/* Heart on chest */}
      <Path
        d="M 95 150 C 95 147 97 146 100 148.5 C 103 146 105 147 105 150 C 105 153.5 100 157 100 157 C 100 157 95 153.5 95 150 Z"
        fill={C.white}
        stroke={outline}
        strokeWidth={1}
      />
      {/* Tucked paws */}
      <Ellipse cx="78" cy="180" rx="10" ry="7" fill={C.bodyLight} stroke={outline} strokeWidth={STROKE} />
      <Ellipse cx="122" cy="180" rx="10" ry="7" fill={C.bodyLight} stroke={outline} strokeWidth={STROKE} />
      {/* Tail wrapped around */}
      <Path d="M 50 170 Q 30 165 25 150 Q 22 138 30 128 Q 38 120 50 118" fill="none" stroke={C.tailLight} strokeWidth={16} strokeLinecap="round" />
      <Path d="M 35 160 Q 28 152 26 144" fill="none" stroke={C.tailDark} strokeWidth={16} strokeLinecap="round" />
      <Path d="M 29 136 Q 30 130 35 124" fill="none" stroke={C.tailDark} strokeWidth={16} strokeLinecap="round" />
      <Path d="M 50 170 Q 30 165 25 150 Q 22 138 30 128 Q 38 120 50 118" fill="none" stroke={outline} strokeWidth={STROKE} strokeLinecap="round" />
      <Circle cx="50" cy="118" r="7" fill={C.tailDark} stroke={outline} strokeWidth={STROKE} />
    </G>
  );
}

// ─── Peeking pose ─────────────────────────────────────────────────────

function PeekingBody({ outline }) {
  return (
    <G>
      {/* Paws gripping edge */}
      <Ellipse cx="65" cy="116" rx="12" ry="8" fill={C.bodyLight} stroke={outline} strokeWidth={STROKE} />
      <Ellipse cx="135" cy="116" rx="12" ry="8" fill={C.bodyLight} stroke={outline} strokeWidth={STROKE} />
      {/* Paw toes */}
      <Circle cx="58" cy="113" r="3" fill={C.body} stroke={outline} strokeWidth={1} />
      <Circle cx="65" cy="111" r="3" fill={C.body} stroke={outline} strokeWidth={1} />
      <Circle cx="72" cy="113" r="3" fill={C.body} stroke={outline} strokeWidth={1} />
      <Circle cx="128" cy="113" r="3" fill={C.body} stroke={outline} strokeWidth={1} />
      <Circle cx="135" cy="111" r="3" fill={C.body} stroke={outline} strokeWidth={1} />
      <Circle cx="142" cy="113" r="3" fill={C.body} stroke={outline} strokeWidth={1} />
    </G>
  );
}

// ─── Decorations ──────────────────────────────────────────────────────

function Sparkles() {
  return (
    <G>
      <Path d="M 18 30 L 22 38 L 26 30 L 22 22 Z" fill={C.sparkle} />
      <Path d="M 170 20 L 173 26 L 176 20 L 173 14 Z" fill={C.sparkle} />
      <Path d="M 8 70 L 10 74 L 12 70 L 10 66 Z" fill={C.sparkle} opacity={0.7} />
      <Path d="M 190 55 L 192 59 L 194 55 L 192 51 Z" fill={C.sparkle} opacity={0.7} />
      <Circle cx="22" cy="30" r="1.5" fill={C.sparkle} />
      <Circle cx="173" cy="20" r="1.5" fill={C.sparkle} />
    </G>
  );
}

function ZzzBubbles() {
  return (
    <G>
      <Path
        d="M 155 30 L 165 30 L 155 40 L 165 40"
        fill="none" stroke={COLORS.textMuted} strokeWidth={2.5}
        strokeLinecap="round" strokeLinejoin="round"
      />
      <Path
        d="M 168 16 L 178 16 L 168 26 L 178 26"
        fill="none" stroke={COLORS.textMuted} strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" opacity={0.6}
      />
      <Path
        d="M 180 4 L 188 4 L 180 12 L 188 12"
        fill="none" stroke={COLORS.textMuted} strokeWidth={1.5}
        strokeLinecap="round" strokeLinejoin="round" opacity={0.3}
      />
    </G>
  );
}

function ThoughtDots() {
  return (
    <G>
      <Circle cx="165" cy="40" r="3" fill={COLORS.textMuted} />
      <Circle cx="174" cy="28" r="3.5" fill={COLORS.textMuted} opacity={0.7} />
      <Circle cx="183" cy="16" r="4" fill={COLORS.textMuted} opacity={0.4} />
    </G>
  );
}

function FloatingHearts() {
  return (
    <G>
      <Path
        d="M 24 28 C 24 25 27 23 29 26 C 31 23 34 25 34 28 C 34 32 29 36 29 36 C 29 36 24 32 24 28 Z"
        fill={C.heart} opacity={0.8}
      />
      <Path
        d="M 164 14 C 164 11 167 9 169 12 C 171 9 174 11 174 14 C 174 18 169 22 169 22 C 169 22 164 18 164 14 Z"
        fill={C.heart} opacity={0.6}
      />
      <Path
        d="M 180 40 C 180 38 182 37 183 38.5 C 184 37 186 38 186 40 C 186 42.5 183 44.5 183 44.5 C 183 44.5 180 42.5 180 40 Z"
        fill={C.heart} opacity={0.4}
      />
    </G>
  );
}

// ─── Main component ──────────────────────────────────────────────────

export default function RaccoonAvatar({ mood = 'happy', size = 120, style }) {
  const outline = C.outline;
  const isPeeking = mood === 'peeking';
  const isSleeping = mood === 'sleeping';

  const viewBox = isPeeking ? '0 0 200 120' : '0 0 200 240';
  const aspectRatio = isPeeking ? 200 / 120 : 200 / 240;
  const width = size;
  const height = size / aspectRatio;
  const showBlush = ['happy', 'excited', 'love', 'waving', 'eating', 'peeking'].includes(mood);

  if (isPeeking) {
    return (
      <View style={[{ width, height }, style]}>
        <Svg width={width} height={height} viewBox={viewBox}>
          <Ears outline={outline} />
          <Head outline={outline} />
          <Mask />
          <Eyes mood="happy" outline={outline} />
          <Nose outline={outline} />
          <Mouth mood="happy" />
          {showBlush && <Blush />}
          <PeekingBody outline={outline} />
        </Svg>
      </View>
    );
  }

  if (isSleeping) {
    return (
      <View style={[{ width, height }, style]}>
        <Svg width={width} height={height} viewBox={viewBox}>
          <SleepingBody outline={outline} />
          <Ears outline={outline} />
          <Head outline={outline} />
          <Mask />
          <Eyes mood="sleeping" outline={outline} />
          <Nose outline={outline} />
          <Mouth mood="sleeping" />
          <ZzzBubbles />
        </Svg>
      </View>
    );
  }

  // All standing poses
  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height} viewBox={viewBox}>
        <TailStanding outline={outline} />
        <Legs outline={outline} />
        <Body outline={outline} />
        <Arms mood={mood} outline={outline} />
        <Ears outline={outline} />
        <Head outline={outline} />
        <Mask />
        <Eyes mood={mood} outline={outline} />
        <Nose outline={outline} />
        <Mouth mood={mood} />
        {showBlush && <Blush />}
        {mood === 'excited' && <Sparkles />}
        {mood === 'thinking' && <ThoughtDots />}
        {mood === 'love' && <FloatingHearts />}
      </Svg>
    </View>
  );
}
