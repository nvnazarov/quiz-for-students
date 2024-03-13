import {Link} from 'react-router-dom';


const QuizCard = ({id, name, type}) => {
    return (
        <Link to={`/constructor/${type}?q=${id}`}>
            Quiz {id}: {name}
        </Link>
    );
}


export default QuizCard;