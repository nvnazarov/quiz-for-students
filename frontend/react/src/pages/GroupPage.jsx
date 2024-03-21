import { Link, useParams } from 'react-router-dom';
import { useGroupData } from '../hooks/Group.jsx';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext.jsx';
import QRCode from 'react-qr-code';


const GroupPage = () => {
    const { id } = useParams();
    const [token] = useContext(UserContext);
    const [data, loadName, loadMembers, loadHistory] = useGroupData(token, id);

    const memberMapper = (member) => <li key={member.id}>{member.name} <button>ban</button></li>;
    const membersCards = data.members ? data.members.map(memberMapper) : data.members;

    const historyMapper = (h) => <li key={h.id}>{h.name} {h.date} <Link to={`/history/${h.id}`}>h.id</Link></li>;
    const historyCards = data.history ? data.history.map(historyMapper) : data.history;

    return (
        <>
            <Link to='/profile'>Назад</Link>

            <hr/>

            <h3>
                {
                    data.name === null ? <>...</> :
                    data.name === undefined ? <>Не удалось загрузить название группы</> :
                    data.name
                }
            </h3>

            <hr/>

            <h3>Участники</h3>
            <ul>
                {
                    membersCards === null ? <>...</> :
                    membersCards === undefined ? <>Не удалось загрузить участников</> :
                    membersCards.length === 0 ? <>Пусто</> :
                    membersCards
                }
            </ul>

            <hr/>

            <h3>Текущий квиз</h3>

            <hr/>

            <h3>Прошедшие квизы</h3>
            <ul>
                {
                    historyCards === null ? <>...</> :
                    historyCards === undefined ? <>Не удалось загрузить квизы</> :
                    historyCards.length === 0 ? <>Пусто</> :
                    historyCards
                }    
            </ul>

            <hr/>

            Скопируйте ссылку {'http://localhost:3000/groups/join/0'} или <br/>

            <QRCode value='http://localhost:3000/groups/join/0' size={128} />
            
        </>
    );
}


export default GroupPage;