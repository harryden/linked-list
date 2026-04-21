// LinkBack screens — Precision Utility aesthetic
// Monochrome, 1px borders, Geist/Inter, tight tracking, single accent (black)

const T = {
  bg:        '#FFFFFF',
  surface:   '#FAFAFA',
  surfHover: '#F4F4F5',
  borderSub: '#E4E4E7',
  borderStr: '#D4D4D8',
  text:      '#09090B',
  textMute:  '#71717A',
  accent:    '#000000',
  accentHov: '#27272A',
  success:   '#059669',
  successBg: '#ECFDF5',
  error:     '#DC2626',
  errorBg:   '#FEF2F2',
  linkedin:  '#0A66C2',
};

const fontStack = `'Geist','Inter',system-ui,-apple-system,sans-serif`;
const monoStack = `'Geist Mono','JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace`;

// ──────────────────────────────────────────────────────────────
// Shared primitives
// ──────────────────────────────────────────────────────────────

function Frame({ children, bg = T.bg, pad = 0, style }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: bg,
      fontFamily: fontStack, color: T.text, fontSize: 14,
      WebkitFontSmoothing: 'antialiased', letterSpacing: 0,
      padding: pad, boxSizing: 'border-box', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      ...style,
    }}>{children}</div>
  );
}

function Btn({ children, variant = 'primary', size = 'md', full, icon, iconRight, style, onClick }) {
  const sizeMap = {
    sm: { h: 32, px: 12, fs: 12 },
    md: { h: 40, px: 16, fs: 14 },
    lg: { h: 48, px: 24, fs: 16 },
    xl: { h: 56, px: 32, fs: 16 },
  }[size];
  const variantMap = {
    primary: { bg: T.accent, color: '#fff', border: 'transparent' },
    secondary: { bg: T.surfHover, color: T.text, border: 'transparent' },
    outline: { bg: 'transparent', color: T.text, border: T.borderSub },
    ghost: { bg: 'transparent', color: T.textMute, border: 'transparent' },
    success: { bg: T.success, color: '#fff', border: 'transparent' },
    linkedin: { bg: T.linkedin, color: '#fff', border: 'transparent' },
  }[variant];
  return (
    <button onClick={onClick} style={{
      height: sizeMap.h, padding: `0 ${sizeMap.px}px`,
      fontSize: sizeMap.fs, fontWeight: 500, letterSpacing: 0,
      background: variantMap.bg, color: variantMap.color,
      border: `1px solid ${variantMap.border}`, borderRadius: 6,
      cursor: 'pointer', fontFamily: 'inherit',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: full ? '100%' : 'auto',
      transition: 'background .15s cubic-bezier(0.16, 1, 0.3, 1)',
      boxShadow: variant === 'primary' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
      ...style,
    }}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

function Avatar({ size = 32, src, initials, bg }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 9999,
      background: bg || T.surfHover, color: T.textMute,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 500, flexShrink: 0,
      backgroundImage: src ? `url(${src})` : undefined,
      backgroundSize: 'cover', backgroundPosition: 'center',
      border: `1px solid ${T.borderSub}`, boxSizing: 'border-box',
    }}>{!src && initials}</div>
  );
}

