import { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { createTest, updateTest, getQuizData } from "../api/quiz";
import { UserContext } from "../contexts/UserContext";
import SubmitButton from "./SubmitButton";
import "../styles/TestConstructor.css";
import "../styles/common.css";

const QuestionType = {
    SingleAnswer: "sa",
    MultipleAnswer: "ma",
};

const defaultSingleAnswerQuestion = {
    type: QuestionType.SingleAnswer,
    data: {
        time: 30,
        points: 5,
        image: null,
        title: "",
        answers: ["A", "B", "C", "D"],
        correct: 0,
    }
};

const defaultMultipleAnswerQuestion = {
    type: QuestionType.MultipleAnswer,
    data: {
        time: 30,
        points: 5,
        image: null,
        title: "",
        answers: ["A", "B", "C", "D"],
        correct: [0],
    }
};


const SingleAnswer = ({ data, setData, onDelete }) => {
    const [expanded, setExpanded] = useState(false);

    const updateTime = (e) => setData({ ...data, time: +e.target.value });
    const updatePoints = (e) => setData({ ...data, points: +e.target.value });
    const updateTitle = (e) => setData({ ...data, title: e.target.value });

    if (expanded) {
        const onAddAnswer = () => {
            setData({ ...data, answers: [...data.answers, ""] });
        };

        const answersElements = data.answers.map(
            (answer, index) => {
                const onChange = (e) => {
                    const newAnswers = data.answers.map((a, i) => i === index ? e.target.value : a);
                    setData({ ...data, answers: newAnswers });
                };

                const onDeleteAnswer = () => {
                    if (data.answers.length === 1) {
                        return;
                    }

                    const newAnswers = data.answers.filter((_, i) => i !== index);
                    setData({ ...data, answers: newAnswers, correct: Math.min(data.correct, newAnswers.length - 1) });
                };

                const onSelect = () => {
                    setData({ ...data, correct: index });
                };

                return (
                    <div key={ index } className="tc-answer-container">
                        {
                            index === data.correct ?
                            <input placeholder="Укажите ответ" className="tc-input-selected" value={ answer } onChange={ onChange } /> :
                            <input placeholder="Укажите ответ" value={ answer } onChange={ onChange } />
                        }
                        {
                            index === data.correct ?
                            <img className="tc-icon-selected" src="/ok.png" /> :
                            <img onClick={ onSelect } className="tc-icon-not-selected" src="/ok.png" />
                        }
                        <img onClick={ onDeleteAnswer } className="tc-icon" src="/trash.png" />
                    </div>
                );
            }
        );

        return (
            <div className="tc-q-container">
                <div className="gap-small vert">
                    <div className="tc-params-container">
                        Время (сек):
                        <input type="number" value={ data.time } onChange={ updateTime } />
                        Очки:
                        <input type="number" value={ data.points } onChange={ updatePoints } />
                    </div>
                    <textarea className="tc-title-input" placeholder="Введите вопрос" value={ data.title } onChange={ updateTitle } />
                    <div className="tc-hint-text">Укажите варианты ответов</div>
                    <div className="tc-answers-container">
                        { answersElements }
                        <button className="tc-add-answer-btn" onClick={ onAddAnswer }>+ Вариант ответа</button>
                    </div>
                </div>
                <div className="tc-footer">
                    <button className="tc-button" onClick={ () => setExpanded(false) }>Ок</button>
                    <button className="tc-button" onClick={ onDelete }>Удалить</button>
                </div>
            </div>
        );
    }

    return (
        <div className="tc-q-container">
            <div className="tc-header">
                <div className="tc-header-title">{ data.title === "" ? "[Вопрос не указан]" : data.title }</div>
                <div className="tc-type">| один ответ</div>
            </div>
            <div className="tc-footer">
                <div className="tc-tags-container">
                    <div className="tc-tag">{ data.points } очков</div>
                    <div className="tc-tag">{ data.time } секунд</div>
                </div>
                <div className="tc-buttons-container">
                    <button className="tc-button" onClick={ () => setExpanded(true) }>Настроить</button>
                    <button className="tc-button" onClick={ onDelete }>Удалить</button>
                </div>
            </div>
        </div>
    );
};


const MultipleAnswer = ({ data, setData, onDelete }) => {
    const [expanded, setExpanded] = useState(false);

    const updateTime = (e) => setData({ ...data, time: +e.target.value });
    const updatePoints = (e) => setData({ ...data, points: +e.target.value });
    const updateTitle = (e) => setData({ ...data, title: e.target.value });

    if (expanded) {
        const onAddAnswer = () => {
            setData({ ...data, answers: [...data.answers, ""] });
        };

        const answersElements = data.answers.map(
            (answer, index) => {
                const onChange = (e) => {
                    const newAnswers = data.answers.map((a, i) => i === index ? e.target.value : a);
                    setData({ ...data, answers: newAnswers });
                };

                const onDeleteAnswer = () => {
                    if (data.answers.length === 1) {
                        return;
                    }

                    let newCorrect = data.correct;
                    if (data.correct.includes(index)) {
                        newCorrect = data.correct.filter((i) => i !== index);
                    }

                    const newAnswers = data.answers.filter((_, i) => i !== index);
                    setData({ ...data, answers: newAnswers, correct: newCorrect });
                };

                const onSelect = () => {
                    setData({ ...data, correct: [...data.correct, index] });
                };

                const onDeselect = () => {
                    const newCorrect = data.correct.filter((i) => i !== index);
                    setData({ ...data, correct: newCorrect });
                };

                return (
                    <div key={ index } className="tc-answer-container">
                        {
                            data.correct.includes(index) ?
                            <input placeholder="Укажите ответ" className="tc-input-selected" value={ answer } onChange={ onChange } /> :
                            <input placeholder="Укажите ответ" value={ answer } onChange={ onChange } />
                        }
                        {
                            data.correct.includes(index) ?
                            <img onClick={ onDeselect } className="tc-icon-selected" src="/ok.png" /> :
                            <img onClick={ onSelect } className="tc-icon-not-selected" src="/ok.png" />
                        }
                        <img onClick={ onDeleteAnswer } className="tc-icon" src="/trash.png" />
                    </div>
                );
            }
        );

        return (
            <div className="tc-q-container">
                <div className="gap-small vert">
                    <div className="tc-params-container">
                        Время (сек):
                        <input type="number" value={ data.time } onChange={ updateTime } />
                        Очки:
                        <input type="number" value={ data.points } onChange={ updatePoints } />
                    </div>
                    <textarea className="tc-title-input" placeholder="Введите вопрос" value={ data.title } onChange={ updateTitle } />
                    <div className="tc-hint-text">Укажите варианты ответов</div>
                    <div className="tc-answers-container">
                        { answersElements }
                        <button className="tc-add-answer-btn" onClick={ onAddAnswer }>+ Вариант ответа</button>
                    </div>
                </div>
                <div className="tc-footer">
                    <button className="tc-button" onClick={ () => setExpanded(false) }>Ок</button>
                    <button className="tc-button" onClick={ onDelete }>Удалить</button>
                </div>
            </div>
        );
    }

    return (
        <div className="tc-q-container">
            <div className="tc-header">
                <div className="tc-header-title">{ data.title === "" ? "[Вопрос не указан]" : data.title }</div>
                <div className="tc-type">| несколько ответов</div>
            </div>
            <div className="tc-footer">
                <div className="tc-tags-container">
                    <div className="tc-tag">{ data.points } очков</div>
                    <div className="tc-tag">{ data.time } секунд</div>
                </div>
                <div className="tc-buttons-container">
                    <button className="tc-button" onClick={ () => setExpanded(true) }>Настроить</button>
                    <button className="tc-button" onClick={ onDelete }>Удалить</button>
                </div>
            </div>
        </div>
    );
};


const TestConstructor = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [authToken,] = useContext(UserContext);
    const [testName, setTestName] = useState("");
    const [questions, setQuestions] = useState([]);

    const testId = +searchParams.get("id"); 
    useEffect(() => {
        if (!testId) {
            return;
        }

        const loadQuestions = async () => {
            const params = {
                authToken,
                id: testId,
            }
            const response = await getQuizData(params);
            
            if (response === undefined || !response.ok) {
                console.log(response);
            } else {
                const data = await response.json();
                setQuestions(data.q);
            }
        };

        loadQuestions();
    }, [testId]);

    const updateTestName = (e) => setTestName(e.target.value);
    const addSingleAnswerQuestion = () => setQuestions([...questions, defaultSingleAnswerQuestion]);
    const addMultipleAnswerQuestion = () => setQuestions([...questions, defaultMultipleAnswerQuestion]);

    const onCreateTest = async () => {
        const createParams = {
            authToken,
            name: testName,
            data: {
                q: questions,
            },
        };
        const response = await createTest(createParams);

        if (response === undefined || !response.ok) {
            console.log(response);
        } else {
            const createdTest = await response.json();
            setSearchParams({ id: createdTest.id });
        }
    };

    const onUpdateTest = async () => {
        const updateParams = {
            authToken,
            id: testId,
            data: {
                q: questions,
            }
        };
        const response = await updateTest(updateParams);

        if (response === undefined || !response.ok) {
            console.log(response);
        } else {
            // Todo
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        
        if (testId) {
            onUpdateTest();
        } else {
            onCreateTest();
        }
    };

    const questionsElements = questions.map(
        (question, index) => {
            const setData = (newData) => {
                setQuestions(
                    questions.map(
                        (oldQuestion, i) => {
                            return i === index ? { ...oldQuestion, data: newData } : oldQuestion;
                        }
                    )
                );
            };

            const onDelete = () => {
                setQuestions(questions.filter((_, i) => i !== index));
            };

            if (question.type === QuestionType.SingleAnswer) {
                return <SingleAnswer key={ index } data={ question.data } setData={ setData } onDelete={ onDelete } />;
            }

            if (question.type === QuestionType.MultipleAnswer) {
                return <MultipleAnswer key={ index } data={ question.data } setData={ setData } onDelete={ onDelete } />;
            }
        }
    ); 

    return (
        <div className="tc-page">
            <h1>Конструктор</h1>
            <div className="tc-types-container">
                <button type="button" onClick={ addSingleAnswerQuestion }>+ один ответ</button>
                <button type="button" onClick={ addMultipleAnswerQuestion }>+ несколько ответов</button>
            </div>
            <form onSubmit={ onSubmit }>
                <input placeholder="Название квиза" value={ testName } onChange={ updateTestName } />
                <button type="submit">Сохранить</button>
            </form>
            <div className="tc-container">{ questionsElements }</div>
        </div>
    );
};


export default TestConstructor;