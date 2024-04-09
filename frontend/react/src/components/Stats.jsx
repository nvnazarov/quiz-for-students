const Stats = ({ labels, values, correct }) => {
    const bars = labels.map(
        (label, index) => {
            return (
                <div key={ index } className="bar-container Vertical">
                    {
                        correct.includes(index) ?
                        <div className="bar-value-container-true">
                            <div>{ values[index] }</div>
                        </div>
                        :
                        <div className="bar-value-container">
                            <div>{ values[index] }</div>
                        </div>
                    }
                    <div className="bar-label-container">{ label }</div>
                </div>
            );
        }
    );
    
    return (
        <div className="stats-container">{ bars }</div>
    );
};


export default Stats;