import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Nav({ active, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Home", "About", "Academics", "Contact"];
  const go = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(10,30,70,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
      transition: "all 0.4s ease",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <div onClick={() => go("Home")} style={{ cursor: "pointer", display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, fontWeight: 900, letterSpacing: 2,
            color: "#fff", textTransform: "uppercase",
          }}>CSS</span>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 9, letterSpacing: 3, color: "#60a5fa", textTransform: "uppercase", fontWeight: 600,
          }}>Ihoukpara · Enugu</span>
        </div>

        <div style={{ display: "flex", gap: 32 }} className="desktop-nav">
          {links.map(l => (
            <button key={l} onClick={() => go(l)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: active === l ? "#60a5fa" : "#e2e8f0",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                letterSpacing: 1.5, textTransform: "uppercase",
                borderBottom: active === l ? "2px solid #60a5fa" : "2px solid transparent",
                paddingBottom: 2, transition: "all 0.2s",
              }}>{l}</button>
          ))}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 4, display: "none" }}
          className="hamburger">
          {[0,1,2].map(i => (
            <span key={i} style={{ display: "block", width: 24, height: 2, background: "#fff", borderRadius: 2 }} />
          ))}
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: "rgba(10,30,70,0.98)", padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {links.map(l => (
            <button key={l} onClick={() => go(l)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: "none", border: "none", cursor: "pointer",
                color: active === l ? "#60a5fa" : "#e2e8f0",
                fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600,
                padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)",
                textTransform: "uppercase", letterSpacing: 1.5,
              }}>{l}</button>
          ))}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&family=Lora:ital,wght@0,500;1,400&display=swap');
        @media(max-width:700px){ .desktop-nav{display:none!important} .hamburger{display:flex!important} }
        *{box-sizing:border-box; margin:0; padding:0;}
        body{background:#0a0e1a;}
        button:focus{outline:none;}
      `}</style>
    </nav>
  );
}

function HomePage({ setPage, img1, img2, img3, img4 }) {
  return (
    <div>
      <section style={{
        minHeight: "100vh", position: "relative", display: "flex",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${img1})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.28)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(10,30,80,0.85) 0%, rgba(5,15,40,0.6) 100%)",
        }} />
        <div style={{
          position: "absolute", right: "-120px", top: "10%",
          width: 500, height: 500, borderRadius: "50%",
          border: "1px solid rgba(96,165,250,0.15)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: "-60px", top: "18%",
          width: 360, height: 360, borderRadius: "50%",
          border: "1px solid rgba(96,165,250,0.1)", pointerEvents: "none",
        }} />

        <div style={{ position: "relative", textAlign: "center", padding: "120px 24px 60px", maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            display: "inline-block", marginBottom: 24,
            background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.3)",
            borderRadius: 999, padding: "6px 20px",
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            color: "#93c5fd", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600,
            animation: "fadeDown 0.8s ease both",
          }}>Nkanu East · Enugu State · Nigeria</div>

          <div style={{ animation: "fadeDown 0.9s ease 0.1s both" }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(52px, 12vw, 96px)", fontWeight: 900,
              color: "#fff", lineHeight: 0.9, letterSpacing: -2,
            }}>CSS</div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(14px, 3vw, 22px)", fontWeight: 700,
              color: "#93c5fd", letterSpacing: 6, textTransform: "uppercase",
              marginTop: 8, marginBottom: 4,
            }}>Community Secondary School</div>
            <div style={{
              fontFamily: "'Lora', serif", fontStyle: "italic",
              fontSize: "clamp(11px, 2vw, 14px)", color: "rgba(255,255,255,0.45)",
              letterSpacing: 3, textTransform: "uppercase", marginBottom: 28,
            }}>Ihoukpara, Enugu</div>
          </div>

          <div style={{ animation: "fadeDown 1s ease 0.2s both" }}>
            <div style={{
              fontFamily: "'Lora', serif", fontStyle: "italic",
              fontSize: "clamp(18px, 4vw, 28px)", color: "#e2e8f0",
              marginBottom: 40, lineHeight: 1.5,
            }}>
              "Shaping Minds, Building Futures"
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animation: "fadeDown 1s ease 0.35s both" }}>
            <button onClick={() => { setPage("About"); window.scrollTo(0,0); }}
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                border: "none", borderRadius: 6, padding: "14px 36px",
                color: "#fff", fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                letterSpacing: 1.5, textTransform: "uppercase",
                boxShadow: "0 8px 32px rgba(59,130,246,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}>Discover Our School</button>
            <button onClick={() => { setPage("Contact"); window.scrollTo(0,0); }}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 6, padding: "14px 36px",
                color: "#fff", fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                letterSpacing: 1.5, textTransform: "uppercase",
                transition: "all 0.2s",
              }}>Get In Touch</button>
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          animation: "bounce 2s infinite",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>

        <style>{`
          @keyframes fadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        `}</style>
      </section>

      <section style={{ background: "linear-gradient(90deg, #1e3a8a, #1d4ed8)", padding: "48px 24px" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 32, textAlign: "center",
        }}>
          {[
            { label: "Students Enrolled", value: 300, suffix: "+" },
            { label: "Dedicated Teachers", value: 14, suffix: "" },
            { label: "Academic Departments", value: 2, suffix: "" },
            { label: "Years of Excellence", value: 20, suffix: "+" },
          ].map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#bfdbfe", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 8, fontWeight: 500 }}>{s.label}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section style={{ background: "#050d1f", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 64, alignItems: "center" }}>
          <FadeIn>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Welcome to CSS Ihoukpara</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, color: "#f1f5f9", lineHeight: 1.2, marginBottom: 24 }}>A Community of Learners, Leaders & Future Builders</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#94a3b8", lineHeight: 1.8, marginBottom: 32 }}>
              Community Secondary School, Ihoukpara, has long stood as a beacon of quality education in Nkanu East, Enugu State. We provide a structured, nurturing environment where students in both Junior and Senior Secondary levels are equipped with knowledge, character, and ambition to thrive in a rapidly changing world.
            </p>
            <button onClick={() => { setPage("About"); window.scrollTo(0,0); }}
              style={{
                background: "none", border: "1px solid #3b82f6", borderRadius: 6,
                padding: "12px 28px", color: "#60a5fa",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                fontWeight: 700, cursor: "pointer", letterSpacing: 1.5,
                textTransform: "uppercase", transition: "all 0.2s",
              }}>Read More →</button>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ position: "relative" }}>
              <img src={img2} alt="CSS Campus" style={{ width: "100%", borderRadius: 12, boxShadow: "0 24px 80px rgba(0,0,0,0.6)", display: "block" }} />
              <div style={{
                position: "absolute", bottom: -20, left: -20,
                background: "#1d4ed8", borderRadius: 8, padding: "16px 24px",
                boxShadow: "0 12px 40px rgba(29,78,216,0.4)",
              }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: "#fff" }}>JSS & SSS</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#bfdbfe", letterSpacing: 2, textTransform: "uppercase" }}>Both Levels Offered</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section style={{ background: "#070f22", padding: "80px 24px" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Our Core Values</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,5vw,38px)", fontWeight: 900, color: "#f1f5f9" }}>What We Stand For</h2>
          </div>
        </FadeIn>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
          {[
            { icon: "📚", title: "Academic Excellence", desc: "We hold every student to a standard of rigorous, purposeful learning across all subjects." },
            { icon: "🤝", title: "Community & Belonging", desc: "We are rooted in Ihoukpara — our community's trust and support is our greatest asset." },
            { icon: "🌱", title: "Character Formation", desc: "Beyond grades, we shape integrity, discipline, and responsibility in every student." },
            { icon: "🔬", title: "Science & Arts Balance", desc: "Two strong departments — Sciences and Arts — provide clear, structured academic pathways." },
          ].map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.1}>
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12, padding: "32px 24px", transition: "border-color 0.3s, transform 0.3s",
              }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{v.icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>{v.title}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{v.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section style={{ background: "#050d1f", padding: "80px 24px" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Campus Life</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,5vw,36px)", fontWeight: 900, color: "#f1f5f9" }}>Our School in Pictures</h2>
          </div>
        </FadeIn>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {[img1, img2, img3, img4].map((img, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <img src={img} alt={`CSS campus ${i+1}`} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", display: "block" }} />
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}

function AboutPage({ img1, img2 }) {
  return (
    <div style={{ background: "#050d1f", paddingTop: 88 }}>
      <section style={{
        position: "relative", padding: "80px 24px",
        background: "linear-gradient(180deg, #0a1e4a 0%, #050d1f 100%)",
        textAlign: "center", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${img1})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.06 }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Who We Are</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,8vw,64px)", fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>About CSS Ihoukpara</h1>
        </div>
      </section>

      <section style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 60, alignItems: "center" }}>
          <FadeIn>
            <img src={img1} alt="School grounds" style={{ width: "100%", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} />
          </FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Our Story</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,4vw,32px)", fontWeight: 900, color: "#f1f5f9", marginBottom: 20 }}>Rooted in Community, Reaching for Excellence</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#94a3b8", lineHeight: 1.9, marginBottom: 16 }}>
              Community Secondary School, Ihoukpara, was established to serve the educational needs of families across Nkanu East Local Government Area in Enugu State. Since its founding, the school has remained committed to providing accessible, quality secondary education to the youth of this community.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#94a3b8", lineHeight: 1.9 }}>
              Today, CSS Ihoukpara runs both Junior Secondary School (JSS 1–3) and Senior Secondary School (SSS 1–3) programmes, with a dedicated team of 8 professional staff teachers supported by 6 NYSC corps members — a testament to Nigeria's commitment to national service and education.
            </p>
          </FadeIn>
        </div>
      </section>

      <section style={{ background: "rgba(255,255,255,0.02)", padding: "80px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 40 }}>
          {[
            { label: "Our Vision", icon: "👁️", text: "To be the leading public secondary institution in Nkanu East — a school that produces graduates who are academically sound, morally upright, and ready to contribute meaningfully to society and the Nigerian nation." },
            { label: "Our Mission", icon: "🎯", text: "To deliver quality, inclusive secondary education through dedicated teaching, strong community partnership, and a learning environment that develops the intellectual, social, and personal potential of every student." },
          ].map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.15}>
              <div style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.12), rgba(59,130,246,0.05))", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 14, padding: "40px 32px" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: "#93c5fd", marginBottom: 16 }}>{item.label}</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#94a3b8", lineHeight: 1.8 }}>{item.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>People</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,5vw,36px)", fontWeight: 900, color: "#f1f5f9" }}>Our Teaching Force</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 24 }}>
            {[
              { label: "Professional Staff Teachers", count: "8", icon: "🎓" },
              { label: "NYSC Corps Members", count: "6", icon: "🇳🇬" },
              { label: "Academic Departments", count: "2", icon: "🏛️" },
              { label: "Classes (JSS + SSS)", count: "6", icon: "📋" },
            ].map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.1}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "28px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: "#60a5fa", lineHeight: 1 }}>{s.count}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#64748b", marginTop: 8, lineHeight: 1.4 }}>{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <img src={img2} alt="CSS Ihoukpara campus" style={{ width: "100%", borderRadius: 14, boxShadow: "0 24px 80px rgba(0,0,0,0.5)", display: "block" }} />
            <div style={{ textAlign: "center", marginTop: 16, fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: 14, color: "#475569" }}>
              Community Secondary School — Ihoukpara, Nkanu East, Enugu State
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

function AcademicsPage() {
  const [activeTab, setActiveTab] = useState("JSS");

  const jssSubjects = [
    { name: "English Language", icon: "✍️" }, { name: "Mathematics", icon: "📐" },
    { name: "Basic Science", icon: "🔬" }, { name: "Social Studies", icon: "🌍" },
    { name: "Civic Education", icon: "🏛️" }, { name: "Agricultural Science", icon: "🌾" },
    { name: "Business Studies", icon: "💼" }, { name: "Computer Studies", icon: "💻" },
    { name: "French", icon: "🇫🇷" }, { name: "Physical & Health Education", icon: "⚽" },
    { name: "Christian Religious Studies", icon: "📖" }, { name: "Igbo Language", icon: "🗣️" },
  ];

  const sssSciences = [
    { name: "Physics", icon: "⚛️" }, { name: "Chemistry", icon: "🧪" },
    { name: "Biology", icon: "🧬" }, { name: "Further Mathematics", icon: "📊" },
    { name: "Mathematics", icon: "📐" }, { name: "English Language", icon: "✍️" },
    { name: "Agricultural Science", icon: "🌾" }, { name: "Computer Science", icon: "💻" },
  ];

  const sssArts = [
    { name: "Literature in English", icon: "📚" }, { name: "Government", icon: "🏛️" },
    { name: "Economics", icon: "📈" }, { name: "Commerce", icon: "💼" },
    { name: "Christian Religious Studies", icon: "📖" }, { name: "English Language", icon: "✍️" },
    { name: "Civic Education", icon: "⚖️" }, { name: "History", icon: "🏺" },
  ];

  return (
    <div style={{ background: "#050d1f", paddingTop: 88 }}>
      <section style={{ padding: "80px 24px", textAlign: "center", background: "linear-gradient(180deg, #0a1e4a 0%, #050d1f 100%)" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>What We Teach</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,7vw,58px)", fontWeight: 900, color: "#fff" }}>Academics</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#64748b", maxWidth: 560, margin: "20px auto 0", lineHeight: 1.7 }}>
          CSS Ihoukpara offers a complete NERDC-aligned curriculum for both Junior and Senior Secondary School students across Science and Arts streams.
        </p>
      </section>

      <section style={{ padding: "60px 24px 40px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginBottom: 56 }}>
          {[
            { name: "Sciences Department", icon: "🔬", desc: "Rigorous STEM education covering Physics, Chemistry, Biology, and Further Mathematics. Designed to prepare students for university-level science programmes, medicine, and engineering." },
            { name: "Arts Department", icon: "📜", desc: "A rich humanities curriculum spanning Literature, Government, Economics, and History. Ideal for students headed into law, social sciences, business, and public administration." },
          ].map((d, i) => (
            <FadeIn key={d.name} delay={i * 0.1}>
              <div style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.15), rgba(59,130,246,0.05))", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 14, padding: "36px 28px" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{d.icon}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: "#93c5fd", marginBottom: 14 }}>{d.name}</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>{d.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Subject Listing</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: "#f1f5f9", marginBottom: 24 }}>Explore the Curriculum</h2>
            <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 4 }}>
              {["JSS", "SSS – Sciences", "SSS – Arts"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{
                    background: activeTab === tab ? "#1d4ed8" : "none",
                    border: "none", borderRadius: 6, padding: "10px 20px",
                    color: activeTab === tab ? "#fff" : "#64748b",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                    fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                  }}>{tab}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
            {(activeTab === "JSS" ? jssSubjects : activeTab === "SSS – Sciences" ? sssSciences : sssArts).map((s) => (
              <div key={s.name} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 8, padding: "16px 20px",
                display: "flex", alignItems: "center", gap: 12,
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#cbd5e1",
              }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span> {s.name}
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <section style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)", borderRadius: 16, padding: "48px 40px", textAlign: "center", boxShadow: "0 24px 80px rgba(29,78,216,0.3)" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🏆</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 16 }}>WAEC & NECO Examinations</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#bfdbfe", lineHeight: 1.8 }}>
                Our SSS 3 students sit for WAEC and NECO examinations annually. The school prepares students thoroughly through mock examinations, revision classes, and guided study programmes.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.message) return;
    setSent(true);
  };

  return (
    <div style={{ background: "#050d1f", paddingTop: 88 }}>
      <section style={{ padding: "80px 24px", textAlign: "center", background: "linear-gradient(180deg, #0a1e4a 0%, #050d1f 100%)" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Reach Out</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,7vw,58px)", fontWeight: 900, color: "#fff" }}>Contact Us</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#64748b", maxWidth: 480, margin: "20px auto 0", lineHeight: 1.7 }}>
          Questions about admissions, academics, or community partnerships? We'd love to hear from you.
        </p>
      </section>

      <section style={{ padding: "60px 24px 100px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 48, alignItems: "start" }}>
          <FadeIn>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: "#f1f5f9", marginBottom: 32 }}>Get In Touch</h2>
              {[
                { icon: "📍", label: "Address", value: "Community Secondary School\nIhoukpara, Nkanu East\nEnugu State, Nigeria" },
                { icon: "📞", label: "Phone", value: "09043488195" },
                { icon: "✉️", label: "Email", value: "louisnkan21@gmail.com" },
                { icon: "🕐", label: "School Hours", value: "Mon – Fri: 7:30am – 3:00pm" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: 16, marginBottom: 28 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: "rgba(29,78,216,0.2)", border: "1px solid rgba(59,130,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#3b82f6", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#cbd5e1", lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "40px 32px" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: "#f1f5f9", marginBottom: 12 }}>Message Received!</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#64748b", lineHeight: 1.7 }}>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                    style={{ marginTop: 24, background: "#1d4ed8", border: "none", borderRadius: 8, padding: "12px 28px", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 28 }}>Send a Message</h3>
                  {[
                    { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                    { key: "email", label: "Email Address", type: "email", placeholder: "your@email.com" },
                  ].map(field => (
                    <div key={field.key} style={{ marginBottom: 20 }}>
                      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#64748b", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 8 }}>{field.label}</label>
                      <input type={field.type} placeholder={field.placeholder}
                        value={form[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "#f1f5f9", fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: "none" }}
                      />
                    </div>
                  ))}
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#64748b", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 8 }}>Message</label>
                    <textarea placeholder="How can we help you?" rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "#f1f5f9", fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: "none", resize: "vertical" }}
                    />
                  </div>
                  <button onClick={handleSubmit}
                    style={{ width: "100%", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", border: "none", borderRadius: 8, padding: "14px", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase", boxShadow: "0 8px 24px rgba(59,130,246,0.3)" }}>
                    Send Message →
                  </button>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: "#020811", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 24px 32px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: 2 }}>CSS</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#3b82f6", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Community Secondary School</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#475569", lineHeight: 1.7 }}>Shaping Minds, Building Futures.<br />Ihoukpara, Nkanu East, Enugu State.</p>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#3b82f6", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Navigation</div>
            {["Home", "About", "Academics", "Contact"].map(p => (
              <div key={p} style={{ marginBottom: 10 }}>
                <button onClick={() => { setPage(p); window.scrollTo(0,0); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", fontFamily: "'DM Sans', sans-serif", fontSize: 14, padding: 0 }}>{p}</button>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#3b82f6", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Contact</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#475569", lineHeight: 2 }}>
              📞 09043488195<br />
              ✉️ louisnkan21@gmail.com<br />
              📍 Ihoukpara, Nkanu East<br />Enugu State
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#1e293b" }}>© 2025 Community Secondary School, Ihoukpara. All rights reserved.</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#1e293b" }}>Built with ❤️ for CSS Ihoukpara</div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState("Home");

  const img1 = "/20260305_184829.jpg";
  const img2 = "/20260305_184904.jpg";
  const img3 = "/20260305_184927.jpg";
  const img4 = "/20260305_184802.jpg";

  const renderPage = () => {
    switch (page) {
      case "Home": return <HomePage setPage={setPage} img1={img1} img2={img2} img3={img3} img4={img4} />;
      case "About": return <AboutPage img1={img1} img2={img2} />;
      case "Academics": return <AcademicsPage />;
      case "Contact": return <ContactPage />;
      default: return <HomePage setPage={setPage} img1={img1} img2={img2} img3={img3} img4={img4} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050d1f" }}>
      <Nav active={page} setPage={setPage} />
      {renderPage()}
      <Footer setPage={setPage} />
    </div>
  );
          }
