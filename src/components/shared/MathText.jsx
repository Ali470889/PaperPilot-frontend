import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MathText = ({ math, block = false }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            // Remove any $ from the string before rendering
            const cleanMath = math.replace(/\$/g, '');

            katex.render(cleanMath, containerRef.current, {
                throwOnError: false,
                displayMode: block // true for centered equations, false for inline
            });
        }
    }, [math, block]);

    return <span ref={containerRef} />;
};

export default MathText;