import { useContext } from 'react'
import LoginOrRegister from './pages/LoginOrRegister.jsx'
import Profile from './pages/Profile.jsx'
import { UserContext } from './contexts/UserContext.jsx'

const App = () => {
    const [token] = useContext(UserContext)

    return (
        <>
            { token ? (
                <Profile />
            ) : (
                <LoginOrRegister />
            ) }
        </>
    )
}

export default App