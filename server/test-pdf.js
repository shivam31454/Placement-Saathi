const pdf = require('pdf-parse');
const fs = require('fs');

console.log('Type of import:', typeof pdf);
console.log('Import content:', pdf);

if (typeof pdf !== 'function') {
    console.log('Keys:', Object.keys(pdf));
    if (pdf.default) {
        console.log('Default export type:', typeof pdf.default);
    }
}

// Create a dummy PDF file for testing (empty file won't work, but we are testing import mainly)
// Actually we need a valid PDF to test parsing.
// We will just stop at import inspection for now.
