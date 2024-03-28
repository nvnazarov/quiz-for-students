const ReloadBox = ({title, onReload, children}) => {
    return (
        <div className='ReloadBox'>
            <span className='ReloadBox-Title'>{title}</span>
            {children}
        </div>
    );
};


export default ReloadBox;