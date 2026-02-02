import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import learningService from '../../services/learningService';
import NoteViewer from '../../components/learning/NoteViewer';

const SubjectView = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingTopic, setLoadingTopic] = useState(false);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await learningService.getTopicsBySubject(subjectId);
                if (res.success) {
                    setTopics(res.data);
                    if (res.data.length > 0) {
                        // Select first topic by default if none selected
                        fetchTopicDetails(res.data[0]._id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch topics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopics();
    }, [subjectId]);

    const fetchTopicDetails = async (topicId) => {
        setLoadingTopic(true);
        try {
            const res = await learningService.getTopic(topicId);
            if (res.success) {
                setSelectedTopic(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch topic details", error);
        } finally {
            setLoadingTopic(false);
        }
    };

    const handleTopicClick = (topicId) => {
        fetchTopicDetails(topicId);
    };

    const handlePracticeClick = () => {
        if (selectedTopic) {
            navigate(`/practice/${selectedTopic._id}`);
        }
    };

    if (loading) return <div className="text-white text-center mt-10">Loading topics...</div>;

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-900 border-r border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <button
                        onClick={() => navigate('/learning')}
                        className="text-gray-400 hover:text-white mb-2 text-sm"
                    >
                        ← Back to Subjects
                    </button>
                    <h2 className="text-lg font-bold text-white">Topics</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {topics.map((topic) => (
                        <div
                            key={topic._id}
                            onClick={() => handleTopicClick(topic._id)}
                            className={`p-4 cursor-pointer border-b border-gray-800 transition-colors ${selectedTopic && selectedTopic._id === topic._id
                                    ? 'bg-blue-900 border-l-4 border-l-blue-500'
                                    : 'hover:bg-gray-800'
                                }`}
                        >
                            <h3 className="text-sm font-medium text-gray-200">{topic.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${topic.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                                    topic.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                                        'bg-red-900 text-red-300'
                                }`}>
                                {topic.difficulty}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-900 overflow-y-auto p-8 text-gray-300">
                {selectedTopic ? (
                    <>
                        <div className="flex justify-between items-start mb-6 border-b border-gray-700 pb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{selectedTopic.title}</h1>
                                <p className="text-sm text-gray-400">Subject: {selectedTopic.subject.name}</p>
                            </div>
                            <button
                                onClick={handlePracticeClick}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg transition-transform transform hover:scale-105"
                            >
                                Practice Now 🚀
                            </button>
                        </div>

                        {loadingTopic ? (
                            <div className="text-center py-10">Loading content...</div>
                        ) : (
                            <div className="bg-gray-800 rounded-xl p-6 shadow-md min-h-[500px]">
                                <NoteViewer content={selectedTopic.content} />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a topic to start learning
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectView;
