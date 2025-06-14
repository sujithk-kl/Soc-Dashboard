// client/src/hooks/useClickOutside.js

import { useEffect, useRef } from 'react';

/**
 * A custom hook that triggers a callback when a click is detected outside of the referenced element.
 * @param {function} callback - The function to call when an outside click is detected.
 * @returns {React.MutableRefObject} - The ref object to attach to the element to monitor.
 */
const useClickOutside = (callback) => {
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the ref is attached to an element and the click is outside of it
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        // Add event listeners
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        // Cleanup function to remove event listeners
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [ref, callback]);

    return ref;
};

export default useClickOutside;
