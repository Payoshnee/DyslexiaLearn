import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Award, BookOpen } from "lucide-react";
import { Row, Col, Card, CardBody } from "reactstrap";

const ProfileFeature = () => {
  const [user, setUser] = useState({ name: "Student", email: "student@dyslexialearn.com" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div style={{ padding: "2rem", height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="mb-4 mt-4">
        <div 
          className="bg-white rounded-circle shadow d-inline-flex align-items-center justify-content-center"
          style={{ width: "150px", height: "150px", border: "5px solid #11cdef" }}
        >
          <User size={80} className="text-info" />
        </div>
      </div>

      <h1 style={{ fontSize: "3rem", color: "#32325d", fontWeight: "900", marginBottom: "0.5rem" }}>
        {user.name}
      </h1>
      <p style={{ color: "#8898aa", fontSize: "1.2rem", display: "flex", alignItems: "center" }}>
        <Mail size={18} className="me-2" />
        {user.email}
      </p>

      <Row className="justify-content-center mt-5 w-100">
        <Col xs="12" md="5" className="mb-4">
          <motion.div whileHover={{ y: -10 }}>
            <Card className="shadow-lg border-0" style={{ background: "linear-gradient(87deg, #fb6340 0, #fbb140 100%)", borderRadius: "20px" }}>
              <CardBody className="p-4 text-center text-white">
                <Award size={48} className="mb-3" />
                <h2 className="text-white font-weight-bold" style={{ fontSize: "2.5rem" }}>1,250</h2>
                <p className="mb-0 text-uppercase" style={{ fontWeight: "bold", letterSpacing: "1px" }}>Total Points</p>
              </CardBody>
            </Card>
          </motion.div>
        </Col>
        <Col xs="12" md="5">
          <motion.div whileHover={{ y: -10 }}>
            <Card className="shadow-lg border-0" style={{ background: "linear-gradient(87deg, #2dce89 0, #2dcecc 100%)", borderRadius: "20px" }}>
              <CardBody className="p-4 text-center text-white">
                <BookOpen size={48} className="mb-3" />
                <h2 className="text-white font-weight-bold" style={{ fontSize: "2.5rem" }}>15</h2>
                <p className="mb-0 text-uppercase" style={{ fontWeight: "bold", letterSpacing: "1px" }}>Quizzes Passed</p>
              </CardBody>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileFeature;
