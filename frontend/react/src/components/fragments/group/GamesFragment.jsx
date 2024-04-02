import { Link } from "react-router-dom";


const GamesFragment = ({ currentGame, results }) => {
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
    
    return (
        <div className="Page">
            <h1>Текущая игра</h1>
            <div className="VerticalMargin">
                {
                    currentGame ?
                    <Link to={ `/games/test/${currentGame.game_id}` } className="Card">
                        { currentGame.quiz_name }
                    </Link>
                    :
                    <>В данный момент игра не проводится</>
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


export default GamesFragment;