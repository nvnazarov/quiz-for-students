import {useState} from 'react'

import './Questions.css'

export default function SingleOptionQuestion({id, onDelete}) {
    let [title, setTitle] = useState("Task");
    let [answersData, setAnswersData] = useState(["A", "B", "C", "D"]);

    function updateAnswerData(index, value) {
        let a = [...answersData];
        a[index] = value;
        setAnswersData(a);
    }

    let answers = answersData.map((data, index) => 
    <div className='builder-question-soq-container'>
        <div
            contentEditable
            className='builder-question-soq-answer'
            key={index}
            onChange={(e) => updateAnswerData(index, e.target.value)}
        >{data}</div>
    </div>);

    return (
        <div className='builder-question-container'>
            <div className='builder-question-panel'>
                <div className='builder-question-btn' onClick={() => onDelete(id)} />
            </div>

            <div
                contentEditable
                className='builder-question-task'
                onChange={(e) => setTitle(e.target.value)}
            >{title}</div>

            <div className='builder-question-soq-answers'>
                {answers}
            </div>
        </div>
    );
}