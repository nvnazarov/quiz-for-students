import { Link } from "react-router-dom";


// <a href="https://www.flaticon.com/free-icons/quiz" title="quiz icons">Quiz icons created by Freepik - Flaticon</a>
const QuizzesFragment = ({ quizzes }) => {
    const quizMapper = (quiz) => (
        <Link to={ `/constructor/${quiz.type}?id=${quiz.id}` } key={ quiz.id } className="Card">
            <div className="Horizontal GapMid VerticalCentered">
                <img src={ `/${quiz.type}Icon.png` } className="Icon"></img> { quiz.name }
            </div>
        </Link>
    );

    const quizzesElements = (quizzes === undefined) ? <p>Не удалось загрузить квизы</p> : quizzes.map(quizMapper);

    return (
        <div className="Page">
            <h1>Квизы</h1>

            <div className="Horizontal GapSmall VerticalMargin">
                <Link to="/constructor/test" className="Button">Создать квиз</Link>
                <Link to="/constructor/quiz" className="Button">Создать викторину</Link>
            </div>

            <div className="Grid">
                { quizzesElements }
            </div>
        </div>
    );
};


export default QuizzesFragment;