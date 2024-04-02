import { UserContext } from "../../../contexts/UserContext";
import { useState, useRef, useContext, useEffect } from "react";
import SingleAnswerCard from "../../test/SingleAnswerCard";
import MultipleAnswersCard from "../../test/MultipleAnswersCard";
import TextField from "../../ui/TextField";
import SubmitButton from "../../ui/SubmitButton";
import { createTest, getQuizData, updateTest } from "../../../api/quiz";
import { useSearchParams } from "react-router-dom";
import Notification from "../../ui/Notification";


const TestConstructorFragment = () => {
    const questionKeyRef = useRef(0);
    const [token,] = useContext(UserContext);
    const [name, setName] = useState("");
    const [questionsData, setQuestionsData] = useState([]);
    const [ message, setMessage ] = useState(
        {
            ok: false,
            hint: null,
        }
    );
    const [searchParams, setSearchParams] = useSearchParams();
    const quizId = searchParams.get("id");

    useEffect(() => {
        if (!quizId) {
            return;
        }

        const loadQuestionsData = async () => {
            const data = {
                authToken: token,
                id: +quizId,
            }
            const response = await getQuizData(data);
            
            if (response === undefined || !response.ok) {
                // TODO
                return;
            }
    
            const questions = await response.json();
            setQuestionsData(questions.q);
            questionKeyRef.current = questions.q.length;
        };

        loadQuestionsData();

    }, [quizId]);

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
                    title: "",
                    answers: ["A", "B", "C", "D"],
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
                    title: "",
                    answers: ["A", "B", "C", "D"],
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
            return (
                <div key={data.key}>
                    <SingleAnswerCard id={data.key} data={data.data} setData={setData} onDelete={deleteByKey} />
                </div>
            );
        }

        if (data.type === QuestionType.MultipleAnswers) {
            return (
                <div key={data.key}>
                    <MultipleAnswersCard id={data.key} data={data.data} setData={setData} onDelete={deleteByKey} />
                </div>
            );
        }
    }

    const onFinish = async (e) => {
        e.preventDefault();

        setMessage({ ok: false, hint: null });

        if (quizId) {
            const data = {
                authToken: token,
                id: quizId,
                data: {
                    q: questionsData,
                },
            };
            const response = await updateTest(data);

            if (response === undefined || !response.ok) {
                setMessage({ ok: false, hint: "Не удалось сохранить изменения" });
                return;
            }
            setMessage({ ok: true, hint: "Изменения сохранены" });
        } else {
            const data = {
                authToken: token,
                name: name,
                data: {
                    q: questionsData,
                },
            };
            const response = await createTest(data);

            if (response === undefined) {
                setMessage({ ok: false, hint: "Не удалось сохранить квиз" });
                return;
            }
            
            if (!response.ok) {
                setMessage({ ok: false, hint: "Не удалось сохранить квиз. Квиз с таким названием уже существует." });
            } else {
                const quiz = await response.json();
                setMessage({ ok: true, hint: "Успешно." });
                setSearchParams({ id: quiz.id });
            }
        }
    }

    const questionsCards = questionsData.map((data) => constructElementFromData(data));

    return (
        <div className="Page">
            {
                message.hint && <Notification message={ message.hint } isError={ !message.ok } /> 
            }

            <h1>{ quizId ? "Редактирование" : "Создание" }</h1>

            <form className="Vertical GapSmall VerticalMargin" onSubmit={ onFinish }>
                {
                    quizId ?
                    <div className="Horizontal">
                        <SubmitButton title="Сохранить изменения" />
                    </div>
                    :
                    <div className="Horizontal GapSmall">
                        <TextField text={ name } setText={ setName } placeholder="Назовите квиз" />
                        <SubmitButton title="Сохранить" />
                    </div>
                }
            </form>

            <h1>Измените квиз</h1>

            <div className="Horizontal GapSmall VerticalMargin">
                <button onClick={ () => addQuestion(QuestionType.SingleAnswer) }>+ Один ответ</button>
                <button onClick={ () => addQuestion(QuestionType.MultipleAnswers) }>+ Несколько ответов</button>
            </div>

            <div className="Vertical GapSmall VerticalMargin Scrollable">
            {
                questionsCards
            }
            </div>
        </div>
    );
};


export default TestConstructorFragment;