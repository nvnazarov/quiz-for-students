import { useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../../contexts/UserContext";
import { useQuizzes } from "../../../hooks/hooks";
import Loader from "../../Loader";
import "../../../styles/common.css";


const QuizCard = ({ quiz }) => {
    return (
        <Link to={ `/constructor/${quiz.type}?id=${quiz.id}` } className="c-gray p-md r-md bg-gray w-md bounce v-center">
            <div className="h gap-md ai-center">
                <img src={ `/${quiz.type}.png` } className="icon-lg"></img> { quiz.name === "" ? "[Без названия]" : quiz.name }
            </div>
        </Link>
    );
};


const QuizzesFragment = () => {
    const [authToken] = useContext(UserContext);
    const [quizzes] = useQuizzes(authToken);

    if (quizzes === null) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Квизы</h1>
                
                <div className="mg-v-md">
                    <Loader />
                </div>
            </div>
        );
    }

    if (quizzes === undefined) {
        return (
            <div className="h-full bg-white p-lg">
                <h1>Квизы</h1>
                
                <p className="mg-v-md">Не удалось загрузить квизы.</p>
            </div>
        );
    }

    const quizzesElements = quizzes.map(q => <QuizCard key={ q.id } quiz = { q }/>);

    return (
        <div className="h-full bg-white p-lg">
            <h1>Квизы</h1>

            <p className="mg-v-md">
                Создайте <Link to="/constructor/test">квиз</Link> или <Link to="/constructor/quiz">викторину</Link>.
            </p>

            <div className="h gap-md wrap">
                { quizzesElements }
            </div>
        </div>
    );
};


export default QuizzesFragment;