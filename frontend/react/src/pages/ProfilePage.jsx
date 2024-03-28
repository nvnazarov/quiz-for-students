import { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext.jsx';
import { apiUrl } from '../config.js';
import { Link, Navigate } from 'react-router-dom';
import { useProfileData } from '../hooks/Profile.jsx';
import TextField from '../components/ui/TextField.jsx';
import SubmitButton from '../components/ui/SubmitButton.jsx';
import ReloadBox from '../components/ui/ReloadBox.jsx';
import { toGroupCard, toMyGroupCard, checkMap, toQuizCard } from '../mappers/Mappers.jsx';
import { useParams } from 'react-router-dom';


const ProfilePage = () => {
    const [token, setToken] = useContext(UserContext);
    const [profileData, loadUser, loadGroups, loadMyGroups, loadQuizzes] = useProfileData(token);
    const [newName, setNewName] = useState('');
    const [newGroupName, setNewGroupName] = useState('');
    const {category} = useParams();

    if (!token) {
        return <Navigate to='/login' />
    }

    const onChangeName = async (e) => {
        e.preventDefault();

        const fetchRequest = {
            method: 'POST',
            headers: {
                token: token,
            }
        };

        const response = await fetch(`${apiUrl}/users/name/${newName}`, fetchRequest).catch(() => {});

        if (response === undefined || !response.ok) {
            // TODO
        }

        loadUser();
    };

    const onCreateGroup = async (e) => {
        e.preventDefault();

        const fetchRequest = {
            method: 'POST',
            headers: {
                token: token,
            }
        };

        const response = await fetch(`${apiUrl}/groups/create/${newGroupName}`, fetchRequest).catch(() => {});

        if (response === undefined || !response.ok) {
            // TODO
        }

        loadMyGroups();
    }

    const quizElements = checkMap(
        profileData.quizzes,
        toQuizCard,
        '...',
        'Не получилось загрузить',
        'Вы еще не создавали квизы или викторины'
    );

    const groupElements = checkMap(
        profileData.groups,
        toGroupCard,
        '...',
        'Не получилось загрузить',
        'Вы еще не вступили ни в одну группу'
    );

    const myGroupElements = checkMap(
        profileData.myGroups,
        toMyGroupCard,
        '...',
        'Не получилось загрузить',
        'Вы еще не создавали группы'
    );

    return (
        <div className='ProfileLayout'>
            <div className='ProfileNavigation'>
                <div className='ProfileNavigation-Logo'></div>
                <div className='ProfileNavigation-Categories'>
                    <Link to='/me/profile'>Профиль</Link>
                    <Link to='/me/quizzes'>Квизы</Link>
                    <Link to='/me/groups'>Группы</Link>
                    <Link to='/me/owned'>Мои группы</Link>
                </div>
                <div className='ProfileNavigation-Quit'>
                    <Link to='/login' onClick={() => setToken(null)}>Выйти</Link>
                </div>
            </div>
            <div className='ProfileMain'>
                {
                    category === 'profile' ?
                    <div className='List'>
                        <h1>Профиль</h1>
                        
                        Имя: {profileData.user ? profileData.user.name : '...'}<br/>
                        Почта: {profileData.user ? profileData.user.email : '...'}

                        <form className='Horizontal' onSubmit={onChangeName}>
                            <TextField text={newName} setText={setNewName} placeholder='Новое имя' />
                            <SubmitButton title='Сохранить' />
                        </form>
                    </div> :
                    category === 'quizzes' ?
                    <div className='List'>
                        <h1>Квизы</h1>
                        <div className='Horizontal'>
                            <Link className='Button' to='/constructor/test'>Добавить квиз</Link>
                            <Link className='Button' to='/constructor/test'>Добавить викторину</Link>
                        </div>
                        <div className='Grid'>
                            {
                                quizElements
                            }
                        </div>
                    </div> :
                    category === 'groups' ?
                    <div className='List'>
                        <h1>Группы</h1>
                        <div className='Grid'>
                            {
                                groupElements
                            }
                        </div>
                    </div> :
                    category === 'owned' ?
                    <div className='List'>
                        <h1>Мои группы</h1>
                        <form className='Horizontal' onSubmit={onCreateGroup}>
                            <TextField text={newGroupName} setText={setNewGroupName} placeholder='Название группы' />
                            <SubmitButton title='Создать' />
                        </form>
                        <div className='Grid'>
                            {
                                myGroupElements
                            }
                        </div>
                    </div> :
                    'no such category'
                }
            </div>
        </div>
    );
}


export default ProfilePage;