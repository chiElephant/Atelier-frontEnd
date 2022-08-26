import React, { useState, useEffect } from 'react';
import AnswerList from './AnswerList.jsx';
import markQuestionAsHelpful from './helper_functions/markQuestionAsHelpful.js';
import getAnswers from './helper_functions/getAnswers.js';
import ModalAnswer from './ModalAnswer.jsx';

function Question({ question_id, body, helpfulness, productName, productId }) {
  const [answerList, setAnswerList] = useState([]);
  const [page, setPage] = useState(1);
  const [helpCount, setHelpCount] = useState(helpfulness);
  const [allowUserVote, setAllowUserVote] = useState(false);
  const [isModel, setIsModel] = useState(false);

  useEffect(() => {
    getAnswers(question_id, page, setAnswerList);
  }, []);

  function showModal() {
    setIsModel(!isModel);
  }

  function incrementHelpCount() {
    markQuestionAsHelpful(question_id);
    setHelpCount((prevState) => prevState + 1);
    setAllowUserVote(true);
  }

  let userVote;
  if (allowUserVote) {
    userVote = <div className="question-yes">Yes({helpCount})</div>;
  } else {
    userVote = (
      <div className="question-yes" onClick={incrementHelpCount}>
        Yes({helpCount})
      </div>
    );
  }

  const model = isModel ? (
    <ModalAnswer
      productName={productName}
      productId={productId}
      questionBody={body}
      showModal={() => {
        showModal();
      }}
    />
  ) : null;

  return (
    <div>
      {model}
      <div className="question">
        <div>
          <h3>Q:</h3>
          <h3>{body}</h3>
        </div>

        <div className="question-options">
          <div className="question-helpful">
            <div>Helpful?</div>
            {userVote}
          </div>
          <div className="question-add-answer" onClick={showModal}>
            Add Answer
          </div>
        </div>
      </div>
      <AnswerList answerList={answerList} />
    </div>
  );
}

export default Question;