import {Link} from 'react-router-dom'

const HomePage = () => {
    return (
        <>
            Домашняя страница 
            
            <hr/>

            <Link to="/login">Войти</Link>
            <br/>
            <Link to="/register">Зарегистрироваться</Link>
        </>
    )
}


export default HomePage