// app/quiz/QuizSection.js
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GlobalApi from "@/app/api/_services/GlobalApi";
import LoadingSpinner from "@/app/_components/LoadingSpinner";
import { toast } from "react-hot-toast";
import Modal from "@/app/_components/Modal";
import { Button } from "@/components/ui/button";
import { useChildren } from "@/context/CreateContext";

const QuizSection = () => {
  const { slug } = useParams();
  const router = useRouter();
  const { selectedChildId } = useChildren();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch quiz data on component mount
  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      try {
        const response = await GlobalApi.GetQuizData({ slug });
        setQuestions(response.data.questions);
        setCompleted(response.data.completed);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        toast.error("Failed to fetch quiz data.");
      }
    };

    fetchQuizData();
  }, [slug,selectedChildId]);

  // Function to handle submitting answers
  const handleSubmitQuiz = async () => {
    const answers = questions.map((question, index) => ({
      questionId: question.id,
      selectedOptions: userAnswers[index] ? [userAnswers[index]] : [],
    }));

    try {
      await GlobalApi.SubmitQuizAnswers({
        childId: selectedChildId,
        answers,
      });
      toast.success("Quiz submitted successfully!");
      router.push(`/learn/${slug}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 bg-[#0f6574] rounded-md">
      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-lg font-semibold">
            Continue from where you left off?
          </h3>
          <Button onClick={() => setModalOpen(false)}>Continue</Button>
          <Button
            onClick={() => {
              setUserAnswers({});
              setModalOpen(false);
            }}
          >
            Start Fresh
          </Button>
        </Modal>
      )}
      <h2 className="text-center text-2xl font-bold text-[#e0f7fa]">
        {completed ? "Continue your quiz" : "Start the quiz"}
      </h2>
      <div className="mt-4 bg-[#e0f7fa] p-3 rounded-md">
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <h4 className="font-semibold">{question.question_text}</h4>
            <div>
              {question.options.map((option) => (
                <label key={option.id} className="block">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option.id}
                    onChange={() =>
                      setUserAnswers((prev) => ({
                        ...prev,
                        [index]: option.id,
                      }))
                    }
                  />
                  {option.option_text}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={handleSubmitQuiz}
          className="w-full p-2 bg-[#0f6574] text-white rounded"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizSection;
