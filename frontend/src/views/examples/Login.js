import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { auth, provider, signInWithPopup } from "../../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);
      navigate("/admin/index");
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  const handleLocalSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info if needed
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/admin/index");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Col lg="5" md="7">
      <Card className="glass-panel shadow border-0">
        <CardHeader className="bg-transparent pb-5">
          <div className="text-muted text-center mt-2 mb-3">
            <small>Sign in with</small>
          </div>
          <div className="btn-wrapper text-center">
            <Button
              className="btn-neutral btn-icon"
              color="default"
              onClick={handleGoogleSignIn}
            >
              <span className="btn-inner--icon">
                <img
                  alt="..."
                  src={require("../../assets/img/icons/common/google.svg").default}
                />
              </span>
              <span className="btn-inner--text">Google</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <small>Or sign in with credentials</small>
            {error && <div className="text-danger mt-2"><small>{error}</small></div>}
          </div>
          <Form role="form" onSubmit={handleLocalSignIn}>
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input 
                  placeholder="Email" 
                  type="email" 
                  autoComplete="new-email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </InputGroup>
            </FormGroup>
            <div className="custom-control custom-control-alternative custom-checkbox">
              <input
                className="custom-control-input"
                id="customCheckLogin"
                type="checkbox"
              />
              <label className="custom-control-label" htmlFor="customCheckLogin">
                <span className="text-muted">Remember me</span>
              </label>
            </div>
            <div className="text-center">
              <Button 
                className="my-4 w-100" 
                color="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
            <div className="text-center">
              <p className="text-muted small mt-2">
                Use <b>student@dyslexialearn.com</b> / <b>password123</b> to test.
              </p>
            </div>
          </Form>
        </CardBody>
      </Card>
      <Row className="mt-3">
        <Col xs="6">
          <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
            <small>Forgot password?</small>
          </a>
        </Col>
        <Col className="text-right" xs="6">
          <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
            <small>Create new account</small>
          </a>
        </Col>
      </Row>
    </Col>
  );
};

export default Login;
