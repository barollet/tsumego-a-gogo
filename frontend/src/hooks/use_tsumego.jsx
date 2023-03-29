import { useState, useEffect } from "react";

import { sendRequest } from "../axios";

// Hook to fetch a tsumego if the tsumego_prop is only an id
export default function useTsumego(tsumego_prop) {
    const init_tsumego_state = typeof(tsumego_prop) == "object" ? tsumego_prop : null;
    const [tsumego, setTsumego] = useState(init_tsumego_state);

    async function fetchTsumego() {
        const {response} = await sendRequest({
            // In that case tsumego_prop is an id
            url: `core/tsumego/${tsumego_prop}`
        });

        if (response) {
            setTsumego(response.data.tsumego);
        }
    }

    useEffect(() => {
        if (tsumego === null) {
            fetchTsumego();
        }
    }, []);

    return tsumego;
}