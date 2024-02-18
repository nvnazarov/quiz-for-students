import {useState, useEffect} from 'react'
import './Quiz.css'

export default function Quiz({id}) {
    let [quizData, setQuizData] = useState(null);

    // update quiz state once
    useEffect(() => {
        updateQuizState();
    }, []);

    async function updateQuizState() {
        try {
            let response = await fetch(
                `http://localhost:8000/quiz/live/${id}`
            );

            let json = await response.json();
            setQuizData(json);
    
            setTimeout(updateQuizState, 3000);
        } catch (error) {
            setQuizData({status: 'error'});
        }
    }

    // waiting for some data
    if (quizData === null) {
        return (
            <div className='centered'>
                <div className='spinner'></div>
            </div>
        );
    }

    if (quizData.status === 'prepare') {
        return (
            <div className='centered'>
                Prepare
            </div>
        );
    }

    return (
        <div className='centered'>
            Quiz does not exist
        </div>
    );
}