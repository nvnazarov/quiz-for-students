import {useState} from 'react'

import './Builder.css'
import SingleOptionQuestion from './questions/SingleOptionQuestion';

export default function Builder() {
    let [questionsData, setQuestionsData] = useState([]);
    let [id, setId] = useState(0);

    function onDelete(id) {
        setQuestionsData(questionsData.filter(data => data.id !== id));
    }

    function addSingleOptionQuestion() {
        setQuestionsData([...questionsData, {
            id: id,
            type: 'single-option'
        }]);
        setId(id + 1);
    }

    let questions = questionsData.map(
        data => {
            if (data.type === 'single-option') {
                return <SingleOptionQuestion key={data.id} id={data.id} onDelete={onDelete} />
            } else {
                return <div>wtf</div>
            }
        }
    );

    return (
        <div id='builder-container'>
            {questions}
            <button onClick={addSingleOptionQuestion}>Add Single Option</button>
        </div>
    );
}