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

// ─── Color palette (warm orange fox) ──────────────────────────────
const C = {
  body: '#E8813A',        // warm orange body
  bodyLight: '#F5C589',   // lighter belly/face/chest
  bodyDark: '#C66A28',    // darker orange for shading
  earOuter: '#E8813A',    // orange ears
  earInner: '#F5C589',    // lighter inner ear
  outline: '#3A2A1A',     // warm dark brown outlines
  white: '#FFFFFF',
  pupil: '#1A1A1E',
  nose: '#1A1A1E',        // black nose
  tongue: '#F48FB1',
  mouthInner: '#3A2A2A',
  blush: 'rgba(255, 130, 130, 0.45)',
  heart: '#EF5353',
  tailTip: '#FFFFFF',     // white tail tip
  tailDark: '#C66A28',
  tailLight: '#E8813A',
  sparkle: '#FFD700',
  heartEye: '#EF5353',
  pawDark: '#3A2A1A',     // dark paw pads
  cheekFur: '#F5C589',    // lighter cheek fur tufts
};

const STROKE = 3;

// ─── Ears (large, triangular, fox-like) ─────────────────────────────

function Ears({ outline }) {
  return (
    <G>
      {/* Left ear - large, tall, pointed */}
      <Path
        d="M 60 50 L 42 4 L 80 36 Z"
        fill={C.earOuter}
        stroke={outline}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <Path
        d="M 62 44 L 50 16 L 74 38 Z"
        fill={C.earInner}
      />
      {/* Right ear */}
      <Path
        d="M 140 50 L 158 4 L 120 36 Z"
        fill={C.earOuter}
        stroke={outline}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <Path
        d="M 138 44 L 150 16 L 126 38 Z"
        fill={C.earInner}
      />
    </G>
  );
}

// ─── Head ─────────────────────────────────────────────────────────────

function Head({ outline }) {
  return (
    <G>
      {/* Main head - round with slight fox shape */}
      <Circle
        cx="100"
        cy="68"
        r="48"
        fill={C.body}
        stroke={outline}
        strokeWidth={STROKE}
      />
      {/* White/cream muzzle area - elongated and pointed */}
      <Path
        d="M 72 68 Q 72 58 82 56 Q 90 54 100 54 Q 110 54 118 56 Q 128 58 128 68
           Q 128 80 118 92 Q 110 100 100 102 Q 90 100 82 92 Q 72 80 72 68 Z"
        fill={C.bodyLight}
      />
      {/* Cheek fur tufts (signature fox look) */}
      <Path
        d="M 52 72 Q 48 68 50 62 Q 55 58 60 64 Q 56 70 52 72"
        fill={C.body}
        stroke={outline}
        strokeWidth={1.5}
      />
      <Path
        d="M 148 72 Q 152 68 150 62 Q 145 58 140 64 Q 144 70 148 72"
        fill={C.body}
        stroke={outline}
        strokeWidth={1.5}
      />
    </G>
  );
}

// ─── Eyes ──────────────────────────────────────────────────────────

function Eyes({ mood, outline }) {
  if (mood === 'sleeping') {
    return (
      <G>
        <Path
          d="M 68 62 Q 78 54 88 62"
          fill="none"
          stroke={outline}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Path
          d="M 112 62 Q 122 54 132 62"
          fill="none"
          stroke={outline}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </G>
    );
  }

  if (mood === 'love') {
    return (
      <G>
        <Path
          d="M 66 58 C 66 51 72 47 77 54 C 82 47 88 51 88 58 C 88 67 77 74 77 74 C 77 74 66 67 66 58 Z"
          fill={C.heartEye}
          stroke={outline}
          strokeWidth={2}
        />
        <Path
          d="M 112 58 C 112 51 118 47 123 54 C 128 47 134 51 134 58 C 134 67 123 74 123 74 C 123 74 112 67 112 58 Z"
          fill={C.heartEye}
          stroke={outline}
          strokeWidth={2}
        />
      </G>
    );
  }

  const lookRight = mood === 'thinking';
  const big = mood === 'excited';

  const eyeRx = big ? 13 : 12;
  const eyeRy = big ? 15 : 14;
  const pupilR = big ? 8 : 7;
  const highlightR = big ? 3.5 : 3;
  const smallHighlightR = 1.5;
  const pupilOffX = lookRight ? 3 : 0;
  const pupilOffY = lookRight ? -1 : 0;

  return (
    <G>
      {/* Left eye */}
      <Ellipse
        cx="78"
        cy="62"
        rx={eyeRx}
        ry={eyeRy}
        fill={C.white}
        stroke={outline}
        strokeWidth={2}
      />
      <Circle cx={78 + pupilOffX} cy={62 + pupilOffY} r={pupilR} fill={C.pupil} />
      <Circle cx={82 + pupilOffX} cy={57 + pupilOffY} r={highlightR} fill={C.white} />
      <Circle cx={76 + pupilOffX} cy={67 + pupilOffY} r={smallHighlightR} fill={C.white} />

      {/* Right eye */}
      <Ellipse
        cx="122"
        cy="62"
        rx={eyeRx}
        ry={eyeRy}
        fill={C.white}
        stroke={outline}
        strokeWidth={2}
      />
      <Circle cx={122 + pupilOffX} cy={62 + pupilOffY} r={pupilR} fill={C.pupil} />
      <Circle cx={126 + pupilOffX} cy={57 + pupilOffY} r={highlightR} fill={C.white} />
      <Circle cx={120 + pupilOffX} cy={67 + pupilOffY} r={smallHighlightR} fill={C.white} />
    </G>
  );
}

