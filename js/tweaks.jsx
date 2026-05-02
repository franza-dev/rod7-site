/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakSlider, TweakToggle, TweakRadio, TweakSelect, TweakColor, TweakButton */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "auto",
  "accent": "#1e5155",
  "accentHover": "#2a6b6f",
  "accentLight": "#3b8489",
  "marqueeSpeed": 60,
  "grain": true,
  "scrambleOnLoad": true,
  "displayFont": "Newsreader",
  "sansFont": "Inter Tight"
}/*EDITMODE-END*/;

const DISPLAY_FONTS = ["Newsreader", "Fraunces", "Tiempos", "Bodoni Moda", "Playfair Display", "Cormorant Garamond"];
const SANS_FONTS = ["Inter Tight", "Inter", "Geist", "Manrope", "Jost", "DM Sans"];

function applyTokens(t) {
  const root = document.documentElement;
  if (t.theme === "dark") root.setAttribute("data-theme", "dark");
  else if (t.theme === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");

  root.style.setProperty("--rust", t.accent);
  root.style.setProperty("--rust-2", t.accentHover);
  root.style.setProperty("--rust-3", t.accentLight);
  root.style.setProperty("--display", `"${t.displayFont}", "Tiempos", "Bodoni Moda", Didot, serif`);
  root.style.setProperty("--sans", `"${t.sansFont}", "Inter", system-ui, sans-serif`);

  const grain = document.querySelector(".grain");
  if (grain) grain.style.display = t.grain ? "block" : "none";

  if (window.__rod7_carousels) window.__rod7_carousels.setMarqueeSpeed(t.marqueeSpeed);

  // Lazy-load Google Font for picker selections
  const fams = [t.displayFont, t.sansFont].map(f => f.replace(/ /g, "+")).join("&family=");
  const linkId = "tweaks-fontload";
  let link = document.getElementById(linkId);
  if (!link) {
    link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = `https://fonts.googleapis.com/css2?family=${fams}:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap`;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => { applyTokens(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Tema">
        <TweakRadio
          label="Modo"
          value={t.theme}
          onChange={v => setTweak("theme", v)}
          options={[
            { value: "auto", label: "Auto" },
            { value: "light", label: "Claro" },
            { value: "dark", label: "Escuro" },
          ]}
        />
      </TweakSection>

      <TweakSection title="Cor de acento">
        <TweakColor label="Principal" value={t.accent} onChange={v => setTweak("accent", v)} />
        <TweakColor label="Hover" value={t.accentHover} onChange={v => setTweak("accentHover", v)} />
        <TweakColor label="Claro" value={t.accentLight} onChange={v => setTweak("accentLight", v)} />
        <TweakButton onClick={() => {
          setTweak({ accent: "#c4623a", accentHover: "#d97a4a", accentLight: "#e89a72" });
        }}>Preset · laranja Concept</TweakButton>
        <TweakButton onClick={() => {
          setTweak({ accent: "#1e5155", accentHover: "#2a6b6f", accentLight: "#3b8489" });
        }}>Preset · teal atual</TweakButton>
        <TweakButton onClick={() => {
          setTweak({ accent: "#8b6f47", accentHover: "#a48459", accentLight: "#c9a96a" });
        }}>Preset · ouro</TweakButton>
      </TweakSection>

      <TweakSection title="Tipografia">
        <TweakSelect
          label="Display"
          value={t.displayFont}
          onChange={v => setTweak("displayFont", v)}
          options={DISPLAY_FONTS.map(f => ({ value: f, label: f }))}
        />
        <TweakSelect
          label="Sans"
          value={t.sansFont}
          onChange={v => setTweak("sansFont", v)}
          options={SANS_FONTS.map(f => ({ value: f, label: f }))}
        />
      </TweakSection>

      <TweakSection title="Movimento">
        <TweakSlider label="Velocidade marquee (s)" value={t.marqueeSpeed} onChange={v => setTweak("marqueeSpeed", v)} min={20} max={180} step={5} />
        <TweakToggle label="Textura grain" value={t.grain} onChange={v => setTweak("grain", v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

// Apply on load (before user opens panel)
applyTokens(TWEAK_DEFAULTS);

const root = document.getElementById("tweaks-root");
if (root) ReactDOM.createRoot(root).render(<App />);
