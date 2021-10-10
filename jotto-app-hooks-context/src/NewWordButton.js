import React from "react";
import PropTypes from "prop-types";

import stringsModule from "./helpers/strings";
import languageContext from "./contexts/languageContext";
import hookactions from "./actions/hookActions"

import successContext from "./contexts/successContext";
import guessedWordsContext from "./contexts/guessedWordsContext";

/**
 * Functional react component for reset button.
 * @function
 * @param {object} props - React props.
 * @returns {JSX.Element} - Rendered component (or null if `success` context is false).
 */
export default function NewWordButton(props) {
  const language = React.useContext(languageContext);

  const [guessedWords, setGuessedWords] = guessedWordsContext.useGuessedWords();
  const [success, setSuccess] = successContext.useSuccess();
  const resetGame = (setSecretWord, setGivenUp) => {

    // reset the secret word
    hookactions.getSecretWord(setSecretWord)

    // reset the guessedWords array
    setGuessedWords([]);

    // reset success
    setSuccess(false);

    // reset givenUp
    setGivenUp(false);

  }

  if (success) {
    return (
      <button
        data-test="component-new-word-button"
        className="btn btn-primary mb-2"
        onClick={() => resetGame(props.setSecretWord, props.setGivenUp)}
      >
        {stringsModule.getStringByLanguage(language, "newWord")}
      </button>
    )
  }
  else {
    return <div data-test="component-new-word-button"></div>;
  }
}

NewWordButton.propTypes = {
  setSecretWord: PropTypes.func.isRequired,

  setGivenUp: PropTypes.func.isRequired,
}

