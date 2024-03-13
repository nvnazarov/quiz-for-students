import { useState } from 'react'

const QuizConstructor = ({ onFinish }) => {
    const [commonData, setCommonData] = useState(
        {
            rows: 5,
            columns: 5
        }
    )
    const [themes, setThemes] = useState([])
    const [questionsData, setQuestionsData] = useState([])

    const onAddTheme = () => {

    }

    const onFinishQuizConstruction = () => {
        const response = fetch(
            'api/v1/quiz/',
            {
                method: 'POST',
                body: {
                    themes: themes,
                    questions: questionsData,               
                }
            }
        )

        if (!response.ok) {
            // TODO
        } else {
            onFinish()
        }
    }

    const onFieldResize = () => {
        
    }

    const getQuestionData = (i, j) => {

    }

    const questionsCells = questionsData.map((data) => <div>data.cost</div>)

    return (
        <>
            <div>
                { questionsCells }
            </div>
            <button onClick={ onAddTheme }>add theme</button>
            <button onClick={ onFinishQuizConstruction }>finish</button>
        </>
    )
}

export default QuizConstructor