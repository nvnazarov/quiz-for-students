import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { UserContext } from "../../../contexts/UserContext"
import { NotificationContext, NotificationType } from "../../../contexts/NotificationContext";
import { useQuizzes, useCurrentGame, useMembers, useResults } from "../../../hooks/hooks";
import { createGame } from "../../../api/game";
import Loader from "../../Loader";
import Button from "../../Button";
import "../../../styles/common.css"


const GamesAdminFragment = () => {
    const { groupId } = useParams();
    const [authToken] = useContext(UserContext);
    const notificationService = useContext(NotificationContext);
    const [currentGame, setCurrentGame] = useCurrentGame(authToken, groupId);
    const [quizzes, setQuizzes] = useQuizzes(authToken);
    const [members, setMembers] = useMembers(authToken, groupId);
    const [results, setResults] = useResults(authToken, groupId);
    const [quizId, setQuizId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (quizzes !== undefined && quizzes !== null && quizzes.length != 0) {
            setQuizId(quizzes[0].id);
        }

    }, [quizzes]);

    if (quizzes === undefined || members === undefined || results === undefined || currentGame === undefined) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Текущая игра</h1>
                <p>Не удалось загрузить.</p>
            </div>
        );
    }

    if (quizzes == null || members === null || results === null) {
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
    if (results === undefined || quizzes === undefined || members === undefined) {
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

    const quizMapper = (quiz) => {
        return (
            <option key={ quiz.id } value={ quiz.id }>
                { quiz.name }
            </option>
        );
    };
    const quizOptions = quizzes.map(quizMapper);

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (loading) {
            return;
        }

        if (!quizId) {
            notificationService.addNotification("Не удалось создать игру. Не выбран квиз.");
            return;
        }

        setLoading(true);
        const data = {
            authToken,
            groupId,
            quizId,
        };
        const response = await createGame(data);
        setLoading(false);

        if (response !== undefined && response.ok) {
            const gameId = await response.json();
            const quizName = quizzes.filter(q => q.id === quizId)[0].name;
            setCurrentGame({ game_id: gameId, quiz_name: quizName });
            notificationService.addNotification("Успешно.", NotificationType.Success);
        } else {
            notificationService.addNotification("Не удалось создать игру.");
        }
    };
    
    return (
        <div className="h-full bg-white p-lg">
            <h1>Текущая игра</h1>
            {
                currentGame ?
                <Link to={ `/games/test/admin/${currentGame.game_id}` } className="db mg-v-md r-md bg-gray p-md w-md bounce">
                    { currentGame.quiz_name }
                </Link>
                :
                <>
                    <p className="mg-v-md">Начните новую игру (выберите квиз/викторину из списка):</p>
                    <form className="h gap-sm mg-v-md" onSubmit={ onSubmit }>
                        <select className="bg-gray r-md p-md" onChange={ (e) => setQuizId(+e.target.value) }>
                            { quizOptions }
                        </select>
                        <Button loading={ loading }>Начать игру</Button>
                    </form>
                </>
            }

            <h1>Прошедшие игры</h1>
            { resultsElement }
        </div>
    );
};


export default GamesAdminFragment;