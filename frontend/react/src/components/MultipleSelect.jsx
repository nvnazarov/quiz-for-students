import { useState } from "react";


const SingleSelect = ({ answers, onSelect }) => {
    const [ selected, setSelected ] = useState([]);
    const [ answered, setAnswered ] = useState(false);

    const answerMapper = (answer, index) => {
        if (answered) {
            if (selected.includes(index)) {
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

        if (selected.includes(index)) {
            const newSelected = selected.filter(i => i !== index)
            return (
                <div onClick={ () => setSelected(newSelected) } className="answer-selected">
                    { answer }
                </div>
            );
        }

        return (
            <div onClick={ () => setSelected([...selected, index]) } className="answer">
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