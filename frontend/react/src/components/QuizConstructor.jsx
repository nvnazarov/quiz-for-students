import { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { createQuiz, updateQuiz, getQuizData } from "../api/quiz";
import { UserContext } from "../contexts/UserContext";
import { NotificationContext, NotificationType } from "../contexts/NotificationContext";
import TextField from "./TextField";
import Button from "./Button";
import "../styles/TestConstructor.css";
import "../styles/common.css";


const QuestionType = {
    Text: "t",
};

const defaultQuestion = {
    type: QuestionType.Text,
    data: {
        text: "",
        time: 30,
        points: 5,
    },
};


const defaultQuiz = {
    w: 3,
    h: 3,
    themes: ["", "", ""],
    q: Array(9).fill(defaultQuestion),
};


const TextQuestion = ({ data, setData }) => {
    const updateTime = (e) => setData({ ...data, time: +e.target.value });
    const updatePoints = (e) => setData({ ...data, points: +e.target.value });
    const updateText = (e) => setData({ ...data, text: e.target.value });

    return (
        <div className="w-lg bg-white sh p-md r-md v gap-md">
            <div className="tc-params-container">
                <p>Время (сек):</p>
                <input type="number" className="bg-gray r-sm p-sm" value={ data.time } onChange={ updateTime } />
                <p>Очки:</p>
                <input type="number" className="bg-gray r-sm p-sm" value={ data.points } onChange={ updatePoints } />
            </div>
            <textarea className="tc-title-input" placeholder="Введите вопрос" value={ data.text } onChange={ updateText } />
        </div>
    );
};


const QuizConstructor = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const notificationService = useContext(NotificationContext);
    const [authToken] = useContext(UserContext);
    const [quizName, setQuizName] = useState("");
    const [quiz, setQuiz] = useState(defaultQuiz);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0);

    const param = searchParams.get("id");
    const quizId = param ? +param : undefined;
    useEffect(() => {
        if (!quizId) {
            return;
        }

        const loadQuiz = async () => {
            const params = {
                authToken,
                id: quizId,
            }
            const response = await getQuizData(params);
            
            if (response === undefined || !response.ok) {
                notificationService.addNotification("Не удалось загрузить данные викторины.");
            } else {
                const json = await response.json();
                setQuiz(json);
            }
        };

        loadQuiz();
    }, [quizId]);

    const onCreateQuiz = async () => {
        const createParams = {
            authToken,
            name: quizName,
            data: quiz,
        };
        setLoading(true);
        const response = await createQuiz(createParams);
        setLoading(false);

        if (response === undefined || !response.ok) {
            notificationService.addNotification("Не удалось создать викторину.");
        } else {
            const createdQuiz = await response.json();
            setSearchParams({ id: createdQuiz.id });
            notificationService.addNotification("Успешно.", NotificationType.Success);
        }
    };

    const onUpdateQuiz = async () => {
        const updateParams = {
            authToken,
            id: quizId,
            data: quiz,
        };
        setLoading(true);
        const response = await updateQuiz(updateParams);
        setLoading(false);

        if (response === undefined || !response.ok) {
            notificationService.addNotification("Не удалось обновить викторину.");
        } else {
            notificationService.addNotification("Успешно.", NotificationType.Success);
        }
    };

    const onAddTheme = () => {
        const newThemes = [...quiz.themes, ""];
        const newQuestions = [...quiz.q, ...Array(quiz.w).fill(defaultQuestion)];
        setQuiz({ ...quiz, h: quiz.h + 1, themes: newThemes, q: newQuestions });
    };

    const onAddQuestions = () => {
        let newQuestions = [];
        for (let i = 0; i < quiz.h; ++i) {
            newQuestions.push(...quiz.q.slice(i * quiz.w, (i + 1) * quiz.w), defaultQuestion);
        }
        setSelected(selected + Math.floor(selected / quiz.w));
        setQuiz({ ...quiz, w: quiz.w + 1, q: newQuestions });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }
        
        if (quizId) {
            onUpdateQuiz();
        } else {
            onCreateQuiz();
        }
    };

    const cells = quiz.q.map(
        (q, index) => {
            if (q.type === QuestionType.Text) {
                if (index === selected) {
                    return (
                        <td key={ index } className="p-md qz-cell blue">
                            { q.data.points }
                        </td>
                    );
                } else {
                    return (
                        <td key={ index } className="p-md qz-cell" onClick={ () => setSelected(index) }>
                            { q.data.points }
                        </td>
                    );
                }
            }
        }
    );
    const tableRows = quiz.themes.map(
        (theme, index) => {
            const updateTheme = (e) => {
                const newThemes = quiz.themes.map(
                    (t, i) => {
                        return i === index ? e.target.value : t;
                    }
                );
                setQuiz({ ...quiz, themes: newThemes });
            };

            const onDeleteTheme = () => {
                if (quiz.h === 1) {
                    return;
                }

                const remains = (i) => i < index * quiz.w || i >= (index + 1) * quiz.w;
                const newThemes = quiz.themes.filter((_, i) => i !== index);
                const newQuestions = quiz.q.filter((_, i) => remains(i));
                if (selected >= (index + 1) * quiz.w) {
                    setSelected(selected - quiz.w);
                } else if (selected >= index * quiz.w) {
                    if (index === quiz.h - 1) {
                        setSelected(selected - quiz.w);
                    }
                }
                setQuiz({ ...quiz, h: quiz.h - 1, themes: newThemes, q: newQuestions });
            };

            return (
                <tr key={ index }>
                    <td>
                        <div className="h ai-center gap-sm">
                            <img onClick={ onDeleteTheme } className="tc-icon" src="/trash.png" />
                            <input placeholder="Введите тему" className="bg-transparent" value={ theme } onChange={ updateTheme } />
                        </div>
                    </td>
                    { cells.slice(index * quiz.w, index * quiz.w + quiz.w) }
                </tr>
            );
        }
    );

    const deleteColumns = Array(quiz.w).fill(0).map(
        (_, index) => {
            const onDeleteColumn = () => {
                if (quiz.w === 1) {
                    return;
                }

                const newQuestions = quiz.q.filter((_, i) => i % quiz.w !== index);
                if (selected % quiz.w === index) {
                    setSelected(0);
                } else {
                    const r = selected % quiz.w;
                    setSelected(selected - Math.floor(selected / quiz.w) - (r > index ? 1 : 0));
                }
                setQuiz({ ...quiz, w: quiz.w - 1, q: newQuestions });
            };
            return (
                <td className="ta-center" key={ index }>
                    <img onClick={ onDeleteColumn } className="tc-icon" src="/trash.png" />
                </td>
            );
        }
    );

    const selectedData = quiz.q[selected].data;
    const setSelectedData = (newData) => {
        const newQuestions = quiz.q.map(
            (data, index) => {
                if (index === selected) {
                    return { ...data, data: newData };
                } else {
                    return data;
                }
            }
        );
        setQuiz({ ...quiz, q: newQuestions });
    };

    return (
        <div className="h-full bg-white p-lg">
            <h1>Конструктор { quizId !== undefined && "- редактирование" }</h1>
            <form className="h mg-v-md gap-md" onSubmit={ onSubmit }>
                { quizId === undefined && <TextField placeholder="Название викторины" text={ quizName } setText={ setQuizName } /> }
                <Button loading={ loading }>{ quizId !== undefined ? "Сохранить изменения" : "Сохранить" }</Button>
            </form>
            <div>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td className="bg-transparent"></td>
                                { deleteColumns }
                                <td onClick={ onAddQuestions} className="ta-center qz-cell">+ вопросы</td>
                            </tr>
                            { tableRows }
                            <tr>
                                <td onClick={ onAddTheme } className="ta-center qz-cell">
                                    + тема
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mg-t-md">
                <TextQuestion data={ selectedData } setData={ setSelectedData } />
            </div>
        </div>
    );
};


export default QuizConstructor;