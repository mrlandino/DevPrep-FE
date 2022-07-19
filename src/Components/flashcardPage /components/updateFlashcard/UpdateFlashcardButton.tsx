import React, { useState, useContext, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./UpdateFlashcard.scss";
import CardContext from "../../../../CardContext";
import UserContext from "../../../../UserContext";
import { patchCard } from "../../../../apiCalls/apiCalls";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#5d6160",
    },
    secondary: {
      main: "#9ec7c0",
    },
  },
});

function UpdateFlashcardButton({setDeck, deck}) {
  const { currentCard } = useContext(CardContext);
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!currentCard) {
      return;
    }
    setQuestion(currentCard.attributes.frontSide);
    setNotes(currentCard.attributes.backSide);
    setRating(currentCard.attributes.competenceRating);
  }, [currentCard]);

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedCard = {
      competenceRating: rating,
      frontSide: question,
      backSide: notes,
    };
    await patchCard(
      Number(user.data.userId),
      Number(currentCard.id),
      updatedCard
    ).then((res) => {
      setDeck([...deck.map((card) => {
        if(card.id === res.data.id) {
          return res.data
        } else {
          return card
        }
      })])
    });
    handleClose()
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          Update Current FlashCard
        </Button>
      </ThemeProvider>
      <Modal open={open} onClose={handleClose}>
        <Box component="form">
          <h3>Update Current Card</h3>

          <div className="update-flashcards-rating-container">
            <Typography
              style={{ textAlign: "center", fontSize: "2.8" }}
              component="legend"
            >
              Comfort Rating
            </Typography>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(e, value) => setRating(value)}
            />
          </div>
          <ThemeProvider theme={theme}>
            <TextField
              multiline
              color="secondary"
              variant="standard"
              label="Question"
              value={question}
              rows={6}
              onChange={(e) => setQuestion(e.target.value)}
              className="text-field update-flashcard-question"
              type="text"
            />

            <TextField
              multiline
              color="secondary"
              variant="standard"
              label="Notes"
              value={notes}
              rows={6}
              onChange={(e) => setNotes(e.target.value)}
              className="text-field update-flashcard-notes"
              type="text"
            />

            <Button
              variant="contained"
              onClick={(e) => handleSubmit(e)}
              color="primary"
            >
              Submit
            </Button>
          </ThemeProvider>
        </Box>
      </Modal>
    </>
  );
}

export default UpdateFlashcardButton;
