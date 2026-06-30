import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios

// reactstrap components
import { Card, Container, Row, Button, Col } from "reactstrap";

// core components
import Header from "components/Headers/Header.js";

// Flashcard Component
const Flashcard = ({ term, definition, score, onClick }) => {
  return (
    <Card className="shadow border-0 mb-3" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="flashcard">
        <div className="flashcard-term">
          <strong>{term}</strong>
        </div>
      </div>
    </Card>
  );
};

const FlashcardDetails = ({ term, definition, score, onBack }) => {
  return (
    <Card className="shadow border-0 mb-3">
      <div className="flashcard-details">
        <div className="flashcard-term">
          <strong>{term}</strong>
        </div>
        <div className="flashcard-definition">
          <p>{definition}</p>
        </div>
        <div className="flashcard-score">
          <p>Score: {score}</p>
        </div>
        <Button color="primary" onClick={onBack}>Back</Button>
      </div>
    </Card>
  );
};

const FlashcardDashboard = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const flashcardsPerPage = 6;

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/flashcards`)
      .then((response) => {
        setFlashcards(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching flashcards:", error);
        setError("Failed to load flashcards");
        setLoading(false);
      });
  }, []);

  const indexOfLastFlashcard = currentPage * flashcardsPerPage;
  const indexOfFirstFlashcard = indexOfLastFlashcard - flashcardsPerPage;
  const currentFlashcards = flashcards.slice(indexOfFirstFlashcard, indexOfLastFlashcard);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flashcard-dashboard">
      <h2>Flashcards</h2>
      {selectedFlashcard ? (
        <FlashcardDetails
          term={selectedFlashcard.term}
          definition={selectedFlashcard.definition}
          score={selectedFlashcard.score}
          onBack={() => setSelectedFlashcard(null)}
        />
      ) : (
        <div className="flashcard-container">
          <Row>
            {currentFlashcards.map((flashcard) => (
              <Col md={4} key={flashcard.id}>
                <Flashcard
                  term={flashcard.term}
                  definition={flashcard.definition}
                  score={flashcard.score}
                  onClick={() => setSelectedFlashcard(flashcard)}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <Button
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={currentPage * flashcardsPerPage >= flashcards.length}
          onClick={() => paginate(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

const FlashcardPage = () => {
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow border-0">
              <FlashcardDashboard />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default FlashcardPage;
