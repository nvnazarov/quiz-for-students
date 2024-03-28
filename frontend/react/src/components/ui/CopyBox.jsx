const CopyBox = ({ text }) => {
    return (
        <div className='CopyBoxLayout'>
            <div className='CopyBoxText'>
                {text}
            </div>
            <div className='CopyBoxButton'>
                Копировать
            </div>
        </div>
    );
};


export default CopyBox;