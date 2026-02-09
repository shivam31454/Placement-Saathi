import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { Trash, Search, FileText, Clock, AlertTriangle } from 'lucide-react';

const ManageTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null); // ID of test being deleted

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const data = await adminService.getAllTests();
            setTests(data.data || []);
        } catch (error) {
            console.error("Error fetching tests:", error);
            alert("Failed to load tests");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (testId) => {
        if (!window.confirm("Are you sure? This will delete the test and all its questions permanently!")) return;

        setDeleteLoading(testId);
        try {
            await adminService.deleteTest(testId);
            setTests(tests.filter(t => t._id !== testId));
            // alert("Test deleted successfully");
        } catch (error) {
            console.error("Error deleting test:", error);
            alert("Failed to delete test");
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredTests = tests.filter(test =>
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Manage Tests</h1>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search tests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {tests.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                    <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white">No tests created yet</h3>
                    <p className="text-gray-400 mt-2">Create your first test from the 'Add Test' page.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTests.map((test) => (
                        <div key={test._id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all flex flex-col h-full">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wide
                                        ${test.subject === 'DBMS' ? 'bg-blue-900/40 text-blue-400' :
                                            test.subject === 'OS' ? 'bg-purple-900/40 text-purple-400' :
                                                'bg-green-900/40 text-green-400'}`}>
                                        {test.subject || 'General'}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(test._id)}
                                        disabled={deleteLoading === test._id}
                                        className="text-gray-500 hover:text-red-500 transition-colors p-1"
                                        title="Delete Test"
                                    >
                                        {deleteLoading === test._id ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                                        ) : (
                                            <Trash size={18} />
                                        )}
                                    </button>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{test.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-4">{test.description}</p>

                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto">
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{test.duration}m</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FileText size={14} />
                                        <span>{test.questions?.length || 0} Qs</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/50 px-6 py-3 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                                <span>Created: {new Date(test.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageTests;
