import { useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { UserContext } from "../../../contexts/UserContext"
import { useCurrentGame, useMembers, useResults } from "../../../hooks/hooks";
import Loader from "../../Loader";
import "../../../styles/common.css";


const GamesFragment = () => {
    const { groupId } = useParams();
    const [authToken] = useContext(UserContext);
    const [currentGame] = useCurrentGame(authToken, groupId);
    const [members] = useMembers(authToken, groupId);
    const [results] = useResults(authToken, groupId);

    if (currentGame === undefined || members === undefined || results === undefined) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Текущая игра</h1>
                <p>Не удалось загрузить.</p>
            </div>
        );
    }

    if (members === null || results === null) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Текущая игра</h1>
                <div className="mg-v-md">
                    <Loader />
                </div>
            </div>
        );
    }

    let resultsElement = <p className="mg-t-md">Нет прошедших игр</p>;
    if (results === undefined || members === undefined) {
        resultsElement = <p className="mg-t-md">Не удалось загрузить результаты</p>;
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
                <table className="mg-t-md">
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
        <div className="h-full bg-white p-lg">
            <h1>Текущая игра</h1>
            <div className="mg-v-md">
                {
                    currentGame ?
                    <Link to={ `/games/test/${currentGame.game_id}` } className="db mg-v-md r-md bg-gray p-md w-md bounce">
                        { currentGame.quiz_name }
                    </Link>
                    :
                    <p>В данный момент игра не проводится.</p>
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