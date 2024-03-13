const MemberCard = (props) => {    
    return (
        <div>
            Member {props.id}: {props.name} <button onClick={() => props.ban(props.id)}>ban</button>
        </div>
    )
}

export default MemberCard