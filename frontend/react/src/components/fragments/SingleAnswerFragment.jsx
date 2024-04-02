import { useState } from 'react';


const SingleAnswerFragment = ({ answers, onSelect }) => {
    const [selected, setSelected] = useState(false);

    if (selected) {
        return (
            <div>
                { answers[selected] }
            </div>
        );
    }

    const answerMapper = (answer, index) => (
        <div onClick={ () => { onSelect(index); setSelected(index); } }>
            { answer }
        </div>
    );
    const answersElements = answers.map(answerMapper);

    return (
        <div>
            { answersElements }
        </div>
    );
};


export default SingleAnswerFragment;