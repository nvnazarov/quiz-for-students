import { useState, useEffect } from "react";
import SubmitButton from "../../ui/SubmitButton";
import { Link } from "react-router-dom";


const GamesAdminFragment = ({ currentGame, results, members, quizzes, onCreateGame }) => {
    const [ quizId, setQuizId ] = useState(null);

    useEffect(() => {

        if (quizzes !== undefined && quizzes.length != 0) {
            setQuizId(quizzes[0].id);
        }

    }, [quizzes]);
    
    let resultsElement = "Нет прошедших игр";
    if (results === undefined || quizzes === undefined || members === undefined) {
        resultsElement = "Не удалось загрузить результаты";
    } else {
        if (results.length !== 0) {
            const rows = members.map((m, i) => {
                const scores = results.map((r) => {
                    const pts = r.scores[m.id];
                    return pts ? pts : 0;
                });
                const points = scores.map((p, i2) => <td key={ i2 }>{ p }</td>);
                return (
                    <tr key={ i }>
                        <td>
                            { m.name } ({ m.email })
                        </td>
                        { points }
                    </tr>
                );
            });
            const games = results.map((r, i) => {
                const date = new Date(r.date);
                return (
                    <th key={ i }>{ date.toDateString() }</th>
                );
            });
            resultsElement = (
                <table className="VerticalMargin">
                    <tbody>
                        <tr>
                            <th>Участник</th>
                            { games }
                        </tr>
                        { rows }
                    </tbody>
                </table>
            );
        }
    }

    const quizMapper = (quiz) => {
        return (
            <option key={quiz.id} value={quiz.id}>
                {quiz.name}
            </option>
        );
    };

    const quizOptions = quizzes === undefined ? <>Не удалось загрузить квизы</> :
                        quizzes.length === 0 ? <>У вас не квизов, чтобы начать игру</> :
                        quizzes.map(quizMapper);

    const onSubmit = (e) => {
        e.preventDefault();
        onCreateGame(quizId);
    };
    
    return (
        <div className="Page">
            <h1>Текущая игра</h1>
            <div className="VerticalMargin">
                {
                    currentGame ?
                    <Link to={ `/games/test/admin/${currentGame.game_id}` } className="Card">
                        { currentGame.quiz_name }
                    </Link>
                    :
                    <div className="Vertical GapMid">
                        Начните новую игру:
                        <form className="Horizontal GapSmall" onSubmit={ onSubmit }>
                            <select onChange={ (e) => setQuizId(e.target.value) }>
                                { quizOptions }
                            </select>
                            <SubmitButton title="Начать игру" />
                        </form>
                    </div>
                }
            </div>

            <h1>Прошедшие игры</h1>
            {
                resultsElement
            }
        </div>
    );
};


export default GamesAdminFragment;