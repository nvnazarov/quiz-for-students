import KeyValue from "../../ui/KeyValue";
import QRCode from "react-qr-code";
import { useState } from "react";
import TextField from "../../ui/TextField";
import SubmitButton from "../../ui/SubmitButton";


const MembersAdminFragment = ({ members, groupToken, onBan, onUnban, onInvite }) => {
    const [inviteEmail, setInviteEmail] = useState("");

    const memberMapper = (member) => {
        if (member.banned) {
            return (
                <div key={ member.id } className="MemberBox MemberBoxBanned">
                    <div>{ member.name }</div>
                    <div>{ member.email }</div>
                    <button onClick={ () => onUnban(member) }>Разблокировать</button>
                </div>
            );
        } else {
            return (
                <div className="MemberBox">
                    <div>{ member.name }</div>
                    <div>{ member.email }</div>
                    <button onClick={ () => onBan(member) }>Заблокировать</button>
                </div>
            );
        }
    };

    const membersElements = members === undefined ? <>Не удалось загрузить участников</> :
                            members.length === 0 ? <>Список участников пуст</> :
                            members.map(memberMapper);

    const joinLink = `http://localhost:3000/groups/join/${groupToken}`;

    return (
        <div className="Page">
            <h1>Пригласите участников</h1>

            <div className="Vertical GapSmall VerticalMargin">
                <KeyValue name="Ссылка" value={ joinLink } />
                <QRCode size={128} value={ joinLink } />
            </div>

            <form className="Horizontal GapSmall VerticalMargin" onSubmit={ (e) => { e.preventDefault(); onInvite(inviteEmail) } }>
                <TextField placeholder="Введите почту" text={ inviteEmail } setText={ setInviteEmail } />
                <SubmitButton title="Пригласить" />
            </form>

            <h1>Участники</h1>

            <div className="Grid VerticalMargin">
                {
                    membersElements
                }
            </div>
        </div>
    );
};


export default MembersAdminFragment;