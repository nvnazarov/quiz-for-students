import { Link } from "react-router-dom";

const colors = ['Blue', 'Pink', 'Orange', 'Green'];


const toGroupCard = (data, index) => (
    <Link className='Card' key={data.id} to={`/groups/${data.id}?p=main`}>
        <h2>{data.name}</h2>

        20 участников
    </Link>
);


const toMyGroupCard = (data, index) => (
    <Link className='Card' key={data.id} to={`/groups/my/${data.id}?p=main`}>
        <h2>{data.name}</h2>

        20 участников
    </Link>
);


const toQuizCard = (data, index) => {
    return (
        <span className='Card' key={data.id}>
            <h2>{data.name}</h2>

            10 вопросов, 100 очков
        </span>
    );
};


const checkMap = (array, mapper, onNull, onUndefined, onEmpty) => {
    if (array === null) {
        return onNull;
    }
    if (array === undefined) {
        return onUndefined;
    }
    if (array.length === 0) {
        return onEmpty;
    }
    return array.map((element, index) =>  mapper(element, index));
};


export {
    checkMap,
    toGroupCard,
    toMyGroupCard,
    toQuizCard,
};
