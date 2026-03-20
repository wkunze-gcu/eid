import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const templates = {
  arch: {
    cardClass: "template-arch",
    frameClass: "arch-frame",
    symbolClass: "arch-knot",
    title: "Eid",
    titleClass: "title-main script-title",
    subtitle: "CELEBRATIONS"
  },
  crescent: {
    cardClass: "template-crescent",
    frameClass: "crescent-frame",
    symbolClass: "crescent-moon",
    title: "EID MUBARAK",
    titleClass: "title-main block-title",
    subtitle: "Moon, mosque and blessings"
  },
  luxury: {
    cardClass: "template-luxury",
    frameClass: "luxury-frame",
    symbolClass: "luxury-ornament",
    title: "Eid Mubarak",
    titleClass: "title-main block-title",
    subtitle: "Islamic Arch Green and Golden Luxury"
  },
  night: {
    cardClass: "template-night",
    frameClass: "night-frame",
    symbolClass: "night-moon",
    extraSymbol: (
      <>
        <div className="night-lantern" />
        <div className="night-flame" />
      </>
    ),
    title: "Ramadan Kareem",
    titleClass: "title-main block-title",
    subtitle: "Moonlight, lantern and glowing sky"
  }
};

function useSearchState() {
  const location = useLocation();
  return new URLSearchParams(location.search);
}

function getDefaultMessage(name) {
  return `${name}، اللہ آپ کی عید کو خوشیوں، رحمتوں، محبتوں اور دل کے سکون سے بھر دے۔`;
}