function Icon({ path, size = 16, stroke = 1.5, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
}

const Icons = {
  arrowRight: <path d="M5 12h14M13 5l7 7-7 7"/>,
  arrowLeft:  <path d="M19 12H5M12 19l-7-7 7-7"/>,
  check:      <path d="M20 6L9 17l-5-5"/>,
  checkCircle:<><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></>,
  plus:       <path d="M12 5v14M5 12h14"/>,
  calendar:   <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  mapPin:     <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  users:      <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  qr:         <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14h1M14 20h1M20 17v4"/></>,
  search:     <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
  settings:   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  home:       <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></>,
  logout:     <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></>,
  globe:      <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></>,
  clock:      <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
  zap:        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>,
  more:       <><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></>,
  x:          <path d="M18 6 6 18M6 6l12 12"/>,
  share:      <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/></>,
  download:   <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></>,
};

// Sample data
const ATTENDEES = [
  { name: 'Elena Vasquez',  headline: 'Design Lead · Ramp',            initials: 'EV', in: '11:42' },
  { name: 'Marcus Chen',    headline: 'Founder · Vellum',              initials: 'MC', in: '11:40' },
  { name: 'Priya Sharma',   headline: 'Principal PM · Stripe',         initials: 'PS', in: '11:38' },
  { name: 'Jordan Okafor',  headline: 'Staff Engineer · Linear',       initials: 'JO', in: '11:35' },
  { name: 'Sasha Volkov',   headline: 'Investor · Sequoia',            initials: 'SV', in: '11:31' },
  { name: 'Tomás Ribeiro',  headline: 'Head of Platform · Notion',     initials: 'TR', in: '11:28' },
  { name: 'Naomi Lindgren', headline: 'Director of Ops · Vercel',      initials: 'NL', in: '11:24' },
  { name: 'Kenji Araki',    headline: 'iOS Engineer · Arc',            initials: 'KA', in: '11:19' },
  { name: 'Clara Bennett',  headline: 'CEO · Sunlit Labs',             initials: 'CB', in: '11:15' },
  { name: 'Dmitri Orlov',   headline: 'VP Engineering · Supabase',     initials: 'DO', in: '11:10' },
];

// ──────────────────────────────────────────────────────────────
// 1. LANDING (Desktop 1024)
// ──────────────────────────────────────────────────────────────

function LandingScreen() {
  return (
    <Frame>
      {/* grid pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(to right, ${T.borderSub} 1px, transparent 1px),
          linear-gradient(to bottom, ${T.borderSub} 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, #000 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, #000 30%, transparent 100%)',
        opacity: 0.6,
      }}/>
      {/* nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px', borderBottom: `1px solid ${T.borderSub}`,
        background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26, height: 26, background: T.accent, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 14, fontWeight: 600, letterSpacing: -0.5,
          }}>L</div>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3 }}>LinkBack</span>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Btn variant="ghost" size="sm">Product</Btn>
          <Btn variant="ghost" size="sm">Pricing</Btn>
          <Btn variant="ghost" size="sm">Changelog</Btn>
          <div style={{ width: 1, height: 20, background: T.borderSub, margin: '0 8px' }}/>
          <Btn variant="ghost" size="sm">Sign in</Btn>
          <Btn variant="primary" size="sm">Create event</Btn>
        </div>
      </div>

      {/* hero */}
      <div style={{ padding: '96px 64px 0', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 10px', border: `1px solid ${T.borderSub}`,
          borderRadius: 9999, fontSize: 12, color: T.textMute,
          fontFamily: monoStack,
        }}>
          <span style={{ width: 6, height: 6, background: T.success, borderRadius: 99 }}/>
          v2.4 — Check-in codes are live
        </div>
        <h1 style={{
          fontSize: 64, fontWeight: 600, letterSpacing: -1.8,
          lineHeight: 1.02, margin: '24px 0 0', maxWidth: 720,
        }}>
          The guest list, rebuilt as a network.
        </h1>
        <p style={{
          fontSize: 18, color: T.textMute, lineHeight: 1.5,
          margin: '20px 0 0', maxWidth: 560,
        }}>
          LinkBack turns check-ins into contacts. Every attendee leaves with the people they actually met — no business cards, no follow-up forms.
        </p>
        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <Btn variant="primary" size="lg" iconRight={<Icon path={Icons.arrowRight} size={16}/>}>
            Create your first event
          </Btn>
          <Btn variant="outline" size="lg">Join with code</Btn>
        </div>

        {/* product frame preview */}
        <div style={{
          marginTop: 72, border: `1px solid ${T.borderSub}`, borderRadius: 12,
          background: T.surface, padding: 8, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.05)',
        }}>
          <div style={{ height: 28, display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px' }}>
            <div style={{ width: 10, height: 10, borderRadius: 99, background: T.borderStr }}/>
            <div style={{ width: 10, height: 10, borderRadius: 99, background: T.borderStr }}/>
            <div style={{ width: 10, height: 10, borderRadius: 99, background: T.borderStr }}/>
            <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: T.textMute, fontFamily: monoStack }}>
              linkback.app/event/ny-founders-oct-24
            </div>
          </div>
          <div style={{
            background: T.bg, borderRadius: 8, border: `1px solid ${T.borderSub}`,
            padding: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, minHeight: 220,
          }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute, letterSpacing: 0.5 }}>OCT 24 · 19:00</div>
              <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.6, marginTop: 8 }}>NY Founders Dinner</div>
              <div style={{ fontSize: 13, color: T.textMute, marginTop: 6 }}>Le Bernardin · 155 W 51st St</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                <Btn variant="primary" size="md">Check in</Btn>
                <Btn variant="outline" size="md" icon={<Icon path={Icons.qr} size={14}/>}>QR</Btn>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute, letterSpacing: 0.5, marginBottom: 12 }}>24 CHECKED IN</div>
              {ATTENDEES.slice(0, 4).map(a => (
                <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${T.borderSub}` }}>
                  <Avatar size={28} initials={a.initials}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: T.textMute, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.headline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* features */}
      <div style={{ padding: '96px 64px 64px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { n: '01', t: 'Scan, check in, connect.', d: 'Guests tap a QR at the door. Their LinkedIn imports in one step. No app required.' },
            { n: '02', t: 'A real-time attendee graph.', d: 'See who else is in the room, what they do, and who you already know in common.' },
            { n: '03', t: 'Portable follow-up.', d: 'Attendees leave with a roster they own. Organizers keep a clean CRM-ready export.' },
          ].map(f => (
            <div key={f.n}>
              <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute, letterSpacing: 1 }}>{f.n}</div>
              <div style={{ fontSize: 18, fontWeight: 500, marginTop: 10, letterSpacing: -0.2 }}>{f.t}</div>
              <div style={{ fontSize: 14, color: T.textMute, marginTop: 8, lineHeight: 1.6 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// ──────────────────────────────────────────────────────────────
// 2. AUTH (Mobile 375)
// ──────────────────────────────────────────────────────────────

function AuthScreen() {
  return (
    <Frame>
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 22, height: 22, background: T.accent, borderRadius: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 600,
          }}>L</div>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.3 }}>LinkBack</span>
        </div>
        <Btn variant="ghost" size="sm" style={{ color: T.textMute }}>Close</Btn>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 20px', maxWidth: 400, width: '100%', alignSelf: 'center',
      }}>
        <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute, letterSpacing: 1 }}>
          SIGN IN
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.15, margin: '12px 0 0' }}>
          Pick up where you left off.
        </h2>
        <p style={{ fontSize: 14, color: T.textMute, lineHeight: 1.5, margin: '12px 0 0' }}>
          LinkBack uses your LinkedIn profile so you always arrive with the right name tag.
        </p>

        <div style={{ marginTop: 32 }}>
          <Btn variant="linkedin" size="xl" full icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
              <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
            </svg>
          }>
            Continue with LinkedIn
          </Btn>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: T.borderSub }}/>
          <span style={{ fontSize: 11, color: T.textMute, fontFamily: monoStack }}>OR</span>
          <div style={{ flex: 1, height: 1, background: T.borderSub }}/>
        </div>

        <Btn variant="outline" size="lg" full>Enter event code</Btn>

        <p style={{ fontSize: 12, color: T.textMute, lineHeight: 1.5, margin: '32px 0 0', textAlign: 'center' }}>
          By continuing you agree to the Terms and Privacy Policy.
        </p>
      </div>

      <div style={{ padding: 20, borderTop: `1px solid ${T.borderSub}`, display: 'flex', justifyContent: 'space-between', fontFamily: monoStack, fontSize: 11, color: T.textMute }}>
        <span>v2.4.0</span>
        <span>linkback.app</span>
      </div>
    </Frame>
  );
}

// ──────────────────────────────────────────────────────────────
// 3. DASHBOARD (Desktop 1024)
// ──────────────────────────────────────────────────────────────

function DashboardScreen() {
  const myEvents = [
    { name: 'NY Founders Dinner',       date: 'OCT 24 · 19:00', loc: 'Le Bernardin, NY',        count: 24, status: 'live' },
    { name: 'Q4 Investor Roundtable',   date: 'NOV 02 · 14:00', loc: 'Private, Tribeca',        count: 12, status: 'upcoming' },
    { name: 'Design Engineering Mixer', date: 'NOV 14 · 18:30', loc: 'The Standard, High Line', count: 48, status: 'draft' },
  ];
  const attending = [
    { name: 'Vercel Ship 2025',    date: 'OCT 30',   host: 'Guillermo Rauch' },
    { name: 'SF AI Salon',          date: 'NOV 07',   host: 'Sarah Nguyen' },
  ];

  return (
    <Frame bg={T.surface} style={{ flexDirection: 'row' }}>
      {/* sidebar */}
      <div style={{
        width: 240, background: T.bg, borderRight: `1px solid ${T.borderSub}`,
        display: 'flex', flexDirection: 'column', padding: 16, gap: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 20px' }}>
          <div style={{ width: 22, height: 22, background: T.accent, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>L</div>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.3 }}>LinkBack</span>
        </div>
        {[
          { i: Icons.home, l: 'Dashboard', active: true },
          { i: Icons.calendar, l: 'My events' },
          { i: Icons.users, l: 'Attendees' },
          { i: Icons.qr, l: 'Check-in codes' },
          { i: Icons.settings, l: 'Settings' },
        ].map(it => (
          <div key={it.l} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 6, fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            background: it.active ? T.surfHover : 'transparent',
            color: it.active ? T.text : T.textMute,
          }}>
            <Icon path={it.i} size={15} stroke={1.8}/>
            {it.l}
          </div>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 6,
          border: `1px solid ${T.borderSub}`,
        }}>
          <Avatar size={28} initials="JK"/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Jamie Kwon</div>
            <div style={{ fontSize: 11, color: T.textMute, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>jamie@founderly.co</div>
          </div>
        </div>
      </div>

      {/* main */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute, letterSpacing: 1 }}>DASHBOARD</div>
            <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: -0.8, margin: '8px 0 0' }}>Welcome back, Jamie.</h1>
            <div style={{ fontSize: 14, color: T.textMute, marginTop: 6 }}>3 events hosted · 7 attended · 164 connections</div>
          </div>
          <Btn variant="primary" size="md" icon={<Icon path={Icons.plus} size={14} stroke={2}/>}>Create event</Btn>
        </div>

        {/* stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { l: 'Live now',        v: '1',   d: 'NY Founders Dinner' },
            { l: 'This month',      v: '3',   d: 'events scheduled' },
            { l: 'Total attendees', v: '84',  d: '+12 vs last month' },
            { l: 'Check-in rate',   v: '92%', d: 'across all events' },
          ].map(s => (
            <div key={s.l} style={{ background: T.bg, border: `1px solid ${T.borderSub}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute, letterSpacing: 0.8, textTransform: 'uppercase' }}>{s.l}</div>
              <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.8, marginTop: 8, fontFeatureSettings: '"tnum"' }}>{s.v}</div>
              <div style={{ fontSize: 12, color: T.textMute, marginTop: 4 }}>{s.d}</div>
            </div>
          ))}
        </div>

        {/* my events */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>My events</div>
          <div style={{ fontSize: 12, color: T.textMute }}>3 total</div>
        </div>
        <div style={{ background: T.bg, border: `1px solid ${T.borderSub}`, borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
          {myEvents.map((e, i) => (
            <div key={e.name} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 120px',
              alignItems: 'center', padding: '14px 16px', gap: 16,
              borderBottom: i < myEvents.length - 1 ? `1px solid ${T.borderSub}` : 'none',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{e.name}</div>
                <div style={{ fontSize: 12, color: T.textMute, marginTop: 2 }}>{e.loc}</div>
              </div>
              <div style={{ fontSize: 12, fontFamily: monoStack, color: T.textMute, letterSpacing: 0.5 }}>{e.date}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  fontSize: 11, padding: '3px 8px', borderRadius: 4,
                  background: e.status === 'live' ? T.successBg : e.status === 'draft' ? T.surfHover : T.surface,
                  color: e.status === 'live' ? T.success : e.status === 'draft' ? T.textMute : T.text,
                  border: `1px solid ${e.status === 'live' ? T.success : T.borderSub}`,
                  textTransform: 'capitalize', fontWeight: 500,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  {e.status === 'live' && <span style={{ width: 6, height: 6, background: T.success, borderRadius: 99 }}/>}
                  {e.status}
                </div>
                <span style={{ fontSize: 12, color: T.textMute }}>{e.count} guests</span>
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <Btn variant="outline" size="sm">Manage</Btn>
                <Btn variant="ghost" size="sm" style={{ width: 32, padding: 0 }}><Icon path={Icons.more} size={14}/></Btn>
              </div>
            </div>
          ))}
        </div>

        {/* attending */}
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Attending</div>
        <div style={{ background: T.bg, border: `1px solid ${T.borderSub}`, borderRadius: 12, overflow: 'hidden' }}>
          {attending.map((e, i) => (
            <div key={e.name} style={{
              display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 16,
              borderBottom: i < attending.length - 1 ? `1px solid ${T.borderSub}` : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{e.name}</div>
                <div style={{ fontSize: 12, color: T.textMute, marginTop: 2 }}>Hosted by {e.host}</div>
              </div>
              <div style={{ fontSize: 12, fontFamily: monoStack, color: T.textMute, letterSpacing: 0.5 }}>{e.date}</div>
              <Btn variant="outline" size="sm">View</Btn>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// ──────────────────────────────────────────────────────────────
// 4. CREATE EVENT (Desktop 1024)
// ──────────────────────────────────────────────────────────────

function CreateEventScreen() {
  const Field = ({ label, value, placeholder, mono, helper, focused }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{label}</label>
      <div style={{
        height: 40, padding: '0 12px',
        background: focused ? T.bg : T.surface,
        border: `1px solid ${focused ? T.borderStr : T.borderSub}`,
        borderRadius: 6, display: 'flex', alignItems: 'center',
        fontSize: 14, color: value ? T.text : T.textMute,
        fontFamily: mono ? monoStack : 'inherit',
        boxShadow: focused ? `0 0 0 3px ${T.borderSub}` : 'none',
      }}>{value || placeholder}</div>
      {helper && <span style={{ fontSize: 12, color: T.textMute }}>{helper}</span>}
    </div>
  );

  return (
    <Frame bg={T.surface}>
      {/* header */}
      <div style={{
        background: T.bg, borderBottom: `1px solid ${T.borderSub}`,
        padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <Btn variant="ghost" size="sm" icon={<Icon path={Icons.arrowLeft} size={14}/>}>Back</Btn>
        <div style={{ width: 1, height: 20, background: T.borderSub }}/>
        <div style={{ fontSize: 13, fontWeight: 500 }}>New event</div>
        <div style={{ flex: 1 }}/>
        <Btn variant="ghost" size="sm">Save draft</Btn>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>
          <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute, letterSpacing: 1 }}>CREATE EVENT · STEP 1 OF 2</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: -0.8, margin: '8px 0 8px' }}>Set the details.</h1>
          <p style={{ fontSize: 14, color: T.textMute, margin: 0, maxWidth: 420 }}>
            Name it, pick the time, drop the address. You can adjust anything up until the event starts.
          </p>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Event name" value="NY Founders Dinner" helper="Shows up at the top of the event page."/>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Date" value="October 24, 2025" mono/>
              <Field label="Start time" value="19:00 EST" mono focused/>
            </div>

            <Field label="Location" value="Le Bernardin · 155 W 51st St, New York" helper="Address or room name. Visible to attendees after check-in."/>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500 }}>Description</label>
              <div style={{
                minHeight: 96, padding: 12, background: T.surface,
                border: `1px solid ${T.borderSub}`, borderRadius: 6,
                fontSize: 14, color: T.text, lineHeight: 1.5,
              }}>
                Invite-only dinner for seed-stage founders working on tools for the next generation of builders. Light dinner, real conversation, small room.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500 }}>Check-in method</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{
                  padding: 14, background: T.bg,
                  border: `1px solid ${T.accent}`, borderRadius: 6,
                  boxShadow: `0 0 0 3px ${T.borderSub}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon path={Icons.qr} size={16}/>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>QR code</div>
                  </div>
                  <div style={{ fontSize: 12, color: T.textMute, marginTop: 6 }}>Guests scan at the door.</div>
                </div>
                <div style={{
                  padding: 14, background: T.surface,
                  border: `1px solid ${T.borderSub}`, borderRadius: 6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon path={Icons.globe} size={16}/>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Shareable link</div>
                  </div>
                  <div style={{ fontSize: 12, color: T.textMute, marginTop: 6 }}>Drop in a calendar invite.</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 40, paddingTop: 20, borderTop: `1px solid ${T.borderSub}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <Btn variant="ghost" size="md">Discard</Btn>
            <Btn variant="primary" size="md" iconRight={<Icon path={Icons.arrowRight} size={14}/>}>
              Continue
            </Btn>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ──────────────────────────────────────────────────────────────
// 5. EVENT PAGE (Mobile 390)
// ──────────────────────────────────────────────────────────────

function EventPageScreen({ checkedIn = false }) {
  return (
    <Frame>
      {/* status bar */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', fontSize: 14, fontWeight: 600, fontFamily: monoStack }}>
        <span>9:41</span>
        <span style={{ fontSize: 10, letterSpacing: 2, color: T.textMute }}>●●●</span>
      </div>

      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px 16px', gap: 12 }}>
        <Btn variant="outline" size="sm" style={{ width: 36, padding: 0 }}>
          <Icon path={Icons.arrowLeft} size={14}/>
        </Btn>
        <div style={{ flex: 1, fontSize: 12, fontFamily: monoStack, color: T.textMute, letterSpacing: 0.5 }}>EVENT · NY-FOUNDERS-OCT24</div>
        <Btn variant="outline" size="sm" style={{ width: 36, padding: 0 }}><Icon path={Icons.share} size={14}/></Btn>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        {/* organizer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Avatar size={24} initials="JK"/>
          <span style={{ fontSize: 13, color: T.textMute }}>Hosted by Jamie Kwon</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.6, margin: 0, lineHeight: 1.1 }}>
          NY Founders Dinner
        </h1>

        {/* meta chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: T.surface, border: `1px solid ${T.borderSub}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon path={Icons.calendar} size={14}/>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Friday, October 24</div>
              <div style={{ fontSize: 12, color: T.textMute, fontFamily: monoStack }}>19:00 — 22:00 EST</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: T.surface, border: `1px solid ${T.borderSub}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon path={Icons.mapPin} size={14}/>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Le Bernardin</div>
              <div style={{ fontSize: 12, color: T.textMute }}>155 W 51st St, New York</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 24 }}>
          {checkedIn ? (
            <div style={{
              background: T.successBg, border: `1px solid ${T.success}`,
              borderRadius: 8, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <Icon path={Icons.checkCircle} size={20} color={T.success} stroke={1.8}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.success }}>Checked in at 11:42</div>
                <div style={{ fontSize: 12, color: T.success, opacity: 0.8 }}>You're on the roster.</div>
              </div>
            </div>
          ) : (
            <Btn variant="primary" size="xl" full iconRight={<Icon path={Icons.arrowRight} size={16}/>}>
              Check in
            </Btn>
          )}
        </div>

        {/* attendee list */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>In the room</div>
            <div style={{ fontSize: 12, color: T.textMute, fontFamily: monoStack }}>{ATTENDEES.length} · LIVE</div>
          </div>
          <div style={{ fontSize: 12, color: T.textMute, marginBottom: 12 }}>Updates as people check in.</div>

          {ATTENDEES.slice(0, 7).map((a, i) => (
            <div key={a.name} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              borderBottom: i < 6 ? `1px solid ${T.borderSub}` : 'none',
            }}>
              <Avatar size={32} initials={a.initials}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: T.textMute, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.headline}</div>
              </div>
              <div style={{ fontSize: 11, color: T.textMute, fontFamily: monoStack }}>{a.in}</div>
            </div>
          ))}
        </div>
      </div>

      {/* home indicator */}
      <div style={{ height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 120, height: 4, background: T.text, borderRadius: 99 }}/>
      </div>
    </Frame>
  );
}

// ──────────────────────────────────────────────────────────────
// 6. EVENT SUCCESS (Mobile 390)
// ──────────────────────────────────────────────────────────────

function EventSuccessScreen() {
  return (
    <Frame>
      <div style={{ height: 44 }}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 24px', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 99,
            background: T.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24, border: `1px solid ${T.success}`,
          }}>
            <Icon path={Icons.checkCircle} size={28} color={T.success} stroke={1.5}/>
          </div>
          <div style={{ fontSize: 11, fontFamily: monoStack, color: T.success, letterSpacing: 1 }}>CHECKED IN · 11:42</div>
          <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1, margin: '12px 0 0', lineHeight: 1 }}>You're in.</h1>
          <p style={{ fontSize: 15, color: T.textMute, lineHeight: 1.5, margin: '16px 0 0' }}>
            Nine other founders are already here. Introductions happen on the roster — it's updating live.
          </p>

          <div style={{
            marginTop: 32, padding: 16,
            border: `1px solid ${T.borderSub}`, borderRadius: 10,
            background: T.surface,
          }}>
            <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute, letterSpacing: 0.8 }}>TONIGHT · NY FOUNDERS DINNER</div>
            <div style={{ display: 'flex', marginTop: 10, alignItems: 'center' }}>
              {ATTENDEES.slice(0, 5).map((a, i) => (
                <div key={a.name} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                  <Avatar size={28} initials={a.initials}/>
                </div>
              ))}
              <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 500 }}>+ 5 more</span>
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn variant="primary" size="xl" full iconRight={<Icon path={Icons.arrowRight} size={16}/>}>
            View attendees
          </Btn>
          <Btn variant="outline" size="lg" full>Save to contacts</Btn>
        </div>
      </div>
      <div style={{ height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 120, height: 4, background: T.text, borderRadius: 99 }}/>
      </div>
    </Frame>
  );
}

