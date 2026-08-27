import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Loader2, Plus, Edit, Trash, BookOpen, Clock, Play, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function TeacherExams({ summary }: { summary: any }) {
  const [activeView, setActiveView] = useState<"list" | "create" | "edit">("list");
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  const { data: exams, isLoading, refetch } = trpc.school.listCBTExams.useQuery();
  const queryClient = useQueryClient();

  const createMutation = trpc.school.createCBTExam.useMutation({
    onSuccess: (data) => {
      toast.success("Exam created successfully!");
      setSelectedExamId(data._id);
      setActiveView("edit");
      refetch();
    },
    onError: (err) => toast.error(err.message)
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMutation.mutate({
      title: fd.get("title") as string,
      subject: fd.get("subject") as string,
      targetClass: fd.get("targetClass") as string,
      durationMinutes: Number(fd.get("durationMinutes"))
    });
  };

  return (
    <div className="bg-[#fcfdfc] min-h-full p-8 font-sans">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Assessments & CBT</h1>
          <p className="text-gray-500 mt-2">Create and manage your exams.</p>
        </div>
        {activeView === "list" && (
          <button onClick={() => setActiveView("create")} className="flex items-center px-4 py-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white rounded-lg transition-colors font-medium text-sm">
            <Plus size={18} className="mr-2" /> Create New Exam
          </button>
        )}
      </div>

      {activeView === "list" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>
          ) : !exams?.length ? (
            <div className="p-12 text-center text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
              <p>No exams created yet.</p>
              <button onClick={() => setActiveView("create")} className="text-[#1b4332] font-semibold hover:underline mt-2">Create your first exam</button>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr><th className="px-6 py-4">Exam Title</th><th className="px-6 py-4">Subject & Class</th><th className="px-6 py-4">Duration</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {exams.map((exam: any) => (
                  <tr key={exam._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800">{exam.title}</td>
                    <td className="px-6 py-4 text-gray-600">{exam.subject} <span className="opacity-50 mx-1">•</span> {exam.targetClass}</td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-1"><Clock size={14} className="opacity-50"/> {exam.durationMinutes}m</td>
                    <td className="px-6 py-4">
                      {exam.isPublished ? (
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Published</span>
                      ) : (
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setSelectedExamId(exam._id); setActiveView("edit"); }} className="text-[#1b4332] font-semibold hover:underline">Manage Questions</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : activeView === "create" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
           <button onClick={() => setActiveView("list")} className="px-4 py-2 border border-gray-200 rounded-lg mb-6 text-sm font-medium hover:bg-gray-50">Back to Exams</button>
           <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New CBT Exam</h2>
           
           <form onSubmit={handleCreate} className="space-y-5">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Exam Title</label>
               <input name="title" required placeholder="e.g. Mid-Term Mathematics Test" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b4332] outline-none" />
             </div>
             <div className="grid grid-cols-2 gap-5">
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                 <input name="subject" required placeholder="e.g. Mathematics" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b4332] outline-none" />
               </div>
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">Target Class</label>
                 <input name="targetClass" required placeholder="e.g. JSS 1" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b4332] outline-none" />
               </div>
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Duration (Minutes)</label>
               <input name="durationMinutes" type="number" required defaultValue="45" min="5" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b4332] outline-none" />
             </div>
             <button type="submit" disabled={createMutation.isPending} className="w-full py-3 bg-[#1b4332] text-white rounded-lg font-bold hover:bg-[#2d6a4f] transition-colors disabled:opacity-70 mt-4">
               {createMutation.isPending ? "Saving..." : "Create Exam"}
             </button>
           </form>
        </div>
      ) : (
        <ExamEditor examId={selectedExamId!} onBack={() => { setActiveView("list"); refetch(); }} />
      )}
    </div>
  );
}

