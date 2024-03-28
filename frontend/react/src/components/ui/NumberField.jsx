const NumberField = ({name, number, setNumber, placeholder}) => {
    return (
        <input
            type='number'
            name={name}
            placeholder={placeholder}
            value={number}
            onChange={(e) => setNumber(e.target.value)} />
    );
};


export default NumberField;