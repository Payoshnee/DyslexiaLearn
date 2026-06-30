import React, { useEffect, useState } from "react";
import { Container, Card, CardBody, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import { User, Mail, Award, BookOpen } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState({ name: "Student", email: "student@example.com" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Container className="pt-5 pb-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-panel shadow-lg border-0" style={{ borderRadius: "30px", overflow: "hidden" }}>
          <div style={{ height: "150px", background: "linear-gradient(87deg, #11cdef 0, #1171ef 100%)" }}></div>
          <CardBody className="p-5 text-center" style={{ marginTop: "-75px" }}>
            
            <div className="mb-4">
              <div 
                className="bg-white rounded-circle shadow d-inline-flex align-items-center justify-content-center"
                style={{ width: "150px", height: "150px", border: "5px solid white" }}
              >
                <User size={80} className="text-info" />
              </div>
            </div>

            <h1 className="display-3 text-white font-weight-bold mb-1">{user.name}</h1>
            <p className="text-white" style={{ fontSize: "1.2rem", opacity: 0.9 }}>
              <Mail size={18} className="me-2" />
              {user.email}
            </p>

            <Row className="justify-content-center mt-5">
              <Col xs="12" md="4" className="mb-4">
                <motion.div whileHover={{ y: -10 }}>
                  <Card className="bg-transparent border-white">
                    <CardBody className="p-4 text-white">
                      <Award size={40} className="text-warning mb-3" />
                      <h2 className="text-white font-weight-bold">1,250</h2>
                      <p className="mb-0 text-uppercase">Total Points</p>
                    </CardBody>
                  </Card>
                </motion.div>
              </Col>
              <Col xs="12" md="4">
                <motion.div whileHover={{ y: -10 }}>
                  <Card className="bg-transparent border-white">
                    <CardBody className="p-4 text-white">
                      <BookOpen size={40} className="text-success mb-3" />
                      <h2 className="text-white font-weight-bold">15</h2>
                      <p className="mb-0 text-uppercase">Quizzes Passed</p>
                    </CardBody>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Profile;
