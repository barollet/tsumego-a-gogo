import { useState, useEffect } from "react";

import {sendRequest} from "../axios";

export function useAxios(request_config) {
    const [trigger, {data, error}] = useLazyAxios(request_config);

    trigger();
    return [{data, error}]
}

// Trigger an axios request when the trigger function is called
export function useLazyAxios(request_config) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [triggered, setTrigger] = useState(false);

    useEffect(() => {
        async function handleRequest() {
            // Reset state before sending request
            setError(null);
            setData(null);
            const { response, error } = await sendRequest(request_config);

            if (response) {
                setData(response.data);
                return;
            }

            setError(error.message);
        }

        // If the request need to be triggered we send it
        if (triggered) {
            handleRequest();
            // Desarm the trigger so the request can be triggered again
            setTrigger(false)
        }
    }, [triggered]);

    return [() => setTrigger(true), data, error]
}