import * as pages from './pages/AllPages.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<pages.LoginPage />} />
                <Route path='/register' element={<pages.RegisterPage />} />
                <Route path='/profile' element={<pages.ProfilePage />} />
                <Route path='/groups/:id' element={<pages.GroupPage />} />
                <Route path='/groups/my/:name' element={<pages.GroupAdminPage />} />
                <Route path='/constructor/test' element={<pages.TestConstructorPage />} />
                <Route path='/constructor/quiz' element={<pages.QuizConstructorPage />} />
                <Route path='/games/test/:id' element={<pages.TestGamePage />} />
                <Route path='/games/quiz/:id' element={<pages.QuizGamePage />} />
                <Route index path='/' element={<pages.HomePage />} />
                <Route path='*' element={<pages.NoPage />} />
            </Routes>
        </BrowserRouter>
    );
}


export default App;