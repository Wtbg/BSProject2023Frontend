// FullPageErrorFallback.js
import React from 'react';

export function FullPageErrorFallback({ error }) {
    return (
        <div className="full-page-error">
            <p>Error occurred:</p>
            <pre>{error.message}</pre>
            {/* You can customize the error component further as needed */}
        </div>
    );
}