function ExamEditor({ examId, onBack }: { examId: string, onBack: () => void }) {
  const { data, isLoading, refetch } = trpc.school.getCBTExam.useQuery({ id: examId });
  const publishMutation = trpc.school.publishCBTExam.useMutation({
    onSuccess: () => { toast.success("Status updated!"); refetch(); },
    onError: (err) => toast.error(err.message)
  });

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-[#1b4332]" /></div>;
  if (!data?.exam) return <div>Exam not found</div>;

  return (
    <div className="flex gap-8">
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-start justify-between mb-8 border-b border-gray-100 pb-6">
          <div>
            <button onClick={onBack} className="text-sm font-medium text-gray-500 hover:text-gray-800 mb-4 inline-block">← Back to Exams</button>
            <h2 className="text-2xl font-bold text-gray-900">{data.exam.title}</h2>
            <div className="flex gap-4 mt-2 text-sm text-gray-600 font-medium">
              <span>{data.exam.subject}</span>
              <span className="opacity-30">•</span>
              <span>{data.exam.targetClass}</span>
              <span className="opacity-30">•</span>
              <span>{data.exam.durationMinutes} mins</span>
            </div>
          </div>
          <button 
            onClick={() => publishMutation.mutate({ id: examId, isPublished: !data.exam.isPublished })}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${data.exam.isPublished ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
          >
            {data.exam.isPublished ? 'Unpublish Exam' : 'Publish to Students'}
          </button>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center justify-between">
          <span>Questions ({data.questions?.length || 0})</span>
        </h3>

        <div className="space-y-4 mb-8">
          {data.questions?.map((q: any, i: number) => (
            <div key={q._id} className="p-5 border border-gray-100 rounded-lg bg-gray-50 group relative">
              <div className="font-bold text-gray-800 mb-3 flex items-start gap-2">
                <span className="text-gray-400 font-normal">{i+1}.</span> {q.questionText}
              </div>
              <div className="space-y-2 pl-6">
                {q.options.map((opt: string, optIdx: number) => (
                  <div key={optIdx} className={`flex items-center gap-2 text-sm ${optIdx === q.correctOptionIndex ? 'text-emerald-700 font-bold' : 'text-gray-600'}`}>
                    {optIdx === q.correctOptionIndex ? <CheckCircle2 size={16} /> : <Circle size={16} className="opacity-30" />}
                    {opt}
                  </div>
                ))}
              </div>
              <DeleteQuestionButton id={q._id} onDeleted={refetch} />
            </div>
          ))}
        </div>

        <AddQuestionForm examId={examId} onAdded={refetch} />
      </div>
    </div>
  );
}

function DeleteQuestionButton({ id, onDeleted }: { id: string, onDeleted: () => void }) {
  const mut = trpc.school.deleteCBTQuestion.useMutation({
    onSuccess: () => { toast.success("Question deleted"); onDeleted(); },
    onError: (err) => toast.error(err.message)
  });
  return (
    <button onClick={() => { if(confirm("Delete this question?")) mut.mutate({ id }) }} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
      <Trash size={16} />
    </button>
  );
}

function AddQuestionForm({ examId, onAdded }: { examId: string, onAdded: () => void }) {
  const [qText, setQText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);

  const mut = trpc.school.addCBTQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question added!");
      setQText("");
      setOptions(["", "", "", ""]);
      setCorrect(0);
      onAdded();
    },
    onError: (err) => toast.error(err.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (options.some(o => !o.trim())) return toast.error("All 4 options must be filled");
    mut.mutate({ examId, questionText: qText, options, correctOptionIndex: correct, marks: 1 });
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-white">
      <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Plus size={18} /> Add New Question</h4>
      <textarea 
        value={qText} onChange={e => setQText(e.target.value)} required
        placeholder="Type your question here..." 
        className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-[#1b4332] outline-none min-h-[80px]"
      />
      <div className="grid grid-cols-2 gap-4 mb-4">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-3">
            <input 
              type="radio" name="correctOption" checked={correct === i} onChange={() => setCorrect(i)}
              className="w-4 h-4 text-emerald-600"
            />
            <input 
              value={opt} onChange={e => { const newOpts = [...options]; newOpts[i] = e.target.value; setOptions(newOpts); }} required
              placeholder={`Option ${['A','B','C','D'][i]}`}
              className={`flex-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-[#1b4332] ${correct === i ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
            />
          </div>
        ))}
      </div>
      <button type="submit" disabled={mut.isPending} className="px-6 py-2.5 bg-[#1b4332] text-white font-bold rounded-lg hover:bg-[#2d6a4f] transition-colors disabled:opacity-50">
        {mut.isPending ? "Saving..." : "Save Question"}
      </button>
    </form>
  );
}
