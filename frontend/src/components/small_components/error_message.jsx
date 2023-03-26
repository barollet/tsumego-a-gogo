import "../../css/error_message.css"

function PreMessage({pre}) {
    if (pre) {
        return {pre} + ":"
    } 
}

export default function ErrorMessage({pre="", error}) {
    if (error) {
        return <p className="error"><PreMessage/>{error}</p>
    }
}