// ──────────────────────────────────────────────────────────────
// 7. QR MODAL (Mobile 390)
// ──────────────────────────────────────────────────────────────

function QRModalScreen() {
  // Build a pseudo-QR grid
  const size = 25;
  const cells = [];
  // deterministic pattern
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const isFinder = (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
      const innerFinder = isFinder && ((x > 1 && x < 5 && y > 1 && y < 5) || (x > size - 6 && x < size - 2 && y > 1 && y < 5) || (x > 1 && x < 5 && y > size - 6 && y < size - 2));
      const outerFinder = isFinder && !innerFinder && (x === 0 || x === 6 || y === 0 || y === 6 || (x >= size - 7 && (x === size - 7 || x === size - 1)) || (y >= size - 7 && (y === size - 7 || y === size - 1)));
      let on = false;
      if (isFinder) {
        on = outerFinder || innerFinder;
      } else {
        // hash
        on = ((x * 7 + y * 13 + x * y) % 5) < 2;
      }
      cells.push({ x, y, on });
    }
  }

  return (
    <Frame bg="rgba(0,0,0,0.6)" style={{ justifyContent: 'center', padding: 0 }}>
      {/* dimmed backdrop dots */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}/>
      {/* modal */}
      <div style={{
        position: 'relative', margin: '0 20px', background: T.bg,
        borderRadius: 12, padding: 24, zIndex: 2,
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -4px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute, letterSpacing: 1 }}>CHECK-IN CODE</div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3, marginTop: 4 }}>NY Founders Dinner</div>
          </div>
          <Btn variant="ghost" size="sm" style={{ width: 32, padding: 0 }}><Icon path={Icons.x} size={16}/></Btn>
        </div>

        {/* QR */}
        <div style={{
          background: '#fff', border: `1px solid ${T.borderSub}`,
          padding: 20, borderRadius: 4, display: 'flex', justifyContent: 'center',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gap: 0, width: 260, height: 260,
          }}>
            {cells.map(c => (
              <div key={`${c.x}-${c.y}`} style={{
                background: c.on ? '#000' : '#fff',
                width: '100%', height: '100%',
              }}/>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute, letterSpacing: 0.8 }}>OR ENTER CODE</div>
          <div style={{
            marginTop: 6, fontSize: 24, fontWeight: 600,
            fontFamily: monoStack, letterSpacing: 6, fontFeatureSettings: '"tnum"',
          }}>9F · 4XA2</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 20 }}>
          <Btn variant="outline" size="md" icon={<Icon path={Icons.download} size={14}/>}>Save</Btn>
          <Btn variant="primary" size="md" icon={<Icon path={Icons.share} size={14}/>}>Share</Btn>
        </div>
      </div>
    </Frame>
  );
}

