import React from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Table } from "reactstrap";

const LEADERBOARD_DATA = [
  { rank: 1, name: "Demo Student", score: 1250, badge: "🥇" },
  { rank: 2, name: "Alice J.", score: 1100, badge: "🥈" },
  { rank: 3, name: "Sammy T.", score: 950, badge: "🥉" },
  { rank: 4, name: "Emma W.", score: 820, badge: "⭐" },
  { rank: 5, name: "Oliver P.", score: 700, badge: "⭐" },
];

const LeaderboardFeature = () => {
  return (
    <div style={{ padding: "2rem", height: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div className="text-center mb-5">
        <Award size={64} className="text-warning mb-3" />
        <h1 style={{ color: "#32325d", fontSize: "3rem", fontWeight: "800", letterSpacing: "2px" }}>
          Leaderboard
        </h1>
        <p style={{ color: "#525f7f", fontSize: "1.2rem" }}>Top learners this week!</p>
      </div>

      <div className="table-responsive">
        <Table className="text-center align-middle" style={{ fontSize: "1.2rem", color: "#32325d" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
              <th className="pb-3 text-uppercase font-weight-bold border-0 text-muted">Rank</th>
              <th className="pb-3 text-uppercase font-weight-bold border-0 text-muted">Student</th>
              <th className="pb-3 text-uppercase font-weight-bold border-0 text-muted">Score</th>
            </tr>
          </thead>
          <tbody>
            {LEADERBOARD_DATA.map((student, index) => (
              <motion.tr 
                key={student.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ 
                  backgroundColor: student.rank === 1 ? "rgba(251, 99, 64, 0.1)" : "transparent",
                  borderBottom: "1px solid rgba(0,0,0,0.05)"
                }}
              >
                <td className="py-4 border-0">
                  <span style={{ fontSize: "1.8rem" }}>{student.badge}</span>
                </td>
                <td className="py-4 font-weight-bold border-0" style={{ fontSize: "1.3rem" }}>
                  {student.name}
                </td>
                <td className="py-4 text-warning font-weight-bold border-0" style={{ fontSize: "1.3rem" }}>
                  {student.score} pts
                </td>
              </motion.tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default LeaderboardFeature;
