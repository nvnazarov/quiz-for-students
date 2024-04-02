import { Link } from "react-router-dom";


const GroupsFragment = ({ groups }) => {
    const groupMapper = (group) => (
        <Link to={ `/groups/${group.id}` } key={ group.id } className="Card">
            { group.name }
        </Link>
    );

    const groupsElements = groups === undefined ? <>Не удалось загрузить группы</> :
                            groups.length === 0 ? <>Вы не вступили ни в одну группу</> :
                            groups.map(groupMapper);

    return (
        <div className="Page">
            <h1>Группы</h1>

            <div className="Grid VerticalMargin">
                { groupsElements }
            </div>
        </div>
    );
};


export default GroupsFragment;