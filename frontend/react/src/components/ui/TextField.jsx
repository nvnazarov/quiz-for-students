const TextField = ({name, text, setText, placeholder}) => {
    return (
        <input
            type='text'
            name={name}
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)} />
    );
};


export default TextField;