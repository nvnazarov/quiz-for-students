const TextField = ({ placeholder, text, setText, type = "text" }) => {
    return (
        <input
            className="bg-gray p-md r-md"
            type={ type }
            placeholder={ placeholder }
            value={ text }
            onChange={ (e) => setText(e.target.value) } />
    );
};


export default TextField;