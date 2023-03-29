import { useRef } from "react";

export default function useBoardState() {
    // We use a ref instead of a state because the board display is not managed by React
    const boardStateRef = useRef(null);

    // Returns a setter so the board state can be set inside the ref
    function setBoardState(state) {
        boardStateRef.current = state;
    }

    return [boardStateRef.current, setBoardState];
}