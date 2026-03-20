import { useState } from "react";
import { Link } from "react-router-dom";

const colors = ["#f6d46b", "#e47b43", "#12b76a", "#60a5fa", "#f43f5e"];

export default function EnvelopePage() {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("Name");
  const [isOpened, setIsOpened] = useState(false);
  const [bursts, setBursts] = useState([]);

  function celebrate() {
    const nextBursts = Array.from({ length: 40 }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      left: `${Math.random() * 100}vw`,
      top: `${-Math.random() * 20}px`,
      background: colors[Math.floor(Math.random() * colors.length)],
      animationDuration: `${900 + Math.random() * 800}ms`
    }));

    setBursts(nextBursts);
    window.setTimeout(() => {
      setBursts([]);
    }, 1800);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const rawName = name.trim();
    if (!rawName) {
      return;
    }

    setDisplayName(rawName);
    setIsOpened(true);
    celebrate();
  }

  return (
    <main className="envelope-page">
      <div className="route-backdrop">
        <Link className="route-back" to="/">
          Back Home
        </Link>
      </div>

      <div className="wrapper">
        <h1 className="title">Eid Mubarak</h1>

        <section className="scene">
          <div className={`envelope${isOpened ? " opened" : ""}`}>
            <div className="body" />
            <article className="card">
              <h2>Eid Mubarak</h2>
              <p className="message">
                {displayName}, meri taraf se aap ko aur aap ki family ko Eid
                Mubarak.
              </p>
            </article>
            <div className="flap" />
          </div>
        </section>

        <form className="controls" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Write your name"
            autoComplete="off"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button type="submit">Show Card</button>
        </form>

        <p className="hint">Name likhein, phir Enter ya Show Card dabayein.</p>
      </div>

      {bursts.map((burst) => (
        <span
          key={burst.id}
          className="burst"
          style={{
            left: burst.left,
            top: burst.top,
            background: burst.background,
            animationDuration: burst.animationDuration
          }}
        />
      ))}
    </main>
  );
}
