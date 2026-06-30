import StudentHome from "views/StudentHome.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";

import Pronunciation from "views/features/Pronunciation.js";
import Quiz from "views/features/Quiz.js";
import Leaderboard from "views/features/Leaderboard.js";
import Profile from "views/features/Profile.js";

var routes = [
  {
    path: "/index",
    name: "Student Home",
    icon: "ni ni-tv-2 text-primary",
    component: <StudentHome />,
    layout: "/admin",
  },
  {
    path: "/pronunciation",
    name: "Pronunciation",
    icon: "ni ni-chat-round text-success",
    component: <Pronunciation />,
    layout: "/admin",
  },
  {
    path: "/quiz",
    name: "Quiz",
    icon: "ni ni-controller text-warning",
    component: <Quiz />,
    layout: "/admin",
  },
  {
    path: "/leaderboard",
    name: "Leaderboard",
    icon: "ni ni-trophy text-yellow",
    component: <Leaderboard />,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "ni ni-single-02 text-info",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
];

export default routes;
