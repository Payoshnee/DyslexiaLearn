import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck } from "lucide-react";

import { useDoodle } from "../companion/DoodleContext.js";
import VideoPage from "../components/ui/VideoPage.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { profile, setProfile } = useDoodle();

  const googleLogin = () => {
    setProfile(profile || { name: "Google Learner", age: 8, provider: "google" });
    navigate("/choose-doodle");
  };

  return (
    <VideoPage className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">DyslexiaLearn</p>
        <h1>Welcome back</h1>
        <p>Sign in to continue learning with your AI Doodle.</p>
        <label>
          Email
          <input placeholder="student@dyslexialearn.com" type="email" />
        </label>
        <label>
          Password
          <input placeholder="password123" type="password" />
        </label>
        <div className="auth-actions">
          <button type="button" onClick={() => navigate(profile ? "/choose-doodle" : "/new-user")}>
            Login
          </button>
          <Link to="/register">Register</Link>
        </div>
        <button className="google-button" type="button" onClick={googleLogin}>
          <BadgeCheck size={18} /> Sign in with Google
        </button>
      </section>
    </VideoPage>
  );
}
