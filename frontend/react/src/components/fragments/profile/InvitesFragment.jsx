const InvitesFragment = ({ invites, onJoinByInvite, onCancelInvite, onUpdate }) => {
    const inviteMapper = (invite) => {
        return (
            <div key={ invite.id } className="MemberBox">
                <div>{ invite.group_name }</div>
                <div className="Horizontal GapSmall">
                    <button onClick={ () => onJoinByInvite(invite.id) }>Присоединиться</button>
                    <button onClick={ () => onCancelInvite(invite.id) }>Отклонить</button>
                </div>
            </div>
        );
    };
    const invitesElements = invites === undefined ? <>Не удалось загрузить приглашения</> :
                            invites.length === 0 ? <>У вас нет приглашений</> :
                            invites.map(inviteMapper);

    return (
        <div className="Page">
            <h1>Приглашения</h1>

            <button className="VerticalMargin" onClick={ onUpdate }>Обновить</button>

            <div className="Grid VerticalMargin">
                {
                    invitesElements
                }
            </div>
        </div>  
    );
};


export default InvitesFragment;