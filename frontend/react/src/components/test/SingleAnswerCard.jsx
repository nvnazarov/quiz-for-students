import {useState} from 'react';
import NumberField from '../ui/NumberField';
import TextField from '../ui/TextField';


const SingleAnswerCard = ({id, data, setData, onDelete}) => {
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
                    <div key={index}>
                        <TextField text={a} setText={onChange} /> (ok)
                    </div>
                );
            }

            return (

                <div key={index}>
                    <TextField text={a} setText={onChange} />
                    <button onClick={() => setData(id, {...data, correct: index})}>этот</button>
                </div>
            );
        }

        const answersElements = data.answers.map(mapper);

        return (
            <div className='QuestionContainer-Expanded'>
                <span className='QuestionTitle'>Один ответ</span>

                <div className='KeyValue'>
                    Время
                    <NumberField number={data.time} setNumber={(value) => setData(id, {...data, time: value})} />
                </div>
                <div className='KeyValue'>
                    Очки
                    <NumberField number={data.points} setNumber={(value) => setData(id, {...data, points: value})} />
                </div>
                <div className='KeyValue'>
                    Изображение
                    <input type='file' />
                </div>

                <input
                    className='QuestionEdit'
                    value={data.text}
                    onChange={(e) => setData(id, {...data, text: e.target.value})}
                    placeholder='Напишите вопрос' />

                <div className='QuestionAnswersContainer'>{answersElements}</div>
                
                <div className='QuestionExpanded-Actions'>
                    <button onClick={() => onDelete(id)}>Удалить</button>
                    <button onClick={() => setExpanded(false)}>Свернуть</button>
                </div>
            </div>
        );
    }

    return (
        <div className='QuestionContainer'>
            <span className='QuestionTitle'>Один ответ</span>
            <div className='QuestionParams'>
                <span className='Param'>{data.time} сек.</span>
                <span className='Param'>{data.points} очков</span>
            </div>
            <div className='QuestionActions'>
                <button onClick={() => onDelete(id)}>Удалить</button>
                <button onClick={() => setExpanded(true)}>Развернуть</button>
            </div>
        </div>
    );
}


export default SingleAnswerCard;