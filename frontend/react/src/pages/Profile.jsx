import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../contexts/UserContext.jsx'
import Fetching from '../components/Fetching.jsx'
import { apiUrlPrefix } from '../config.js'

const Profile = () => {
    const [token, setToken] = useContext(UserContext)

    const [userData, setUserData] = useState({
        name: null,
        email: null,
        quizzes: [],
        groups: [],
        ownGroups: [],
    })

    useEffect(() => {
        const fetchData = async () => {
            return await fetch(
                `${apiUrlPrefix}/user/me`,
                {
                    method: 'GET',
                    headers: {
                        'authorization': 'bearer ' + token
                    }
                })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                
                if (response.status == 401) {
                    setToken(null)
                }
            })
            .catch(() => {});
        }

        const data = fetchData();
        if (data) {
            setUserData({ ...userData, ...data })
        } else {
            // TODO
        }
    }, [token])


    const quizzesElements = userData.quizzes.map(() => <div className='b-item'></div>)
    const groupsElements = userData.groups.map(() => <div className='b-item'></div>)
    const ownGroupsElements = userData.ownGroups.map(() => <div className='b-item'></div>)

    return (
        <main>
            <div className='quit' onClick={ () => setToken(null) }>Выйти</div>

            <div className='cont'>
                <div>Имя:</div>
                <div className='box r8'>{ userData.name }</div>
                <div>Почта:</div>
                <div className='box r8'>{ userData.email }</div>
            </div>

            <div className='h'>
                <div className='b'>
                    <div className='b-head'>Мои группы</div>
                    { ownGroupsElements }
                    <div className='b-action'>Создать</div>
                </div>
                <div className='b'>
                    <div className='b-head'>Группы</div>
                    { groupsElements }
                    <div className='b-action'>Вступить</div>
                </div>
                <div className='b'>
                    <div className='b-head'>Квизы и выкторины</div>
                    { quizzesElements }
                    <div className='b-action'>Создать</div>  
                </div>
            </div>
        </main>
    )
}

export default Profile