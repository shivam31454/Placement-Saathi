import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useTestStore from '../../store/useTestStore';
import Button from '../../components/ui/Button';
import { Clock, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

const TestInstructions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const { startTest } = useTestStore();

    useEffect(() => {
        const fetchTestHeader = async () => {
            try {
                const res = await api.get(`/tests/${id}`);
                setTest(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTestHeader();
    }, [id]);

    const handleStart = () => {
        // Extract questions from test object for the store
        const questionsList = test.questions.map(q => ({
            ...q.questionId,
            marks: q.marks
        }));

        startTest(test, questionsList);
        navigate(`/test/${id}/live`);
    };

    if (loading) return <div className="p-8 text-center">Loading Instructions...</div>;
    if (!test) return <div className="p-8 text-center text-red-500">Test not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
            <div className="bg-white max-w-2xl w-full rounded-xl shadow-lg overflow-hidden">
                <div className="bg-primary p-6 text-white text-center">
                    <h1 className="text-2xl font-bold">{test.title}</h1>
                    <p className="opacity-90 mt-2">{test.description}</p>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Instructions</h2>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-700">Duration</p>
                                <p className="text-sm text-gray-500">The total duration of this test is <span className="font-bold text-gray-800">{test.duration} minutes</span>.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-700">Question Format</p>
                                <p className="text-sm text-gray-500">This test contains {test.questions.length} questions (MCQ & Coding).</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-700">Warnings</p>
                                <p className="text-sm text-gray-500">Do not switch tabs or minimize the browser. Doing so may result in auto-submission.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-700">Marking Scheme</p>
                                <p className="text-sm text-gray-500">MCQs: +5 marks. Coding: +10 marks. No negative marking.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600 mb-8">
                        By clicking "Start Test", you agree to the rules and regulations. The timer will start immediately.
                    </div>

                    <Button onClick={handleStart} className="w-full text-lg py-3">
                        Start Test Now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TestInstructions;
