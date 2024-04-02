import { useState } from "react";
import SubmitButton from "../../ui/SubmitButton";
import { Link } from "react-router-dom";


const GamesAdminFragment = ({ currentGame, results, quizzes, onCreateGame }) => {
    const [ quizId, setQuizId ] = useState(0);
    
    const resultMapper = (result) => {
        return (
            <div className="Card">
                { result.name } { result.date }
            </div>
        );
    };

    const resultsElements = results === undefined ? <>Не удалось загрузить результаты</> :
                            results.length === 0 ? <>Список результатов пуст</> :
                            results.map(resultMapper);

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
                            <select onChange={ (e) => setQuizId(e.target.value) } defaultValue={ 0 } >
                                { quizOptions }
                            </select>
                            <SubmitButton title="Начать игру" />
                        </form>
                    </div>
                }
            </div>

            <h1>Прошедшие игры</h1>
            <div className="Grid VerticalMargin">
            {
                resultsElements
            }
            </div>
        </div>
    );
};


export default GamesAdminFragment;