const MemberCard = ({name, avatarUrl}) => {
    return (
        <>
            <img src={avatarUrl}></img>
            {name}
        </>
    );
}

export default MemberCard;