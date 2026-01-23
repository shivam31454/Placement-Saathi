import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTestStore from '../../store/useTestStore';
import useTimer from '../../hooks/useTimer';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { ChevronRight, ChevronLeft, Flag, Monitor, Save } from 'lucide-react';
import { clsx } from 'clsx';
import Editor from '@monaco-editor/react';

const LiveTest = () => {
    const navigate = useNavigate();
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState('');
    const {
        activeTest,
        questions,
        currentQuestionIndex,
        setCurrentQuestion,
        answers,
        setAnswer,
        toggleReview,
        finishTest
    } = useTestStore();

    // Redirect if no active test
    useEffect(() => {
        if (!activeTest) {
            navigate('/dashboard');
        }
    }, [activeTest, navigate]);

    // Timer Logic
    const handleTimeUp = () => {
        submitTest(true);
    };

    // activeTest.duration is in minutes
    const { formatTime, timeLeft } = useTimer(activeTest?.duration || 60, handleTimeUp);

    // Prevent accidental close
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const submitTest = async (autoSubmit = false) => {
        if (!autoSubmit && !window.confirm("Are you sure you want to submit the test?")) return;

        try {
            const timeTaken = (activeTest.duration * 60) - timeLeft;
            const res = await api.post(`/tests/${activeTest._id}/submit`, {
                answers,
                timeTaken
            });
            finishTest(); // Clear store
            navigate(`/test/result/${res.data.data._id}`);
        } catch (err) {
            console.error("Submission failed", err);
            alert("Submission failed! Please try again.");
        }
    };

    if (!activeTest || !questions.length) return null;

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers.find(a => a.questionId === currentQuestion._id);

    // Helpers for Question Palette
    const getQuestionStatus = (idx) => {
        const qId = questions[idx]._id;
        const ans = answers.find(a => a.questionId === qId);

        if (idx === currentQuestionIndex) return 'current';
        if (ans?.markedForReview) return 'review';
        if (ans?.selectedOption || ans?.codeSubmitted) return 'answered';
        return 'not-visited';
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">{activeTest.title}</h1>
                        <span className="text-sm text-gray-500">Subject: {currentQuestion.subject}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-900 text-white px-4 py-2 rounded-lg font-mono font-bold flex items-center gap-2">
                            <span className={timeLeft < 300 ? "text-red-400 animate-pulse" : ""}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                        <Button
                            variant="danger"
                            className="bg-red-500 hover:bg-red-600 text-sm py-2 px-6"
                            onClick={() => submitTest()}
                        >
                            Submit Test
                        </Button>
                    </div>
                </div>

                {/* Question Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="bg-white max-w-4xl mx-auto rounded-xl shadow-sm border border-gray-200 p-8 min-h-[500px] flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Question {currentQuestionIndex + 1}</span>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                                    {currentQuestion.type}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                                    {currentQuestion.marks} Marks
                                </span>
                            </div>
                        </div>

                        <h2 className="text-xl font-medium text-gray-800 mb-8 leading-relaxed">
                            {currentQuestion.content.text}
                        </h2>

                        {/* Answer Section */}
                        <div className="flex-1">
                            {currentQuestion.type === 'MCQ' ? (
                                <div className="space-y-3 max-w-2xl">
                                    {currentQuestion.content.options.map((opt, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setAnswer(currentQuestion._id, { selectedOption: opt.text })}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${currentAnswer?.selectedOption === opt.text
                                                ? 'border-primary bg-indigo-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${currentAnswer?.selectedOption === opt.text ? 'border-primary' : 'border-gray-400'
                                                }`}>
                                                {currentAnswer?.selectedOption === opt.text && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </div>
                                            <span className="text-gray-700">{opt.text}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col h-full gap-4">
                                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-t-lg border border-gray-200 border-b-0">
                                        <div className="flex gap-2">
                                            <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5" disabled>
                                                <option>JavaScript (Node.js 18)</option>
                                                {/* <option>Python 3</option> */}
                                                {/* Future: Add language selector logic linking to Piston versions */}
                                            </select>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                const code = currentAnswer?.codeSubmitted || currentQuestion.content.codeStub || '';
                                                if (!code) return;

                                                setIsRunning(true);
                                                setOutput('Compiling...');

                                                try {
                                                    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            language: 'javascript',
                                                            version: '18.15.0',
                                                            files: [{ content: code }]
                                                        })
                                                    });
                                                    const data = await res.json();
                                                    setOutput(data.run.output || 'No Output');
                                                } catch (err) {
                                                    setOutput('Error: Failed to execute code via Piston API');
                                                } finally {
                                                    setIsRunning(false);
                                                }
                                            }}
                                            disabled={isRunning}
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                                        >
                                            <div className={`w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5 ${isRunning ? 'hidden' : 'block'}`}></div>
                                            {isRunning ? 'Running...' : 'Run Code'}
                                        </button>
                                    </div>

                                    <div className="border border-gray-300 rounded-lg overflow-hidden flex-1 shadow-inner">
                                        <Editor
                                            height="350px"
                                            defaultLanguage="javascript"
                                            theme="vs-dark"
                                            value={currentAnswer?.codeSubmitted || currentQuestion.content.codeStub || '// Write your code here...'}
                                            onChange={(value) => setAnswer(currentQuestion._id, { codeSubmitted: value })}
                                            options={{
                                                minimap: { enabled: false },
                                                fontSize: 14,
                                                scrollBeyondLastLine: false,
                                                padding: { top: 16 }
                                            }}
                                        />
                                    </div>

                                    {/* Output Console */}
                                    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm h-40 overflow-y-auto border border-gray-700 shadow-inner">
                                        <div className="flex justify-between items-center mb-2 text-gray-400 border-b border-gray-700 pb-1">
                                            <span>Console Output</span>
                                            {output && <button onClick={() => setOutput('')} className="text-xs hover:text-white">Clear</button>}
                                        </div>
                                        <pre className="text-green-400 whitespace-pre-wrap">{output || <span className="text-gray-600 italic">Run code to see output...</span>}</pre>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Controls */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex gap-4">
                                <button
                                    className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        currentAnswer?.markedForReview ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                    onClick={() => toggleReview(currentQuestion._id)}
                                >
                                    <Flag className="w-4 h-4" />
                                    {currentAnswer?.markedForReview ? 'Unmark Review' : 'Mark for Review'}
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestionIndex - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    className="w-auto px-6"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1 inline" /> Previous
                                </Button>
                                <Button
                                    onClick={() => {
                                        // Save is automatic via state, just move next
                                        if (currentQuestionIndex < questions.length - 1) {
                                            setCurrentQuestion(currentQuestionIndex + 1);
                                        }
                                    }}
                                    disabled={currentQuestionIndex === questions.length - 1}
                                    className="w-auto px-6"
                                >
                                    Save & Next <ChevronRight className="w-4 h-4 ml-1 inline" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Question Palette */}
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg z-20">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        Question Palette
                    </h3>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-4 gap-3">
                        {questions.map((_, idx) => {
                            const status = getQuestionStatus(idx);
                            let bgClass = "bg-gray-100 text-gray-600 border-gray-200"; // not visited
                            if (status === 'current') bgClass = "bg-blue-100 border-blue-500 text-blue-700 ring-2 ring-blue-200";
                            else if (status === 'review') bgClass = "bg-amber-100 border-amber-500 text-amber-700";
                            else if (status === 'answered') bgClass = "bg-green-100 border-green-500 text-green-700";

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQuestion(idx)}
                                    className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm border transition-all ${bgClass}`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-500"></div> Answered
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-500"></div> Marked for Review
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></div> Not Visited
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500 ring-2 ring-blue-200"></div> Current
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-500">
                    Placement Saathi Secure Browser
                </div>
            </div>
        </div>
    );
};

export default LiveTest;
