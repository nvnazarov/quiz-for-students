import {Link} from 'react-router-dom';


const GroupCard = ({id, name}) => {
    return (
        <Link to={`/groups?id=${id}`}>
            Group {id}: {name}
        </Link>
    );
}


export default GroupCard;