export default function CardGeneratorPage() {
  const navigate = useNavigate();
  const params = useSearchState();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const particlesRef = useRef([]);

  const queryFrom = params.get("from") || "";
  const queryTo = params.get("to") || "";
  const queryMsg = params.get("msg") || "";
  const queryTemplate = params.get("template") || "arch";
  const hasCard = Boolean(queryFrom);

  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [custom, setCustom] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("arch");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function animateFireworks() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(
        (particle) => particle.alpha > 0.02
      );

      particlesRef.current.forEach((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.dy += 0.03;
        particle.alpha *= 0.97;

        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (particlesRef.current.length > 0) {
        animationRef.current = window.requestAnimationFrame(animateFireworks);
      }
    }

    function createBurst(x, y) {
      const colors = ["#ffd86b", "#ffb22c", "#f9f1d3", "#7ee7b7", "#e0b44f"];

      for (let i = 0; i < 28; i += 1) {
        const angle = (Math.PI * 2 * i) / 28;
        const speed = 2 + Math.random() * 3.6;
        particlesRef.current.push({
          x,
          y,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          radius: 1.6 + Math.random() * 2.2,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    function launchFireworks() {
      particlesRef.current = [];

      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }

      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      let bursts = 0;

      intervalRef.current = window.setInterval(() => {
        const x = 80 + Math.random() * Math.max(window.innerWidth - 160, 60);
        const y = 80 + Math.random() * Math.max(window.innerHeight * 0.36, 120);
        createBurst(x, y);
        bursts += 1;

        if (bursts >= 6) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;

          timeoutRef.current = window.setTimeout(() => {
            timeoutRef.current = null;
          }, 1200);
        }

        if (!animationRef.current) {
          animateFireworks();
        }
      }, 320);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (hasCard) {
      launchFireworks();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [hasCard, queryFrom, queryTo, queryMsg, queryTemplate]);

  function generateLink() {
    const trimmedSender = sender.trim();
    const trimmedReceiver = receiver.trim();
    const trimmedCustom = custom.trim();

    if (!trimmedSender || !trimmedReceiver) {
      window.alert("براہ کرم دونوں نام لکھیں");
      return;
    }

    const search = new URLSearchParams({
      from: trimmedSender,
      to: trimmedReceiver,
      msg: trimmedCustom,
      template: selectedTemplate
    });

    navigate(`/card?${search.toString()}`);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      window.alert("Link copied!");
    } catch {
      window.alert("Copy failed.");
    }
  }

  function goHome() {
    navigate("/card");
  }

  const activeTemplate = templates[queryTemplate] || templates.arch;

  return (
    <div className="card-page-root">
      <canvas id="fireworksCanvas" ref={canvasRef} />

      <main className="shell">
        <div className="route-backdrop route-backdrop-card">
          <Link className="route-back" to="/">
            Back Home
          </Link>
        </div>

        {!hasCard ? (
          <section className="panel">
            <h1 className="form-title">عید مبارک کارڈ</h1>
            <p className="form-subtitle">
              نام لکھیں، ٹیمپلیٹ منتخب کریں، پھر خوبصورت اسلامی اسٹائل میں کارڈ
              بنائیں
            </p>

            <div className="field">
              <label htmlFor="sender">آپ کا نام</label>
              <input
                id="sender"
                placeholder="اپنا نام لکھیں"
                value={sender}
                onChange={(event) => setSender(event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="receiver">جس کو بھیجنا ہے اس کا نام</label>
              <input
                id="receiver"
                placeholder="وصول کرنے والے کا نام لکھیں"
                value={receiver}
                onChange={(event) => setReceiver(event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="custom">خاص پیغام</label>
              <input
                id="custom"
                placeholder="اگر چاہیں تو اپنا پیغام لکھیں"
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
              />
            </div>

            <div className="section-label">ٹیمپلیٹ منتخب کریں</div>
            <div className="template-grid">
              <label className="template-option">
                <input
                  type="radio"
                  name="template"
                  value="arch"
                  checked={selectedTemplate === "arch"}
                  onChange={(event) => setSelectedTemplate(event.target.value)}
                />
                <span className="swatch-arch">
                  <span className="swatch-label">Arch Gold</span>
                </span>
              </label>

              <label className="template-option">
                <input
                  type="radio"
                  name="template"
                  value="crescent"
                  checked={selectedTemplate === "crescent"}
                  onChange={(event) => setSelectedTemplate(event.target.value)}
                />
                <span className="swatch-crescent">
                  <span className="swatch-label">Crescent White</span>
                </span>
              </label>

              <label className="template-option">
                <input
                  type="radio"
                  name="template"
                  value="luxury"
                  checked={selectedTemplate === "luxury"}
                  onChange={(event) => setSelectedTemplate(event.target.value)}
                />
                <span className="swatch-luxury">
                  <span className="swatch-label">Luxury Green</span>
                </span>
              </label>

              <label className="template-option">
                <input
                  type="radio"
                  name="template"
                  value="night"
                  checked={selectedTemplate === "night"}
                  onChange={(event) => setSelectedTemplate(event.target.value)}
                />
                <span className="swatch-night">
                  <span className="swatch-label">Night Lantern</span>
                </span>
              </label>
            </div>

            <button type="button" onClick={generateLink}>
              کارڈ بنائیں
            </button>
          </section>
        ) : (
          <section className="card-page">
            <article className={`eid-card ${activeTemplate.cardClass}`}>
              <div className={`card-inner ${activeTemplate.frameClass}`}>
                <div className={`${activeTemplate.symbolClass} card-symbol`} />
                <div>{activeTemplate.extraSymbol || null}</div>
                <h1 className={activeTemplate.titleClass}>{activeTemplate.title}</h1>
                <div className="subtitle-main">{activeTemplate.subtitle}</div>
                <p className="from-text">{queryFrom} کی طرف سے</p>
                <p className="message-text">
                  {queryMsg || getDefaultMessage(queryTo)}
                </p>
              </div>
            </article>

            <div className="card-actions">
              <button type="button" onClick={copyLink}>
                Copy Link
              </button>
              <button type="button" className="secondary-btn" onClick={goHome}>
                نیا کارڈ بنائیں
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
