import { useState, useRef } from 'react';
import { apiUrl } from '../config';
import { Link } from 'react-router-dom';
import SingleAnswerCard from '../components/test/SingleAnswerCard';
import MultipleAnswersCard from '../components/test/MultipleAnswersCard';


const TestConstructorPage = () => {
    const questionKeyRef = useRef(0);
    const [questionsData, setQuestionsData] = useState([]);
    const [saveError, setSaveError] = useState(false);

    const QuestionType = {
        SingleAnswer: 'SingleAnswer',
        MultipleAnswers: 'MultipleAnswers',
    };

    const addQuestion = (type) => {
        questionKeyRef.current++;

        if (type === QuestionType.SingleAnswer) {
            const question = {
                key: questionKeyRef.current,
                type: QuestionType.SingleAnswer,
                data: {
                    time: 30,
                    points: 5,
                    title: '',
                    answers: ['A', 'B', 'C', 'D'],
                    correct: 0,
                    image: null,
                }
            };

            setQuestionsData([...questionsData, question]);
            return;
        }

        if (type === QuestionType.MultipleAnswers) {
            const question = {
                key: questionKeyRef.current,
                type: QuestionType.MultipleAnswers,
                data: {
                    time: 30,
                    points: 5,
                    title: '',
                    answers: ['A', 'B', 'C', 'D'],
                    correct: [0],
                    image: null,
                }
            };

            setQuestionsData([...questionsData, question]);
            return;
        }
    }

    const constructElementFromData = (data) => {
        const setData = (key, newData) => {
            const newQuestionsData = questionsData.map(
                (d) => {
                    if (d.key == key) {
                        return {...d, data: newData};
                    } else {
                        return d;
                    }
                }
            );
            setQuestionsData(newQuestionsData);
        };

        const deleteByKey = (key) => {
            setQuestionsData(questionsData.filter(q => q.key != key));
        };

        if (data.type === QuestionType.SingleAnswer) {
            return <li key={data.key}><SingleAnswerCard id={data.key} data={data.data} setData={setData} onDelete={deleteByKey} /></li>;
        }

        if (data.type === QuestionType.MultipleAnswers) {
            return <li key={data.key}><MultipleAnswersCard id={data.key} data={data.data} setData={setData} onDelete={deleteByKey} /></li>;
        }
    }

    const onFinish = async () => {
        setSaveError(false);

        const fetchRequest = {
            method: 'POST',
            body: JSON.stringify(questionsData)
        }; 

        console.log(questionsData);

        const response = await fetch(`${apiUrl}/test/create`, fetchRequest).catch(() => {});

        if (response === undefined || !response.ok) {
            setSaveError(true);
            return;
        }

        // TODO: redirect to /profile
        console.log('ok');
    }

    const questionsCards = questionsData.map((data) => constructElementFromData(data));

    return (
        <>
            <Link to='/profile'>Назад</Link>

            <hr/>

            <ul>
                <li><button onClick={() => addQuestion(QuestionType.SingleAnswer)}>Один ответ</button></li>
                <li><button onClick={() => addQuestion(QuestionType.MultipleAnswers)}>Несколько ответов</button></li>
            </ul>

            <hr/>

            {
                questionsCards.length === 0 ? <>Добавьте вопрос</> :
                questionsCards
            }

            <hr/>

            {
                saveError && <>Не удалось сохранить квиз</>
            }

            <button onClick={onFinish}>Сохранить</button>
        </>
    );
}


export default TestConstructorPage;