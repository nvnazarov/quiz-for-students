import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useGroupData } from '../hooks/Group.jsx';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext.jsx';
import { apiUrl } from '../config.js';
import QRCode from 'react-qr-code';
import CopyBox from '../components/ui/CopyBox.jsx';
import SubmitButton from '../components/ui/SubmitButton.jsx';


const GroupAdminPage = () => {
    const { id } = useParams();
    const [searchParams,] = useSearchParams();
    const [token] = useContext(UserContext);
    const [data, loadName, loadMembers, loadHistory, loadGame] = useGroupData(token, id);

    const category = searchParams.get('p');

    const onBan = async (status, memberId) => {
        const fetchRequest = {
            method: 'POST',
            headers: {
                token: token,
            }
        };

        if (status) {
            const response = await fetch(`${apiUrl}/groups/${id}/unban/${memberId}`, fetchRequest);
            if (response.ok) {
                loadMembers();
            }
        } else {
            const response = await fetch(`${apiUrl}/groups/${id}/ban/${memberId}`, fetchRequest);
            if (response.ok) {
                loadMembers();
            }
        }
    }

    const onCreateGame = async (e) => {
        e.preventDefault();

        const quizId = e.target.select.value;
        const requestParams = {
            method: 'POST',
            body: JSON.stringify({
                group_id: +id,
                quiz_id: +quizId,
            }),
            headers: {
                'content-type': 'application/json',
                token: token,
            }
        };
        const response = await fetch(`${apiUrl}/games/create`, requestParams).catch(() => {});
        
        if (response === undefined || !response.ok) {
            // TODO
            return;
        }

        loadGame();
    };

    const memberMapper = (member) =>
        <div className='KeyValue ListRow' key={member.id}>
            {member.name}
            <button onClick={() => onBan(member.banned, member.id)}>
                {
                    member.banned ? <>Разблокировать</> : <>Заблокировать</>
                }
            </button>
        </div>;

    const membersCards = data.members ? data.members.map(memberMapper) : data.members;

    const historyMapper = (h) => <li key={h.id}>{h.name} {h.date} <Link to={`/history/${h.id}`}>h.id</Link></li>;
    const historyCards = data.history ? data.history.map(historyMapper) : data.history;
    const quizMapper = (q) => <option key={q.id} value={q.id}>{q.name}</option>;
    const options = data.quizzes ? data.quizzes.map(quizMapper) : data.quizzes;

    const joinUrl = `http://localhost:3000/groups/join/${data.token}`;

    return (
        <div className='ProfileLayout'>
            <div className='ProfileNavigation'>
                <div className='ProfileNavigation-Logo'></div>
                <div className='ProfileNavigation-Categories'>
                    <Link to={`/groups/my/${id}?p=games`}>Игры</Link>
                    <Link to={`/groups/my/${id}?p=members`}>Участники</Link>
                    <Link to={`/groups/my/${id}?p=chat`}>Чат</Link>
                </div>
                <div className='ProfileNavigation-Quit'>
                    <Link to='/me/profile'>Профиль</Link>
                </div>
            </div>
            <div className='ProfileMain'>
                {
                    category === 'games' ?
                    <div className='List'>
                        <h1>Текущая игра</h1>
                        {
                            data.game === 'loading' ? <>...</> :
                            data.game === undefined ? <>Не удалось загрузить</> :
                            data.game === null ?
                            <form className='Horizontal' onSubmit={onCreateGame}>
                                <select name='select' id="cars">
                                    {
                                        options
                                    }
                                </select>
                                <SubmitButton title='Создать игру' />
                            </form> :
                            <Link className='Card' to={`/games/test/${data.game.game_id}`}>
                                {data.game.quiz_name}
                            </Link>
                        }
                        <h1>История</h1>
                        {
                            historyCards === null ? <>...</> :
                            historyCards === undefined ? <>Не удалось загрузить квизы</> :
                            historyCards.length === 0 ? <>Пусто</> :
                            historyCards
                        } 
                    </div> :
                    category === 'members' ?
                    <div className='List'>
                        <h1>Участники</h1>
                        <CopyBox text={joinUrl} />
                        <QRCode value={joinUrl} size={128} />
                        {
                            membersCards === null ? <>...</> :
                            membersCards === undefined ? <>Не удалось загрузить участников</> :
                            membersCards.length === 0 ? <>Пусто</> :
                            membersCards
                        }
                    </div> :
                    category === 'chat' ?
                    <div className='List'>
                        <h1>Чат</h1>
                    </div> :
                    <>Такой категории нет</>
                }
            </div>
        </div>
    );
}


export default GroupAdminPage;