// ──────────────────────────────────────────────────────────────
// 8. COMPONENTS SPECIMEN
// ──────────────────────────────────────────────────────────────

function ComponentsSpec() {
  const Swatch = ({ c, n, h }) => (
    <div>
      <div style={{
        width: '100%', aspectRatio: '1.3', borderRadius: 6,
        background: c, border: `1px solid ${T.borderSub}`, boxSizing: 'border-box',
      }}/>
      <div style={{ fontSize: 12, fontWeight: 500, marginTop: 8 }}>{n}</div>
      <div style={{ fontSize: 11, color: T.textMute, fontFamily: monoStack }}>{h}</div>
    </div>
  );

  return (
    <Frame style={{ padding: 32 }}>
      <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute, letterSpacing: 1 }}>DESIGN SYSTEM · v1</div>
      <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.6, margin: '8px 0 0' }}>Precision Utility</h1>
      <p style={{ fontSize: 13, color: T.textMute, margin: '8px 0 0', maxWidth: 560 }}>
        Structural clarity over decoration. 1px borders, flat surfaces, hierarchy from type and space.
      </p>

      <div style={{ marginTop: 32, fontSize: 12, fontFamily: monoStack, color: T.textMute, letterSpacing: 1 }}>COLOR</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginTop: 12 }}>
        <Swatch c={T.bg}        n="bg-base"        h="#FFFFFF"/>
        <Swatch c={T.surface}   n="bg-surface"     h="#FAFAFA"/>
        <Swatch c={T.surfHover} n="surface-hover"  h="#F4F4F5"/>
        <Swatch c={T.borderSub} n="border-subtle"  h="#E4E4E7"/>
        <Swatch c={T.textMute}  n="text-secondary" h="#71717A"/>
        <Swatch c={T.text}      n="text-primary"   h="#09090B"/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginTop: 12 }}>
        <Swatch c={T.accent}    n="brand-accent"   h="#000000"/>
        <Swatch c={T.success}   n="state-success"  h="#059669"/>
        <Swatch c={T.successBg} n="success-bg"     h="#ECFDF5"/>
        <Swatch c={T.error}     n="state-error"    h="#DC2626"/>
        <Swatch c={T.errorBg}   n="error-bg"       h="#FEF2F2"/>
        <Swatch c={T.linkedin}  n="brand-linkedin" h="#0A66C2"/>
      </div>

      <div style={{ marginTop: 32, fontSize: 12, fontFamily: monoStack, color: T.textMute, letterSpacing: 1 }}>TYPE</div>
      <div style={{ marginTop: 12, borderTop: `1px solid ${T.borderSub}` }}>
        {[
          { k: 'h1', s: 36, w: 600, ls: -0.72, t: 'The guest list, rebuilt.' },
          { k: 'h2', s: 24, w: 600, ls: -0.24, t: 'Section header' },
          { k: 'h3', s: 20, w: 500, ls: -0.20, t: 'Card title' },
          { k: 'body-lg', s: 16, w: 400, ls: 0, t: 'Primary reading text sits at 16px with a 1.5 line height for comfortable scanning.' },
          { k: 'body', s: 14, w: 400, ls: 0, t: 'Standard UI text, inputs, and row labels live at 14px.' },
          { k: 'caption', s: 12, w: 400, ls: 0, t: 'Metadata, helper text, timestamps.' },
        ].map(r => (
          <div key={r.k} style={{ display: 'grid', gridTemplateColumns: '100px 80px 1fr', gap: 16, padding: '12px 0', borderBottom: `1px solid ${T.borderSub}`, alignItems: 'baseline' }}>
            <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute }}>{r.k}</div>
            <div style={{ fontSize: 11, fontFamily: monoStack, color: T.textMute }}>{r.s}/{r.w}</div>
            <div style={{ fontSize: r.s, fontWeight: r.w, letterSpacing: r.ls }}>{r.t}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, fontSize: 12, fontFamily: monoStack, color: T.textMute, letterSpacing: 1 }}>BUTTONS</div>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Btn variant="primary" size="sm">Primary</Btn>
          <Btn variant="primary" size="md">Primary</Btn>
          <Btn variant="primary" size="lg">Primary</Btn>
          <Btn variant="primary" size="md" iconRight={<Icon path={Icons.arrowRight} size={14}/>}>With icon</Btn>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Btn variant="secondary" size="md">Secondary</Btn>
          <Btn variant="outline" size="md">Outline</Btn>
          <Btn variant="ghost" size="md">Ghost</Btn>
          <Btn variant="primary" size="md" style={{ opacity: 0.5, cursor: 'not-allowed' }}>Disabled</Btn>
        </div>
      </div>

      <div style={{ marginTop: 32, fontSize: 12, fontFamily: monoStack, color: T.textMute, letterSpacing: 1 }}>INPUTS</div>
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: T.textMute, marginBottom: 6, fontFamily: monoStack }}>DEFAULT</div>
          <div style={{ height: 40, padding: '0 12px', background: T.surface, border: `1px solid ${T.borderSub}`, borderRadius: 6, display: 'flex', alignItems: 'center', fontSize: 14, color: T.textMute }}>you@company.com</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: T.textMute, marginBottom: 6, fontFamily: monoStack }}>FOCUSED</div>
          <div style={{ height: 40, padding: '0 12px', background: T.bg, border: `1px solid ${T.borderStr}`, borderRadius: 6, display: 'flex', alignItems: 'center', fontSize: 14, boxShadow: `0 0 0 3px ${T.borderSub}` }}>jamie@founderly.co</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: T.textMute, marginBottom: 6, fontFamily: monoStack }}>ERROR</div>
          <div style={{ height: 40, padding: '0 12px', background: T.errorBg, border: `1px solid ${T.error}`, borderRadius: 6, display: 'flex', alignItems: 'center', fontSize: 14, color: T.error, boxShadow: `0 0 0 3px ${T.errorBg}` }}>not-an-email</div>
        </div>
      </div>

      <div style={{ marginTop: 32, fontSize: 12, fontFamily: monoStack, color: T.textMute, letterSpacing: 1 }}>STATUS</div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { bg: T.successBg, c: T.success, t: 'Live' },
          { bg: T.surface, c: T.text, t: 'Upcoming' },
          { bg: T.surfHover, c: T.textMute, t: 'Draft' },
          { bg: T.errorBg, c: T.error, t: 'Cancelled' },
        ].map(b => (
          <span key={b.t} style={{
            fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 4,
            background: b.bg, color: b.c, border: `1px solid ${b.c}`,
          }}>{b.t}</span>
        ))}
      </div>

      <div style={{ flex: 1 }}/>
      <div style={{
        marginTop: 32, paddingTop: 20, borderTop: `1px solid ${T.borderSub}`,
        display: 'flex', gap: 16, fontSize: 11, fontFamily: monoStack, color: T.textMute, letterSpacing: 0.5,
      }}>
        <span>RADIUS · 6/12/full</span>
        <span>SPACING · 4px base</span>
        <span>MOTION · cubic-bezier(0.16, 1, 0.3, 1)</span>
      </div>
    </Frame>
  );
}

Object.assign(window, {
  LandingScreen, AuthScreen, DashboardScreen, CreateEventScreen,
  EventPageScreen, EventSuccessScreen, QRModalScreen, ComponentsSpec,
  T, fontStack, monoStack, Icons, Icon, Btn, Avatar, ATTENDEES,
});
