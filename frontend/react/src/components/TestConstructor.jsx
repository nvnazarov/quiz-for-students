import { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { createTest, updateTest, getQuizData } from "../api/quiz";
import { UserContext } from "../contexts/UserContext";
import { NotificationContext, NotificationType } from "../contexts/NotificationContext";
import TextField from "./TextField";
import Button from "./Button";
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
                    <div key={ index } className="h gap-sm ai-center">
                        {
                            index === data.correct ?
                            <input placeholder="Укажите ответ" className="tc-input-selected p-sm r-sm" value={ answer } onChange={ onChange } /> :
                            <input placeholder="Укажите ответ" className="tc-input p-sm r-sm" value={ answer } onChange={ onChange } />
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
            <div className="r-md p-md sh bg-white w-lg">
                <div className="v gap-lg">
                    <div className="tc-params-container">
                        <p>Время (сек):</p>
                        <input type="number" className="bg-gray r-sm p-sm" value={ data.time } onChange={ updateTime } />
                        <p>Очки:</p>
                        <input type="number" className="bg-gray r-sm p-sm" value={ data.points } onChange={ updatePoints } />
                    </div>
                    <textarea className="tc-title-input" placeholder="Введите вопрос" value={ data.title } onChange={ updateTitle } />
                    <div className="tc-answers-container">
                        { answersElements }
                        <button className="tc-add-answer-btn" onClick={ onAddAnswer }>+ Вариант ответа</button>
                    </div>
                </div>
                <div className="h end gap-sm mg-t-md">
                    <button className="btn-sm" onClick={ () => setExpanded(false) }>Ок</button>
                    <button className="btn-sm" onClick={ onDelete }>Удалить</button>
                </div>
            </div>
        );
    }

    return (
        <div className="r-md p-md sh bg-white w-lg">
            <div className="h gap-sm">
                <div className="overflow-hidden overflow-ellipsis white-space-nowrap">
                    { data.title === "" ? "[Вопрос не указан]" : data.title }
                </div>
                <div className="min-w-fit-content">| один ответ</div>
            </div>
            <div className="h space-between mg-t-md">
                <div className="h gap-sm">
                    <div className="blue p-sm r-sm">{ data.points } очков</div>
                    <div className="blue p-sm r-sm">{ data.time } секунд</div>
                </div>
                <div className="h gap-sm">
                    <button className="btn-sm" onClick={ () => setExpanded(true) }>Настроить</button>
                    <button className="btn-sm" onClick={ onDelete }>Удалить</button>
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
                    <div key={ index } className="h gap-sm ai-center">
                        {
                            data.correct.includes(index) ?
                            <input placeholder="Укажите ответ" className="tc-input-selected p-sm r-sm" value={ answer } onChange={ onChange } /> :
                            <input placeholder="Укажите ответ" className="tc-input p-sm r-sm" value={ answer } onChange={ onChange } />
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
            <div className="r-md p-md sh bg-white w-lg">
                <div className="v gap-lg">
                    <div className="tc-params-container">
                        <p>Время (сек):</p>
                        <input type="number" className="bg-gray r-sm p-sm" value={ data.time } onChange={ updateTime } />
                        <p>Очки:</p>
                        <input type="number" className="bg-gray r-sm p-sm" value={ data.points } onChange={ updatePoints } />
                    </div>
                    <textarea className="tc-title-input" placeholder="Введите вопрос" value={ data.title } onChange={ updateTitle } />
                    <div className="tc-answers-container">
                        { answersElements }
                        <button className="tc-add-answer-btn" onClick={ onAddAnswer }>+ Вариант ответа</button>
                    </div>
                </div>
                <div className="h end gap-sm mg-t-md">
                    <button className="btn-sm" onClick={ () => setExpanded(false) }>Ок</button>
                    <button className="btn-sm" onClick={ onDelete }>Удалить</button>
                </div>
            </div>
        );
    }

    return (
        <div className="r-md p-md sh bg-white w-lg">
            <div className="h gap-sm">
                <div className="overflow-hidden overflow-ellipsis white-space-nowrap">
                    { data.title === "" ? "[Вопрос не указан]" : data.title }
                </div>
                <div className="min-w-fit-content">| несколько ответов</div>
            </div>
            <div className="h space-between mg-t-md">
                <div className="h gap-sm">
                    <div className="blue p-sm r-sm">{ data.points } очков</div>
                    <div className="blue p-sm r-sm">{ data.time } секунд</div>
                </div>
                <div className="h gap-sm">
                    <button className="btn-sm" onClick={ () => setExpanded(true) }>Настроить</button>
                    <button className="btn-sm" onClick={ onDelete }>Удалить</button>
                </div>
            </div>
        </div>
    );
};


const TestConstructor = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const notificationService = useContext(NotificationContext);
    const [authToken] = useContext(UserContext);
    const [testName, setTestName] = useState("");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const param = searchParams.get("id");
    const testId = param ? +param : undefined;
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
                notificationService.addNotification("Не удалось загрузить данные квиза.");
            } else {
                const data = await response.json();
                setQuestions(data.q);
            }
        };

        loadQuestions();
    }, [testId]);

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
        setLoading(true);
        const response = await createTest(createParams);
        setLoading(false);

        if (response === undefined || !response.ok) {
            notificationService.addNotification("Не удалось создать квиз.");
        } else {
            const createdTest = await response.json();
            setSearchParams({ id: createdTest.id });
            notificationService.addNotification("Успешно.", NotificationType.Success);
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
        setLoading(true);
        const response = await updateTest(updateParams);
        setLoading(false);

        if (response === undefined || !response.ok) {
            notificationService.addNotification("Не удалось обновить квиз.");
        } else {
            notificationService.addNotification("Успешно.", NotificationType.Success);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }
        
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
        <div className="h-full bg-white p-lg">
            <h1>Конструктор { testId !== undefined && "- редактирование" }</h1>
            <form className="h mg-v-md gap-md" onSubmit={ onSubmit }>
                { testId === undefined && <TextField placeholder="Название квиза" text={ testName } setText={ setTestName } /> }
                <Button loading={ loading }>{ testId !== undefined ? "Сохранить изменения" : "Сохранить" }</Button>
            </form>
            <div className="h mg-v-md gap-md">
                <button type="button" className="btn-sm" onClick={ addSingleAnswerQuestion }>+ один ответ</button>
                <button type="button" className="btn-sm" onClick={ addMultipleAnswerQuestion }>+ несколько ответов</button>
            </div>
            <div className="v gap-md">{ questionsElements }</div>
        </div>
    );
};


export default TestConstructor;