import { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext.jsx';
import { apiUrl } from '../config.js';
import { Link, Navigate } from 'react-router-dom';
import { useProfileData } from '../hooks/Profile.jsx';


const ProfilePage = () => {
    const [token, setToken] = useContext(UserContext);
    const [profileData, loadUser, loadGroups, loadMyGroups, loadQuizzes] = useProfileData(token);
    const [newGroupName, setNewGroupName] = useState('');

    if (!token) {
        return <Navigate to='/login' />
    }


    const onCreateGroup = async (e) => {
        e.preventDefault();

        const fetchRequest = {
            method: 'POST',
            headers: {
                token: token,
            }
        };

        const response = await fetch(`${apiUrl}/groups/create/${newGroupName}`, fetchRequest);

        if (!response.ok) {
            // TODO
        }

        loadMyGroups();
    }

    const mapper = (g) => <li key={g.id}><Link to={`/groups/${g.id}`}>{g.name}</Link></li>;

    const quizCards = profileData.quizzes ? profileData.quizzes.map((q) => <li key={q.id}>{q.name}</li>) : profileData.quizzes;
    const groupCards = profileData.groups ? profileData.groups.map(mapper) : profileData.groups;
    const myGroupCards = profileData.myGroups ? profileData.myGroups.map(mapper) : profileData.myGroups;

    return (
        <>
            <Link to='/login' onClick={() => setToken(null)}>Выйти</Link><br/>

            <hr/>

            <span>Имя: {profileData.user ? profileData.user.name : null}</span><br/>
            <span>Почта: {profileData.user ? profileData.user.email : null}</span>

            <hr/>

            <h3>Квизы</h3>
            <ul>
                {
                    quizCards === null ? <>...</> :
                    quizCards === undefined ? <>Не удалось загрузить квизы</> :
                    quizCards.length === 0 ? <>Пусто</> :
                    quizCards
                }    
            </ul>
            <Link to='/constructor/test'>Создать квиз</Link><br/>
            <Link to='/constructor/quiz'>Создать викторину</Link>

            <hr/>

            <h3>Группы</h3>
            <ul>
                {
                    groupCards === null ? <>...</> :
                    groupCards === undefined ? <>Не удалось загрузить группы</> :
                    groupCards.length === 0 ? <>Пусто</> :
                    groupCards
                }
            </ul>

            <hr/>

            <h3>Мои группы</h3>
            <ul>
                {
                    myGroupCards === null ? <>...</> :
                    myGroupCards === undefined ? <>Не удалось загрузить ваши группы</> :
                    myGroupCards.length === 0 ? <>Пусто</> :
                    myGroupCards
                }
            </ul>

            <form onSubmit={onCreateGroup}>
                <input type='text' value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
                <button type='submit'>Создать группу</button>
            </form>
        </>
    );
}


export default ProfilePage;