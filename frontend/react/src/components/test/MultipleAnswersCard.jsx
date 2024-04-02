import {useState} from 'react';
import NumberField from "../ui/NumberField";
import TextField from "../ui/TextField";


const MultipleAnswerCard = ({id, data, setData, onDelete}) => {
    const [expanded, setExpanded] = useState(false);

    if (expanded) {
        const mapper = (a, index) => {
            if (data.correct.includes(index)) {
                return (
                    <li key={index} className="AnswerBox">
                        <input value={a} onChange={(e) => {
                            const newAnswers = data.answers.map((ans, i) => {
                                if (i === index) {
                                    return e.target.value;
                                } else {
                                    return ans;
                                }
                            });
                            setData(id, {...data, answers: newAnswers});
                        }} />
                        Этот ответ верный
                        <button onClick={() =>
                            {
                                const newCorrect = data.correct.filter((idx) => idx !== index);
                                setData(id, {...data, correct: newCorrect});
                            }
                        }>Неверный</button>
                    </li>
                );
            }
            return (
                <li key={index} className="AnswerBox">
                    <input value={a} onChange={(e) => {
                        const newAnswers = data.answers.map((ans, i) => {
                            if (i === index) {
                                return e.target.value;
                            } else {
                                return ans;
                            }
                        });
                        setData(id, {...data, answers: newAnswers});
                    }} />
                    Этот ответ неверный
                    <button onClick={() =>
                        {
                            const newCorrect = [...data.correct, index];
                            setData(id, {...data, correct: newCorrect});
                        }
                    }>Верный</button>
                </li>
            );
        }

        const answersElements = data.answers.map(mapper);

        return (
            <div className="QuestionBoxExpanded">
                <div className="ParamsBox">
                    <div className="StartEnd VerticalCentered GapMid">
                        Время
                        <NumberField number={ data.time } setNumber={ (value) => setData(id, {...data, time: value}) } />
                    </div>
                    <div className="StartEnd VerticalCentered GapMid">
                        Очки
                        <NumberField number={ data.points } setNumber={ (value) => setData(id, {...data, points: value}) } />
                    </div>
                    <div className="StartEnd VerticalCentered GapMid">
                        Изображение
                        <input type="file" />
                    </div>
                </div>

                <input
                    className="QuestionEdit"
                    value={ data.title }
                    onChange={ (e) => setData(id, {...data, title: e.target.value}) }
                    placeholder="Напишите вопрос" />
                
                <div className="QuestionAnswersContainer">{ answersElements }</div>

                <div className="QuestionExpanded-Actions">
                    <button onClick={ () => onDelete(id) }>Удалить</button>
                    <button onClick={ () => setExpanded(false) }>Свернуть</button>
                </div>
            </div>
        );
    }

    return (
        <div className="QuestionBox Horizontal">
            <div className="Horizontal GapSmall">
                <span className="Param">Несколько ответов</span>
                <span className="Param">{data.time} сек</span>
                <span className="Param">{data.points} очков</span>
                <span className="TextParam">{data.title.substr(0, 40) + "..."}</span>
            </div>
            <div className="Horizontal GapSmall">
                <button onClick={ () => onDelete(id) }>Удалить</button>
                <button onClick={ () => setExpanded(true) }>Развернуть</button>
            </div>
        </div>
    );
}


export default MultipleAnswerCard;