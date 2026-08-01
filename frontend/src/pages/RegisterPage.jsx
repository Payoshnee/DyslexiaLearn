import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { useState } from "react";

import { useDoodle } from "../companion/DoodleContext.js";
import VideoPage from "../components/ui/VideoPage.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setProfile } = useDoodle();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const register = (event) => {
    event.preventDefault();
    setProfile({ name: name.trim() || "Learner", age: Number(age) || 7 });
    navigate("/choose-doodle");
  };

  const googleRegister = () => {
    setProfile({ name: "Google Learner", age: 8, provider: "google" });
    navigate("/choose-doodle");
  };

  return (
    <VideoPage className="auth-page">
      <form className="auth-panel" onSubmit={register}>
        <p className="eyebrow">Create account</p>
        <h1>Register learner</h1>
        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Aarav" />
        </label>
        <label>
          Age
          <input value={age} onChange={(event) => setAge(event.target.value)} min="4" max="14" type="number" />
        </label>
        <button type="submit">Create and choose doodle</button>
        <button className="google-button" type="button" onClick={googleRegister}>
          <BadgeCheck size={18} /> Sign up with Google
        </button>
        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </VideoPage>
  );
}
