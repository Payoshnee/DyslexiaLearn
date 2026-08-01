import { Link } from "react-router-dom";
import { ArrowRight, Bot, Mic, Sparkles } from "lucide-react";

import VideoPage from "../components/ui/VideoPage.jsx";

export default function HomePage() {
  return (
    <VideoPage className="home-page">
      <nav className="home-nav">
        <span className="brand-mark"><Bot size={20} /> DyslexiaLearn</span>
        <Link to="/login">Login</Link>
      </nav>
      <section className="home-hero">
        <p className="eyebrow">Voice-first AI Doodle</p>
        <h1>Learn by speaking with a friendly 3D companion</h1>
        <p>
          A dyslexia-friendly tutor that listens, responds, remembers tricky words,
          and turns lessons into small spoken steps.
        </p>
        <div className="home-actions">
          <Link className="primary-link" to="/login">
            Get started <ArrowRight size={18} />
          </Link>
          <span><Mic size={18} /> Speak, practice, repeat</span>
        </div>
      </section>
      <section className="home-feature-strip" aria-label="Highlights">
        <span><Sparkles size={16} /> 3D doodle guide</span>
        <span>RAG learning memory</span>
        <span>Pronunciation coaching</span>
      </section>
    </VideoPage>
  );
}
