import { useState } from "react";


const SingleSelect = ({ answers, onSelect }) => {
    const [ selected, setSelected ] = useState(0);
    const [ answered, setAnswered ] = useState(false);

    const answerMapper = (answer, index) => {
        if (answered) {
            if (index === selected) {
                return (
                    <div className="answer-selected-locked">
                        { answer }
                    </div>
                );
            }

            return (
                <div className="answer-locked">
                    { answer }
                </div>
            );
        }

        if (index === selected) {
            return (
                <div onClick={ () => setSelected(index) } className="answer-selected">
                    { answer }
                </div>
            );
        }

        return (
            <div onClick={ () => setSelected(index) } className="answer">
                { answer }
            </div>
        );
    };

    const answersElements = answers.map(answerMapper);

    return (
        <>
            <div className="q-answers-container">
                { answersElements }
            </div>
            <div className="text-centered">
                <button onClick={ () => { setAnswered(true); onSelect(selected) } }>Ответить</button>
            </div>
        </>
    );
};


export default SingleSelect;