const MemberBannedCard = ({id, name, email, onUnban}) => {
    return (
        <li>
            {name}, {email}, <button onClick={() => onUnban(id)}>Разблокировать</button>
        </li>
    );
};


export default MemberBannedCard;