import './Clock.css'

export default function Clock({totalTime, passedTime}) {
    return (
        <div>
            <span>{passedTime} s</span>
        </div>
    );
}