import { useState } from 'react'

const TestConstructor = (onFinish) => {
    const [questionsData, setQuestionsData] = useState([])
    const [saveError, setSaveError] = useState(false)

    const constructElementFromData = (data) => {
        // TODO
    }

    const onFinishTestConstruction = async () => {
        // save test data on server
        const response = await fetch(
            'api/v1/test/',
            {
                method: 'POST',
                body: questionsData
            }
        )

        if (!response.ok) {
            setSaveError(true)
        } else {
            onFinish()
        }
    }

    const questionsElements = map(questionsData, (data) => constructElementFromData(data))
    return (
        <>
            {questionsElements}
            <button onClick={onFinishTestConstruction}>ok</button>
            {
                saveError &&
                <>
                    Unable to save test data
                </>
            }
        </>
    )
}

export default TestConstructor