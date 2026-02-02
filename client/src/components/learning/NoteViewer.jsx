import React from 'react';
import ReactMarkdown from 'react-markdown';

const NoteViewer = ({ content }) => {
    return (
        <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
};

export default NoteViewer;
