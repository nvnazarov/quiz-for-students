const QuizCard = ({title, qCount, maxPoints, link}) => {
    return (
        <a href={link}>
            {title}
            {qCount} вопросов
            {maxPoints} баллов
        </a>
    );
}

export default QuizCard;