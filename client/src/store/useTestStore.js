import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTestStore = create(
    persist(
        (set, get) => ({
            activeTest: null,
            questions: [],
            answers: [], // [{ questionId, selectedOption, codeSubmitted, markedForReview }]
            currentQuestionIndex: 0,
            isTestActive: false,

            startTest: (test, questions) => set({
                activeTest: test,
                questions,
                answers: [],
                currentQuestionIndex: 0,
                isTestActive: true
            }),

            setAnswer: (questionId, answerData) => {
                const { answers } = get();
                const existingIndex = answers.findIndex(a => a.questionId === questionId);

                let newAnswers = [...answers];
                if (existingIndex > -1) {
                    newAnswers[existingIndex] = { ...newAnswers[existingIndex], ...answerData };
                } else {
                    newAnswers.push({ questionId, ...answerData });
                }

                set({ answers: newAnswers });
            },

            toggleReview: (questionId) => {
                const { answers } = get();
                const existingIndex = answers.findIndex(a => a.questionId === questionId);

                let newAnswers = [...answers];
                if (existingIndex > -1) {
                    newAnswers[existingIndex].markedForReview = !newAnswers[existingIndex].markedForReview;
                } else {
                    newAnswers.push({ questionId, markedForReview: true });
                }
                set({ answers: newAnswers });
            },

            setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),

            finishTest: () => set({
                activeTest: null,
                questions: [],
                answers: [],
                currentQuestionIndex: 0,
                isTestActive: false
            }),
        }),
        {
            name: 'placement-saathi-test-storage', // name of the item in the storage (must be unique)
            getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
        }
    )
);

export default useTestStore;