// ─── Nose ─────────────────────────────────────────────────────────────

function Nose({ outline }) {
  return (
    <G>
      {/* Triangular fox nose */}
      <Path
        d="M 94 80 L 100 76 L 106 80 Q 103 84 100 85 Q 97 84 94 80 Z"
        fill={C.nose}
        stroke={outline}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Ellipse cx="99" cy="79" rx="1.5" ry="1" fill="rgba(255,255,255,0.25)" />
    </G>
  );
}

// ─── Mouth ────────────────────────────────────────────────────────────

function Mouth({ mood }) {
  if (mood === 'excited' || mood === 'eating') {
    return (
      <G>
        <Path
          d="M 88 88 Q 94 102 100 102 Q 106 102 112 88 Z"
          fill={C.mouthInner}
          stroke={C.outline}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
        <Ellipse cx="100" cy="98" rx="7" ry="5" fill={C.tongue} />
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
    return (
      <Path
        d="M 88 86 Q 94 96 100 92 Q 106 96 112 86"
        fill="none"
        stroke={C.outline}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
  // Default - W-shaped fox smile with tongue
  return (
    <G>
      {/* Nose-to-mouth line */}
      <Line x1="100" y1="85" x2="100" y2="87" stroke={C.outline} strokeWidth={2} strokeLinecap="round" />
      {/* W-shaped mouth (signature fox) */}
      <Path
        d="M 86 88 Q 93 96 100 90 Q 107 96 114 88"
        fill="none"
        stroke={C.outline}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Little tongue peeking */}
      <Ellipse cx="100" cy="93" rx="4" ry="3" fill={C.tongue} />
    </G>
  );
}

// ─── Blush marks ──────────────────────────────────────────────────────

function Blush() {
  return (
    <G>
      <Ellipse cx="58" cy="76" rx="8" ry="5" fill={C.blush} />
      <Ellipse cx="142" cy="76" rx="8" ry="5" fill={C.blush} />
    </G>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────

function Body({ outline }) {
  return (
    <G>
      {/* Main body - sleek fox-like shape */}
      <Ellipse
        cx="100"
        cy="158"
        rx="44"
        ry="46"
        fill={C.body}
        stroke={outline}
        strokeWidth={STROKE}
      />
      {/* Cream/white chest and belly */}
      <Ellipse
        cx="100"
        cy="162"
        rx="28"
        ry="34"
        fill={C.bodyLight}
      />
      {/* Small flame/energy mark on chest */}
      <Path
        d="M 96 136 Q 98 128 100 132 Q 102 128 104 136 Q 106 142 100 148 Q 94 142 96 136 Z"
        fill="#FF9800"
        stroke={outline}
        strokeWidth={1.5}
        opacity={0.8}
      />
    </G>
  );
}

// ─── Arms ─────────────────────────────────────────────────────────────

function ArmSegment({ path, outline }) {
  return (
    <G>
      <Path d={path} fill="none" stroke={C.body} strokeWidth={12} strokeLinecap="round" />
      <Path d={path} fill="none" stroke={outline} strokeWidth={STROKE} strokeLinecap="round" />
    </G>
  );
}

function Paw({ cx, cy, outline }) {
  return (
    <G>
      <Circle cx={cx} cy={cy} r="7" fill={C.bodyLight} stroke={outline} strokeWidth={STROKE} />
      {/* Tiny paw pad details */}
      <Circle cx={cx - 2} cy={cy + 1} r="1.5" fill={C.pawDark} opacity={0.3} />
      <Circle cx={cx + 2} cy={cy + 1} r="1.5" fill={C.pawDark} opacity={0.3} />
    </G>
  );
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

// ─── Legs (with dark "socks") ────────────────────────────────────────

function Legs({ outline }) {
  return (
    <G>
      {/* Left leg */}
      <Ellipse cx="78" cy="205" rx="13" ry="10" fill={C.body} stroke={outline} strokeWidth={STROKE} />
      <Ellipse cx="74" cy="212" rx="15" ry="8" fill={C.pawDark} stroke={outline} strokeWidth={STROKE} />
      {/* Right leg */}
      <Ellipse cx="122" cy="205" rx="13" ry="10" fill={C.body} stroke={outline} strokeWidth={STROKE} />
      <Ellipse cx="126" cy="212" rx="15" ry="8" fill={C.pawDark} stroke={outline} strokeWidth={STROKE} />
    </G>
  );
}

// ─── Tail (big, bushy fox tail with white tip) ───────────────────────

function TailStanding({ outline }) {
  const tailPath = "M 145 178 Q 175 165 188 140 Q 196 118 184 100 Q 176 90 180 78";
  return (
    <G>
      {/* Base tail - thick and bushy */}
      <Path d={tailPath} fill="none" stroke={C.tailLight} strokeWidth={22} strokeLinecap="round" />
      {/* Darker shading stripe */}
      <Path d="M 172 158 Q 182 148 186 136" fill="none" stroke={C.tailDark} strokeWidth={20} strokeLinecap="round" />
      {/* White tip */}
      <Path d="M 182 96 Q 178 88 180 78" fill="none" stroke={C.tailTip} strokeWidth={18} strokeLinecap="round" />
      {/* Outline */}
      <Path d={tailPath} fill="none" stroke={outline} strokeWidth={STROKE} strokeLinecap="round" />
    </G>
  );
}

// ─── Sleeping body (curled up) ────────────────────────────────────

function SleepingBody({ outline }) {
  return (
    <G>
      <Ellipse cx="100" cy="165" rx="55" ry="38" fill={C.body} stroke={outline} strokeWidth={STROKE} />
      <Ellipse cx="100" cy="168" rx="38" ry="26" fill={C.bodyLight} />
      {/* Flame on chest */}
      <Path
        d="M 96 152 Q 98 147 100 149 Q 102 147 104 152 Q 105 156 100 159 Q 95 156 96 152 Z"
        fill="#FF9800"
        stroke={outline}
        strokeWidth={1}
        opacity={0.7}
      />
      {/* Tucked paws */}
      <Ellipse cx="78" cy="180" rx="10" ry="7" fill={C.bodyLight} stroke={outline} strokeWidth={STROKE} />
      <Ellipse cx="122" cy="180" rx="10" ry="7" fill={C.bodyLight} stroke={outline} strokeWidth={STROKE} />
      {/* Tail wrapped around with white tip */}
      <Path d="M 50 170 Q 30 165 25 150 Q 22 138 30 128 Q 38 120 50 118" fill="none" stroke={C.tailLight} strokeWidth={18} strokeLinecap="round" />
      <Path d="M 35 160 Q 28 152 26 144" fill="none" stroke={C.tailDark} strokeWidth={18} strokeLinecap="round" />
      <Path d="M 44 122 Q 48 118 50 118" fill="none" stroke={C.tailTip} strokeWidth={16} strokeLinecap="round" />
      <Path d="M 50 170 Q 30 165 25 150 Q 22 138 30 128 Q 38 120 50 118" fill="none" stroke={outline} strokeWidth={STROKE} strokeLinecap="round" />
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
      {/* Dark paw pad toes */}
      <Circle cx="58" cy="113" r="3" fill={C.pawDark} stroke={outline} strokeWidth={1} opacity={0.5} />
      <Circle cx="65" cy="111" r="3" fill={C.pawDark} stroke={outline} strokeWidth={1} opacity={0.5} />
      <Circle cx="72" cy="113" r="3" fill={C.pawDark} stroke={outline} strokeWidth={1} opacity={0.5} />
      <Circle cx="128" cy="113" r="3" fill={C.pawDark} stroke={outline} strokeWidth={1} opacity={0.5} />
      <Circle cx="135" cy="111" r="3" fill={C.pawDark} stroke={outline} strokeWidth={1} opacity={0.5} />
      <Circle cx="142" cy="113" r="3" fill={C.pawDark} stroke={outline} strokeWidth={1} opacity={0.5} />
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

export default function FoxAvatar({ mood = 'happy', size = 120, style }) {
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
