import { useState } from "react"
import { apiUrl } from "../config"
import SingleAnswerCard from "../components/test/SingleAnswerCard"

const TestConstructor = () => {
    const [questionsData, setQuestionsData] = useState([])
    const [saveError, setSaveError] = useState(false)

    const QuestionType = {
        SingleAnswer: "SingleAnswer",
        MultipleAnswers: "MultipleAnswers",
    }

    const addQuestion = (type) => {
        switch (type) {
            case QuestionType.SingleAnswer:
                setQuestionsData([...questionsData, {
                    key: questionsData.length,
                    type: QuestionType.SingleAnswer,
                    time: 30,
                    pts: 5,
                    image: null,
                    title: "",
                    answers: ["A", "B", "C", "D"],
                }])
                break
            
            case QuestionType.MultipleAnswers:
                break
        }
    }

    const constructElementFromData = (data) => {
        switch (data.type) {
            case QuestionType.SingleAnswer:
                return (
                    <SingleAnswerCard data={data} />
                )
            
            case QuestionType.MultipleAnswers:
                return (
                    <div>
                        Несколько ответов
                    </div>
                )
        }
    }

    const onFinishTestConstruction = async () => {
        // save test data on server
        const response = await fetch(
            `${apiUrl}/test/create`,
            {
                method: "POST",
                body: JSON.stringify({
                    type: "test",
                    q: questionsData
                })
            }
        )

        if (!response.ok) {
            setSaveError(true)
        } else {
            // TODO
        }
    }

    const questionsElements = questionsData.map((data) => constructElementFromData(data))
    return (
        <div className="tc-frame">
            <div className="tc-q-vars">
                <span onClick={() => addQuestion(QuestionType.SingleAnswer)}>Один ответ</span>
                <span onClick={() => addQuestion(QuestionType.MultipleAnswers)}>Несколько ответов</span>
            </div>
            <div className="tc-q-cont">
                { questionsElements.length !== 0 ? (
                    <>
                        { questionsElements }
                        <button onClick={onFinishTestConstruction}>ok</button>
                    </>
                ) : (
                    <>Добавьте вопросы в квиз</>
                ) }
            </div>
        </div>
    )
}

export default TestConstructor