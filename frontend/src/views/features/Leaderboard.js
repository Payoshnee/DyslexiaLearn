import React from "react";
import { Container, Card, CardBody, Table } from "reactstrap";
import { motion } from "framer-motion";
import { Award, Medal } from "lucide-react";

const LEADERBOARD_DATA = [
  { rank: 1, name: "Demo Student", score: 1250, badge: "🥇" },
  { rank: 2, name: "Alice J.", score: 1100, badge: "🥈" },
  { rank: 3, name: "Sammy T.", score: 950, badge: "🥉" },
  { rank: 4, name: "Emma W.", score: 820, badge: "⭐" },
  { rank: 5, name: "Oliver P.", score: 700, badge: "⭐" },
];

const Leaderboard = () => {
  return (
    <Container className="pt-5 pb-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-panel shadow-lg border-0" style={{ borderRadius: "30px", overflow: "hidden" }}>
          <CardBody className="p-5">
            <div className="text-center mb-5">
              <Award size={64} className="text-warning mb-3" />
              <h1 className="text-white display-3" style={{ fontWeight: "800", letterSpacing: "2px" }}>
                Leaderboard
              </h1>
              <p className="text-white" style={{ fontSize: "1.2rem" }}>Top learners this week!</p>
            </div>

            <div className="table-responsive">
              <Table className="text-white text-center align-middle" style={{ fontSize: "1.2rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.2)" }}>
                    <th className="pb-3 text-uppercase font-weight-bold">Rank</th>
                    <th className="pb-3 text-uppercase font-weight-bold">Student</th>
                    <th className="pb-3 text-uppercase font-weight-bold">Score</th>
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
                        backgroundColor: student.rank === 1 ? "rgba(255, 215, 0, 0.2)" : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.1)"
                      }}
                    >
                      <td className="py-4">
                        <span style={{ fontSize: "1.5rem" }}>{student.badge}</span>
                      </td>
                      <td className="py-4 font-weight-bold" style={{ fontSize: "1.3rem" }}>
                        {student.name}
                      </td>
                      <td className="py-4 text-warning font-weight-bold" style={{ fontSize: "1.3rem" }}>
                        {student.score} pts
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Leaderboard;
