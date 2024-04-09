import { useState, useEffect } from "react";


const Timer = ({ seconds }) => {
    const [ time, setTime ] = useState(seconds);
    
    useEffect(() => {

        setInterval(() => setTime(t => t > 0 ? t - 1 : 0), 1000);

    }, []);

    return (
        <>
            { time }
        </>
    );
};


export default Timer;