import { useState } from "react";
import NumberField from "../ui/NumberField";
import TextField from "../ui/TextField";


const SingleAnswerCard = ({ id, data, setData, onDelete }) => {
    const [expanded, setExpanded] = useState(false);

    if (expanded) {
        const mapper = (a, index) => {
            const onChange = (value) => {
                const newAnswers = data.answers.map((ans, i) => {
                    if (i == index) {
                        return value;
                    } else {
                        return ans;
                    }
                });
                setData(id, {...data, answers: newAnswers});
            };

            if (index == data.correct) {
                return (
                    <div key={ index } className="AnswerBox">
                        <TextField text={ a } setText={ onChange } /> (Этот ответ верный)
                    </div>
                );
            }

            return (
                <div key={ index } className="AnswerBox">
                    <TextField text={ a } setText={ onChange } />
                    <button onClick={ () => setData(id, {...data, correct: index}) }>Верный ответ</button>
                </div>
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
                <span className="Param">Один ответ</span>
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


export default SingleAnswerCard;