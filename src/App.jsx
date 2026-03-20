import { Link, Route, Routes } from "react-router-dom";
import CardGeneratorPage from "./pages/CardGeneratorPage";

function HomePage() {
  return (
    <main className="home-page">
      <div className="home-shell">
        <p className="home-kicker">React + Vercel Ready</p>
        <h1 className="home-title">Eid Greeting App</h1>
        <p className="home-copy">
          Dono designs ko React app mein convert kar diya gaya hai. Neeche se apna
          page open kar ke Vercel par deploy kar sakte hain.
        </p>

        <div className="home-grid">
          <Link className="home-card" to="/card">
            <span className="home-card-title">Card Generator</span>
            <span className="home-card-copy">
              Shareable Eid card with template selection and fireworks.
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/card" element={<CardGeneratorPage />} />
    </Routes>
  );
}
