// import React, { useState, useEffect } from "react";
// import axios from "axios";  // Import axios

// // reactstrap components
// import { Card, Container, Row } from "reactstrap";

// // core components
// import Header from "components/Headers/Header.js";

// // Flashcard Component
// const Flashcard = ({ term, definition, score }) => {
//   return (
//     <div className="flashcard">
//       <div className="flashcard-term">
//         <strong>{term}</strong>
//       </div>
//       <div className="flashcard-definition">
//         {definition}
//       </div>
//       <div className="flashcard-score">
//         <p>Score: {score}</p>
//       </div>
//     </div>
//   );
// };

// const FlashcardDashboard = () => {
//   const [flashcards, setFlashcards] = useState([]);
//   const [loading, setLoading] = useState(true);  // Loading state to handle loading state
//   const [error, setError] = useState(null);  // Error state for error handling

//   useEffect(() => {
//     // Fetch flashcards from the backend using Axios
//     axios
//       .get("http://localhost:8080/api/flashcards")  // Adjust the URL as needed
//       .then((response) => {
//         setFlashcards(response.data);  // Set flashcards data
//         setLoading(false);  // Set loading to false once data is fetched
//       })
//       .catch((error) => {
//         console.error("Error fetching flashcards:", error);
//         setError("Failed to load flashcards");  // Set error message
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;  // Display loading text while fetching
//   }

//   if (error) {
//     return <div>{error}</div>;  // Display error message if there is an error
//   }

//   return (
//     <div className="flashcard-dashboard">
//       <h2>Flashcards</h2>
//       <div className="flashcard-container">
//         {flashcards.length > 0 ? (
//           flashcards.map((flashcard) => (
//             <Flashcard
//               key={flashcard.id}
//               term={flashcard.term}
//               definition={flashcard.definition}
//               score={flashcard.score}
//             />
//           ))
//         ) : (
//           <p>No flashcards available</p>
//         )}
//       </div>
//     </div>
//   );
// };

// const FlashcardPage = () => {
//   return (
//     <>
//       <Header />
//       {/* Page content */}
//       <Container className="mt--7" fluid>
//         <Row>
//           <div className="col">
//             <Card className="shadow border-0">
//               {/* Replace MapWrapper with FlashcardDashboard */}
//               <FlashcardDashboard />
//             </Card>
//           </div>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default FlashcardPage;
