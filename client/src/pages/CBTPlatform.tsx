import { useState, useEffect } from "react";
import { trpc } from "../lib/trpc";
import { useLocation } from "wouter";
import { Clock, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CBTPlatform({ params }: { params: { examId: string } }) {
  const [, setLocation] = useLocation();
  const [examStarted, setExamStarted] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [examData, setExamData] = useState<any>(null);
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startMutation = trpc.studentPortal.startExam.useMutation({
    onSuccess: (data) => {
      setAttemptId(data.attemptId);
      setExamData(data.exam);
      setQuestions(data.questions);
      
      // Initialize answers
      const initAnswers: any = {};
      data.questions.forEach(q => initAnswers[q.id] = null);
      setAnswers(initAnswers);
      
      setTimeLeft(data.exam.durationMinutes * 60);
      setExamStarted(true);
    },
    onError: (err) => {
      alert(err.message);
      setLocation("/dashboard");
    }
  });

  const submitMutation = trpc.studentPortal.submitExam.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setIsSubmitting(false);
    },
    onError: (err) => {
      alert("Failed to submit exam: " + err.message);
      setIsSubmitting(false);
    }
  });

  // Timer Effect
  useEffect(() => {
    if (examStarted && timeLeft !== null && timeLeft > 0 && !result) {
      const timer = setInterval(() => setTimeLeft(prev => prev! - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isSubmitting && !result) {
      handleFinalSubmit();
    }
  }, [examStarted, timeLeft, result]);

  const handleFinalSubmit = () => {
    if (!attemptId) return;
    setIsSubmitting(true);
    const answersArray = Object.keys(answers).map(qId => ({
      questionId: qId,
      selectedOptionIndex: answers[qId]
    }));
    
    submitMutation.mutate({
      attemptId,
      answers: answersArray
    });
  };

  const handleSelectOption = (optIndex: number) => {
    if (result) return;
    setAnswers(prev => ({
      ...prev,
      [questions[currentQIndex].id]: optIndex
    }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white max-w-lg w-full rounded-2xl shadow-sm border p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
            <Clock size={32} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Assessment Portal</h1>
          <p className="text-gray-500 mb-8">You are about to begin a timed CBT assessment. Please ensure you have a stable connection.</p>
          
          <Button 
            className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] h-12 text-lg"
            disabled={startMutation.isPending}
            onClick={() => startMutation.mutate({ examId: params.examId })}
          >
            {startMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Start Exam Now"}
          </Button>
          <button onClick={() => setLocation("/dashboard")} className="mt-4 text-sm text-gray-500 hover:underline">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  if (result) {
    const percentage = Math.round((result.score / result.totalMarks) * 100);
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white max-w-lg w-full rounded-2xl shadow-sm border p-8 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Exam Submitted</h1>
          <p className="text-gray-500 mb-8">Your answers have been successfully recorded and graded.</p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border">
            <div className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Total Score</div>
            <div className="text-5xl font-bold text-[#1b4332] mb-2">{result.score} <span className="text-2xl text-gray-400">/ {result.totalMarks}</span></div>
            <div className={`text-lg font-bold ${percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>{percentage}%</div>
          </div>
          
          <Button onClick={() => setLocation("/dashboard")} className="w-full bg-[#1b4332] hover:bg-[#2d6a4f]">
            <Home size={16} className="mr-2" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-[#fcfdfc] flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-[#1b4332]">{examData.title}</h1>
          <p className="text-xs text-gray-500 font-semibold uppercase">{examData.examType}</p>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-lg border-2 ${timeLeft !== null && timeLeft < 300 ? 'border-red-200 text-red-600 bg-red-50' : 'border-gray-200 text-gray-700'}`}>
          <Clock size={20} className={timeLeft !== null && timeLeft < 300 ? 'animate-pulse' : ''} /> 
          {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left: Question Content */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border p-8 flex-1">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <span className="font-bold text-gray-500 uppercase tracking-wider text-sm">Question {currentQIndex + 1} of {questions.length}</span>
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{currentQ.marks} Marks</span>
            </div>
            
            <h2 className="text-xl text-gray-900 mb-8 leading-relaxed whitespace-pre-wrap">{currentQ.questionText}</h2>
            
            <div className="space-y-3">
              {currentQ.options.map((opt: string, idx: number) => {
                const isSelected = answers[currentQ.id] === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${isSelected ? 'border-[#2d6a4f] bg-[#eef8f3]' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#2d6a4f] bg-[#2d6a4f]' : 'border-gray-300'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className={`text-lg ${isSelected ? 'font-medium text-[#1b4332]' : 'text-gray-700'}`}>{opt}</span>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Nav Buttons */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQIndex(prev => prev - 1)}
              disabled={currentQIndex === 0}
            >
              <ArrowLeft size={16} className="mr-2" /> Previous
            </Button>
            
            {currentQIndex === questions.length - 1 ? (
              <Button 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 size={16} className="mr-2" />}
                Submit Exam
              </Button>
            ) : (
              <Button onClick={() => setCurrentQIndex(prev => prev + 1)}>
                Next <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Right: Question Palette */}
        <div className="bg-white rounded-xl shadow-sm border p-6 h-fit">
          <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wider mb-4 border-b pb-2">Question Map</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== null;
              const isCurrent = currentQIndex === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-10 h-10 rounded text-sm font-bold flex items-center justify-center border-2 transition-colors
                    ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                    ${isAnswered ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]' : 'bg-white text-gray-500 border-gray-200'}
                  `}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
          
          <div className="mt-8 pt-6 border-t flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-500"><div className="w-3 h-3 bg-[#2d6a4f] rounded" /> Answered</div>
            <div className="flex items-center gap-2 text-xs text-gray-500"><div className="w-3 h-3 bg-white border-2 rounded" /> Unanswered</div>
          </div>
        </div>

      </main>
    </div>
  );
}
