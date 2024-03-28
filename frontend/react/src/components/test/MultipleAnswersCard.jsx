import {useState} from 'react';


const MultipleAnswerCard = ({id, data, setData, onDelete}) => {
    const [expanded, setExpanded] = useState(false);

    if (expanded) {
        const mapper = (a, index) => {
            if (data.correct.includes(index)) {
                return (
                    <li key={index}>
                        <input value={a} onChange={(e) => {
                            const newAnswers = data.answers.map((ans, i) => {
                                if (i === index) {
                                    return e.target.value;
                                } else {
                                    return ans;
                                }
                            });
                            setData(id, {...data, answers: newAnswers});
                        }} /> (correct)
                        <button onClick={() =>
                            {
                                const newCorrect = data.correct.filter((idx) => idx !== index);
                                setData(id, {...data, correct: newCorrect});
                            }
                        }>не этот</button>
                    </li>
                );
            }
            return (
                <li key={index}>
                    <input value={a} onChange={(e) => {
                        const newAnswers = data.answers.map((ans, i) => {
                            if (i === index) {
                                return e.target.value;
                            } else {
                                return ans;
                            }
                        });
                        setData(id, {...data, answers: newAnswers});
                    }} />
                    <button onClick={() =>
                        {
                            const newCorrect = [...data.correct, index];
                            setData(id, {...data, correct: newCorrect});
                        }
                    }>этот</button>
                </li>
            );
        }

        const answersElements = data.answers.map(mapper);

        return (
            <>
                Несколько вариантов ответа

                <br/>Время: <input type='number' value={data.time} onChange={(e) => setData(id, {...data, time: e.target.value})} />
                <br/>Очки: <input type='number' value={data.points} onChange={(e) => setData(id, {...data, points: e.target.value})} />
                <br/>Текст: <input type='text' value={data.text} onChange={(e) => setData(id, {...data, text: e.target.value})} />
                <br/>Изображение: <input type='image' onChange={(e) => setData(id, {...data, image: e.target.value})} />
                <br/>
                
                <ul>
                    {
                        answersElements
                    }
                </ul>

                <button onClick={() => onDelete(id)}>Удалить</button>

                <button onClick={() => setExpanded(false)}>Свернуть</button>
            </>
        );
    }

    return (
        <div className='QuestionContainer'>
            <span className='QuestionTitle'>Несколько ответов</span>
            <div className='QuestionParams'>
                <span className='Param'>{data.time} сек.</span>
                <span className='Param'>{data.points} очков</span>
            </div>
            <div className='QuestionActions'>
                <button onClick={() => onDelete(id)}>Удалить</button>
                <button onClick={() => setExpanded(true)}>Развернуть</button>
            </div>
        </div>
    );
}


export default MultipleAnswerCard;