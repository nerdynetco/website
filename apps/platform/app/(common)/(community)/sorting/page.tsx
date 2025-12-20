// apps/platform/app/(common)/sorting/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getUserHouse } from "~/actions/user.house";
import { useRouter } from "next/navigation";
import {
  getSortingQuestions,
  submitSortingAnswers,
} from "~/actions/user.sorting";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";

interface Question {
  id: number;
  text: string;
  options: Answer[];
}

interface Answer {
  id: number;
  questionId: number;
  text: string;
  house: string;
  score: number;
}

export default function SortingPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [house, setHouse] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const fetchedQuestions = await getSortingQuestions();
        setQuestions(fetchedQuestions);
      } catch (error) {
        toast.error("Failed to load questions.");
        console.error("Error fetching sorting questions:", error);
      } finally {
        setLoading(false);
      }
    }
    async function checkSortingStatus() {
      try {
        const { house: userHouse, isSorted } = await getUserHouse();
        if (isSorted) {
          setHouse(userHouse);
          setLoading(false);
          return;
        }
        fetchQuestions();
      } catch (error) {
        toast.error("Failed to check sorting status.");
        console.error("Error checking sorting status:", error);
        fetchQuestions(); // Proceed to fetch questions if check fails
      }
    }
    checkSortingStatus();
  }, []);

  const handleAnswerChange = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNextQuestion = () => {
    if (selectedAnswers[questions[currentQuestionIndex].id]) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      toast.error("Please select an answer to continue.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswers[questions[currentQuestionIndex].id]) {
      toast.error("Please select an answer to submit.");
      return;
    }

    setSubmitting(true);
    try {
      const answersToSubmit = Object.entries(selectedAnswers).map(
        ([questionId, answerId]) => ({
          questionId: parseInt(questionId),
          answerId: answerId,
        })
      );
      const result = await submitSortingAnswers(answersToSubmit);
      toast.success(`Welcome to ${result.assignedHouse}!`);
      router.push("/"); // Redirect to main app
    } catch (error: any) {
      toast.error(error.message || "Failed to complete sorting.");
      console.error("Error submitting sorting answers:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading status...
      </div>
    );
  }

  if (house) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Welcome Home!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl mb-4">
              You have already been sorted into:
            </p>
            <p className="text-4xl font-extrabold text-primary">
              {house}
            </p>
            <Button onClick={() => router.push("/")} className="mt-6">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        No sorting questions available.
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            The Sorting Hat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 text-center">
            {currentQuestion.text}
          </h3>
          <RadioGroup
            onValueChange={(value) =>
              handleAnswerChange(currentQuestion.id, parseInt(value))
            }
            value={selectedAnswers[currentQuestion.id]?.toString()}
            className="space-y-2"
          >
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id.toString()} id={option.id.toString()} />
                <Label htmlFor={option.id.toString()}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="mt-6 flex justify-end">
            {!isLastQuestion && (
              <Button onClick={handleNextQuestion} disabled={submitting}>
                Next Question
              </Button>
            )}
            {isLastQuestion && (
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Answers"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
