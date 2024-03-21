import { useState } from 'react';


const MultipleAnswersCard = ({ id, data, setData, onDelete }) => {
    const [expanded, setExpanded] = useState(false);

    if (expanded) {
        return (
            <>
                Несколько ответов

                <br/>Время: <input type='number' value={data.time} onChange={(e) => setData(id, {...data, time: e.target.value})} />
                <br/>Очки: <input type='number' value={data.points} onChange={(e) => setData(id, {...data, points: e.target.value})} />
                <br/>Текст: <input type='text' value={data.text} onChange={(e) => setData(id, {...data, text: e.target.value})} />
                <br/>Изображение: <input type='image' onChange={(e) => setData(id, {...data, image: e.target.value})} />

                <br/>

                <button onClick={() => onDelete(id)}>Удалить</button>

                <button onClick={() => setExpanded(false)}>Свернуть</button>
            </>
        );
    }

    return (
        <>
            Несколько ответов, {data.time} сек, {data.points} очков
            
            <br/>

            <button onClick={() => onDelete(id)}>Удалить</button>

            <button onClick={() => setExpanded(true)}>Развернуть</button>
        </>
    );    
}


export default MultipleAnswersCard;