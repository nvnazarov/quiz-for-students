const KeyValue = ({ name, value }) => {
    return (
        <div className="Horizontal KeyValue">
            <div className="KeyValueLeft">
                {name}
            </div>
            <div className="KeyValueRight">
                {value}
            </div>
        </div>
    );
};


export default KeyValue;