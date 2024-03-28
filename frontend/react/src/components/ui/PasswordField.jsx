const PasswordField = ({name, text, setText, placeholder}) => {
    return (
        <input
            type='password'
            name={name}
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)} />
    );
};


export default PasswordField;