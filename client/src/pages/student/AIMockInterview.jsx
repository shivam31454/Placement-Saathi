import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Mic, MicOff, Send, Play, Square, Bot, User, Volume2, AlertCircle, Video, Download, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Avatar } from '../../components/Three/Avatar';

const AIMockInterview = () => {
    const [isStarted, setIsStarted] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [volume, setVolume] = useState(0);
    const [micError, setMicError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [selectedGender, setSelectedGender] = useState(null); // 'male' or 'female'

    // Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const [showPlayback, setShowPlayback] = useState(false);
    const [permissionError, setPermissionError] = useState(null);

    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const streamRef = useRef(null);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = 0; i < event.results.length; i++) {
                    finalTranscript += event.results[i][0].transcript;
                }
                setInputText(finalTranscript);
                setMicError('');
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed') {
                    setMicError('Microphone permission denied.');
                    setIsListening(false);
                }
            };
        } else {
            setMicError('Speech recognition not supported in this browser.');
        }

        return () => {
            stopMediaStream();
            if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) { }
            if (synthRef.current) synthRef.current.cancel();
        };
    }, []);

    const stopMediaStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            recordedChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                setVideoBlob(blob);
                setShowPlayback(true);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setPermissionError(null);
        } catch (err) {
            console.error("Error accessing media devices:", err);
            setPermissionError("Camera/Microphone access denied. Recording disabled.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            stopMediaStream();
        }
    };

    // Simulate audio visualizer for fallback
    useEffect(() => {
        let interval;
        if (isListening || isLoading) {
            interval = setInterval(() => {
                setVolume(Math.random() * 100);
            }, 100);
        } else {
            setVolume(0);
        }
        return () => clearInterval(interval);
    }, [isListening, isLoading]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const speak = (text) => {
        if (synthRef.current) {
            synthRef.current.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = synthRef.current.getVoices();

            // Select voice based on gender
            let preferredVoice;
            if (selectedGender === 'male') {
                preferredVoice = voices.find(voice => voice.name.includes('Google US English') || voice.name.includes('David') || voice.name.includes('Male'));
            } else {
                preferredVoice = voices.find(voice => voice.name.includes('Google US English') || voice.name.includes('Samantha') || voice.name.includes('Zira') || voice.name.includes('Female'));
            }

            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            synthRef.current.speak(utterance);
        }
    };

    const startInterview = async () => {
        setIsStarted(true);
        // Start Recording automatically if desired, or let user prompt
        startRecording();

        // Initial greeting
        const greeting = "Hello! I'm your AI Interviewer. I'm ready when you are. Please introduce yourself.";
        addMessage('ai', greeting);
        speak(greeting);
    };

    const endInterview = () => {
        setIsStarted(false);
        stopRecording();
        setSelectedGender(null);
        if (synthRef.current) synthRef.current.cancel();
    };

    const addMessage = (sender, text) => {
        setMessages(prev => [...prev, { sender, text, timestamp: new Date() }]);
    };

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = inputText;
        addMessage('user', userMsg);
        setInputText('');
        setIsListening(false);
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { }
        }

        setIsLoading(true);

        try {
            // Call Backend API
            const response = await api.post('/ai/interview', {
                history: messages, // Send previous context
                message: userMsg
            });

            const aiResponse = response.data.response;
            addMessage('ai', aiResponse);
            speak(aiResponse);

        } catch (error) {
            console.error("AI API Error:", error);
            const errorMsg = "I'm having trouble connecting to my brain. Please try again.";
            addMessage('ai', errorMsg);
            speak(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMic = () => {
        if (!recognitionRef.current) {
            setMicError('Speech recognition initialization failed.');
            return;
        }

        if (!isListening) {
            try {
                if (!inputText) setInputText('');
                recognitionRef.current.start();
                setIsListening(true);
                setMicError('');
            } catch (e) {
                console.error("Failed to start recording", e);
                if (e.message.includes('already started')) {
                    setIsListening(true);
                }
            }
        } else {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg p-6 md:p-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <Link to="/dashboard" className="text-sm text-slate-500 hover:text-primary-600 mb-1 inline-block">← Back to Dashboard</Link>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Bot className="w-8 h-8 text-primary-600" /> AI Mock Interviewer
                        </h1>
                    </div>
                    {isRecording && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-bold animate-pulse">
                            <div className="w-2 h-2 bg-red-600 rounded-full"></div> Recording ON
                        </div>
                    )}
                </div>

                {permissionError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">
                        {permissionError}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                    {/* Left Panel: AI Avatar / Selection */}
                    <Card className="col-span-1 lg:col-span-2 flex flex-col relative overflow-hidden bg-slate-900 text-white border-0">
                        {!selectedGender ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 bg-slate-900/95">
                                <h2 className="text-3xl font-bold mb-8">Choose Your Interviewer</h2>
                                <div className="flex gap-12">
                                    <div
                                        onClick={() => setSelectedGender('male')}
                                        className="group cursor-pointer flex flex-col items-center gap-4 transition-transform hover:scale-105"
                                    >
                                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-slate-700 group-hover:border-primary-500 transition-colors bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-2xl">
                                            <User className="w-24 h-24 text-white" />
                                        </div>
                                        <span className="text-2xl font-semibold">David</span>
                                        <span className="text-sm text-slate-400">Professional Interviewer</span>
                                    </div>
                                    <div
                                        onClick={() => setSelectedGender('female')}
                                        className="group cursor-pointer flex flex-col items-center gap-4 transition-transform hover:scale-105"
                                    >
                                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-slate-700 group-hover:border-primary-500 transition-colors bg-gradient-to-br from-pink-500 to-purple-700 flex items-center justify-center shadow-2xl">
                                            <User className="w-24 h-24 text-white" />
                                        </div>
                                        <span className="text-2xl font-semibold">Sarah</span>
                                        <span className="text-sm text-slate-400">Senior HR Manager</span>
                                    </div>
                                </div>
                            </div>
                        ) : !isStarted ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 bg-slate-900/80">
                                <div className="w-full h-full absolute inset-0 -z-10 opacity-50">
                                    <Canvas shadows camera={{ position: [0, 0, 4], fov: 40 }}>
                                        <Environment preset="city" />
                                        <Avatar gender={selectedGender} isSpeaking={false} />
                                    </Canvas>
                                </div>
                                <h2 className="text-3xl font-bold mb-4 drop-shadow-md">Ready to Practice?</h2>
                                <p className="text-slate-200 mb-8 max-w-md drop-shadow-md font-medium">
                                    I will simulate a real interview using advanced AI. Your session will be recorded for self-review.
                                </p>
                                <Button size="lg" onClick={startInterview} className="px-8 py-4 text-lg shadow-xl">
                                    <Play className="w-5 h-5 mr-2" /> Start Interview
                                </Button>
                                <button onClick={() => setSelectedGender(null)} className="mt-4 text-sm text-slate-300 hover:text-white underline">
                                    Change Interviewer
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 w-full h-full relative">
                                <Canvas shadows camera={{ position: [0, 0, 2.5], fov: 30 }}>
                                    <Environment preset="city" />
                                    <ambientLight intensity={0.5} />
                                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />
                                    <Avatar gender={selectedGender} isSpeaking={isSpeaking} />
                                    <ContactShadows resolution={1024} scale={10} blur={1} opacity={0.5} far={10} color="#8a6246" />
                                    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 2.2} />
                                </Canvas>

                                {isListening && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm backdrop-blur-sm">
                                        Listening to you...
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Right Panel: Chat Interface */}
                    <Card className="col-span-1 flex flex-col h-full border-slate-200 dark:border-slate-800">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Live Transcript</span>
                            {isStarted && (
                                <button
                                    onClick={endInterview}
                                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                                >
                                    End Session
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-slate-400 text-sm mt-10">
                                    Conversation will appear here...
                                </div>
                            )}
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-primary-600 text-white rounded-br-none'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-xl">
                            {micError && (
                                <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {micError}
                                </div>
                            )}
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={toggleMic}
                                    disabled={!isStarted || isLoading}
                                    className={`p-3 rounded-full transition-colors ${isListening
                                        ? 'bg-red-100 text-red-600 animate-pulse'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary-600'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={isLoading ? "AI is thinking..." : "Type your answer..."}
                                    disabled={!isStarted || isLoading}
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-full px-4 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm dark:text-white"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || !isStarted || isLoading}
                                    className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </Card>
                </div>
            </div >

            {/* Playback Modal */}
            <AnimatePresence>
                {showPlayback && videoBlob && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-700"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Video className="w-6 h-6 text-primary-500" /> Session Playback
                                </h3>
                                <button onClick={() => setShowPlayback(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
                                <video
                                    src={URL.createObjectURL(videoBlob)}
                                    controls
                                    className="w-full h-full"
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button variant="ghost" onClick={() => setShowPlayback(false)}>
                                    Close
                                </Button>
                                <a
                                    href={URL.createObjectURL(videoBlob)}
                                    download={`interview-session-${new Date().toISOString()}.webm`}
                                >
                                    <Button variant="primary">
                                        <Download className="w-4 h-4 mr-2" /> Download Recording
                                    </Button>
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div >
    );
};

export default AIMockInterview;
