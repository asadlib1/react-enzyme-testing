import React from 'react';
import './App.css';
import hookActions from './actions/hookActions';
import languageContext from './contexts/languageContext';
import successContext from './contexts/successContext';
import guessedWordsContext from './contexts/guessedWordsContext';

import LanguagePicker from './LanguagePicker';
import Input from './Input';
import Congrats from './Congrats';
import GuessedWords from './GuessedWords';
import NewWordButton from './NewWordButton';
import SecretWordReveal from './SecretWordReveal';
import GiveUpButton from './GiveUpButton';
import EnterSecretWordButton from './EnterSecretWordButton';
import SecretWordEntry from './SecretWordEntry';

/**
 * Reducer to update state, called automatically by dispatch
 * @param state {object} - existing state
 * @param action {object} - contains 'type' and 'payload' properties for the state update
 *                   for example: { type: "setSecretWord", payload: "party" }
 * @return {object} - new state
 */
function reducer(state, action) {
  switch (action.type) {
    case "setSecretWord":
      return { ...state, secretWord: action.payload };
    case "setLanguage":
      return { ...state, language: action.payload };
    case "setGivenUp":
      return { ...state, givenUp: action.payload }
    case "setEnterSecretWord":
      return { ...state, enterSecretWord: action.payload }
    case "setServerError":
      return { ...state, serverError: action.payload }
    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }

}

function App() {

  const [state, dispatch] = React.useReducer(
    reducer,
    { secretWord: null, language: 'en' }
  )

  const setSecretWord = (secretWord) =>
    dispatch({ type: "setSecretWord", payload: secretWord });
  const setLanguage = (language) =>
    dispatch({ type: "setLanguage", payload: language });
  const setGivenUp = (givenUp) =>
    dispatch({ type: "setGivenUp", payload: givenUp })
  const setEnterSecretWord = (enterSecretWord) =>
    dispatch({ type: "setEnterSecretWord", payload: enterSecretWord })
  const setServerError = (isServerError) =>
    dispatch({ type: "setEnterSecretWord", payload: isServerError })

  React.useEffect(
    () => { hookActions.getSecretWord(setSecretWord, setServerError) },
    []
  )

  if (!state.secretWord) {
    return (
      <div className="container" data-test="spinner">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading secret word</p>
      </div>
    );
  }

  return (
    <div className="container" data-test="component-app">
      <h1>Jotto</h1>
      <languageContext.Provider value={state.language}>
        <LanguagePicker setLanguage={setLanguage} />
        <guessedWordsContext.GuessedWordsProvider>
          {state.enterSecretWord
            ? <SecretWordEntry setEnterSecretWord={setEnterSecretWord} setSecretWord={setSecretWord} />
            : (<div>
              <successContext.SuccessProvider>
                {state.givenUp
                  ? <SecretWordReveal secretWord={state.secretWord} />
                  : <Congrats />}

                <NewWordButton setSecretWord={setSecretWord} setGivenUp={setGivenUp} />
                {!state.givenUp ? <GiveUpButton setGivenUp={setGivenUp} /> : ""}
                <Input secretWord={state.secretWord} />
              </successContext.SuccessProvider>
              <GuessedWords />
              <EnterSecretWordButton setEnterSecretWord={setEnterSecretWord} />
            </div>)
          }
        </guessedWordsContext.GuessedWordsProvider>
      </languageContext.Provider>
    </div>
  );
}

export default App;
