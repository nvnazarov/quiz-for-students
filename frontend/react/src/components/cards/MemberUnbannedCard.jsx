const MemberUnbannedCard = ({id, name, email, onBan}) => {
    return (
        <li>
            {name}, {email}, <button onClick={() => onBan(id)}>Заблокировать</button>
        </li>
    );
};


export default MemberUnbannedCard;