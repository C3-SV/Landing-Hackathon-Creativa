import type { SVGProps } from "react";

export function TourismCodeIllustration({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 760"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="presentation"
    >
      <rect x="14" y="14" width="1172" height="732" rx="44" opacity="0.35" />
      <rect x="120" y="140" width="960" height="492" rx="24" opacity="0.95" />
      <rect x="145" y="162" width="910" height="452" rx="18" opacity="0.65" />

      <path d="M86 654 166 606h860l80 48" />
      <rect x="55" y="654" width="1090" height="28" rx="14" />
      <path d="M450 648h300l28 24H422z" opacity="0.75" />
      <rect x="520" y="684" width="160" height="10" rx="5" opacity="0.75" />

      <path d="m228 240 24 18m-24 46 35 1" opacity="0.85" />
      <rect x="470" y="178" width="230" height="46" rx="23" opacity="0.8" />
      <circle cx="507" cy="201" r="12" />
      <path d="m514 208 9 9" />
      <circle cx="970" cy="202" r="17" opacity="0.85" />
      <circle cx="970" cy="202" r="7" opacity="0.85" />
      <path d="M957 217c3-9 6-12 13-12s10 3 13 12" opacity="0.85" />

      <path d="M290 430c-32-28-42-89 3-123 20-16 46-14 72-9 17-23 43-32 73-25 20-20 45-20 69 2 29-7 48 13 45 38 18 11 24 28 10 46-5 7-15 13-26 17-24 8-54 8-84 9-38 2-76 10-112 23-24 8-42 18-50 22z" />
      <path d="M322 300c95 6 133 25 178 71" strokeDasharray="10 10" opacity="0.8" />
      <path d="M503 371c47-19 84-20 125-8" strokeDasharray="10 10" opacity="0.8" />
      <path d="M650 360c40 8 60 21 77 39" strokeDasharray="10 10" opacity="0.8" />

      <Pin x="386" y="347" />
      <Pin x="468" y="300" />
      <Pin x="550" y="394" />
      <circle cx="302" cy="322" r="4" opacity="0.8" />
      <circle cx="593" cy="425" r="4" opacity="0.8" />

      <path d="M810 246c72 84 155 192 244 263" />
      <path d="M731 448c136-61 198-164 252-226 40 17 71 58 76 90" />
      <path d="M766 461c42-35 73-72 113-129 31-45 75-97 98-110" />
      <path d="m905 264 8-14 11 10 9-13 10 12 9-14 12 12" />
      <path d="M900 222c-24 13-30 43-19 67" />
      <path d="M890 198c-29 4-52 36-49 66" />
      <path d="M915 183c-31-3-61 24-64 55" />
      <path d="M940 184c-24-14-56-5-70 20" />
      <path d="M962 203c-13-20-37-30-59-22" />

      <rect x="278" y="456" width="248" height="110" rx="16" />
      <circle cx="333" cy="510" r="26" />
      <path d="m333 473 1 11m0 52 1-10m25-16h-10m-50 0h10" />
      <text x="386" y="508" fontSize="58" fill="currentColor" stroke="none" fontFamily="var(--font-jetbrains)">
        28°C
      </text>
      <text x="386" y="546" fontSize="33" fill="currentColor" stroke="none" fontFamily="var(--font-jetbrains)">
        San Salvador
      </text>

      <rect x="565" y="488" width="145" height="95" rx="12" />
      <path d="m590 522 18 8 18-16" />
      <path d="m638 512-16 40m-18 0h52" />
      <path d="M592 548h94M592 566h74" opacity="0.8" />

      <path d="M206 610c48-26 85-74 128-110 42-37 108-56 178-55" />
      <path d="M170 611c24-58 56-94 106-111 25-8 50-8 77-4" />
      <path d="m228 604 37-8 30 12" opacity="0.8" />
      <path d="m316 565 17-24 8 25" opacity="0.8" />

      <path d="M348 595c29-42 64-61 101-55 30 4 56 24 75 56" />
      <path d="M395 567c10-14 24-25 41-29" />
      <path d="m471 540-9 9m17-4-6 11" opacity="0.8" />

      <path d="M615 612c72-31 123-88 188-135 75-55 160-88 249-94" />
      <path d="M596 616c18-48 51-83 103-106 44-19 92-23 139-13" />
      <path d="m670 589 42-9 18 15" opacity="0.75" />

      <ColonialChurch />
      <path d="M748 448h70M973 448h72" opacity="0.65" />
      <path d="M835 397h26M947 397h24" opacity="0.65" />

      <path d="m704 620 28-37m271 33-14-27m-87 17 19-30" opacity="0.8" />
      <path d="m291 448 13-10m386-53 9-5m160 38 12-3" opacity="0.8" />
    </svg>
  );
}

function Pin(props: SVGProps<SVGPathElement> & { x: number; y: number }) {
  const { x, y, ...rest } = props;

  return (
    <>
      <path
        d={`M ${x} ${y} c 0 -12 9 -20 20 -20 s 20 8 20 20 c 0 15 -17 30 -20 35 c -3 -5 -20 -20 -20 -35z`}
        {...rest}
      />
      <circle cx={x + 20} cy={y - 2} r="6" {...rest} />
    </>
  );
}

function ColonialChurch() {
  return (
    <>
      <rect x="764" y="468" width="262" height="136" rx="8" />
      <rect x="845" y="426" width="102" height="178" rx="6" />
      <path d="M825 468h142l-71-53z" />
      <rect x="860" y="520" width="27" height="84" rx="12" />
      <rect x="905" y="520" width="27" height="84" rx="12" />
      <rect x="794" y="489" width="28" height="52" rx="6" />
      <rect x="969" y="489" width="28" height="52" rx="6" />
      <rect x="893" y="539" width="26" height="65" rx="13" />
      <circle cx="906" cy="489" r="8" />
      <path d="M778 455h38v-40h-38z" />
      <path d="M975 455h38v-40h-38z" />
      <path d="M797 415v-18m-9 9h18" />
      <path d="M994 415v-18m-9 9h18" />
      <path d="M906 404v-17m-8 8h16" />
      <path d="M768 549h250" opacity="0.7" />
      <path d="M766 529h26m186 0h26" opacity="0.7" />
    </>
  );
}

