const TextField = ({hint, text, setText}) => {
    return (
        <input className='text-field' type='text' onChange={(e) => setText(e.target.value)} value={text} />
    );
}

export default TextField;