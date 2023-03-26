import { useState } from "react";

// TODO understand problems when this function is used to remove it

export default function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
}