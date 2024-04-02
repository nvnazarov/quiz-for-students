const MembersFragment = ({ members }) => {
    const memberMapper = (member) => {
        return (
            <div key={ member.id } className="MemberBox">
                <div>{ member.name }</div>
                <div>{ member.email }</div>
            </div>
        );
    };

    const membersElements = members === undefined ? <>Не удалось загрузить участников</> :
                            members.length === 0 ? <>Список участников пуст</> :
                            members.map(memberMapper);

    return (
        <div className="Page">
            <h1>Участники</h1>

            <div className="Grid VerticalMargin">
                {
                    membersElements
                }
            </div>
        </div>
    );
};


export default MembersFragment;