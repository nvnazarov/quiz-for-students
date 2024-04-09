import { Link } from "react-router-dom";


const GamesFragment = ({ currentGame, results, members, quizzes }) => {
    let resultsElement = "Нет прошедших игр";
    if (results === undefined || members === undefined) {
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
            {
                resultsElement
            }
        </div>
    );
};


export default GamesFragment;