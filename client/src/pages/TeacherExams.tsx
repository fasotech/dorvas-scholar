import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import { trpc } from "../lib/trpc";
import { Loader2, Check, Plus, Edit, Trash, BookOpen, Clock, CheckCircle2, Circle, Copy, Download, Eye, ListFilter } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import katex from "katex";
import "katex/dist/katex.min.css";

// Expose katex to window for Quill's formula module
if (typeof window !== "undefined") {
  (window as any).katex = katex;
}

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image', 'video', 'formula'],
    ['clean']
  ]
};

export default function TeacherExams({ summary }: { summary: any }) {
  const [activeView, setActiveView] = useState<"list" | "create" | "edit" | "assign">("list");
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedExamClass, setSelectedExamClass] = useState<string>("YEAR 7 PRIMEROSE"); 
  const [previewExamId, setPreviewExamId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: exams, refetch } = trpc.school.listCBTExams.useQuery();

  const handleCreated = (id: string, targetClass: string) => {
    toast.success("Exam created successfully!");
    refetch();
    setSelectedExamId(id);
    setSelectedExamClass(targetClass);
    setActiveView("edit"); 
  };

  const handleDownloadPdf = async (examId: string, title: string) => {
    try {
      setIsDownloading(true);
      toast.info("Generating PDF, please wait...");
      setPreviewExamId(examId); // Open preview to render the content for pdf
      
      // Give it time to render the modal fully
      setTimeout(async () => {
        const element = document.getElementById("pdf-content");
        if (!element) {
          toast.error("Could not find content to download");
          setPreviewExamId(null);
          setIsDownloading(false);
          return;
        }
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${title.replace(/\s+/g, "_")}_Questions.pdf`);
        setPreviewExamId(null);
        setIsDownloading(false);
        toast.success("Downloaded successfully!");
      }, 1500);
    } catch (err) {
      toast.error("Failed to generate PDF");
      setPreviewExamId(null);
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#e0f2ec] overflow-auto">
      <div className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-emerald-900">Home &middot; Cbt &middot; Manage CBT</h1>
      </div>
      
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {activeView === "list" && (
          <>
            {/* Top Filter Panel */}
            <div className="bg-white border rounded shadow-sm">
              <div className="bg-[#125c3a] text-white p-2 text-sm font-bold flex items-center gap-2">
                <Circle size={10} fill="white" /> Question Bank Manager
              </div>
              <div className="p-6 flex flex-col gap-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-bold text-gray-700 w-24 text-right">Class</label>
                  <select className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]">
                    <option>YEAR 7 PRIMEROSE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List Panel */}
            <div className="bg-white border rounded shadow-sm">
              <div className="bg-[#125c3a] text-white p-2 text-sm font-bold flex items-center justify-between">
                <span>Test List</span>
                <div className="flex gap-2">
                  <button onClick={() => setActiveView("create")} className="bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded text-xs font-bold shadow-sm flex items-center gap-1">
                    <Plus size={14} /> New Test
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs font-bold shadow-sm flex items-center gap-1">
                    <Copy size={14} /> Clone Test
                  </button>
                </div>
              </div>
              
              <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <select className="border border-gray-300 rounded p-1"><option>10</option></select> records
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  Search: <input className="border border-gray-300 rounded p-1 w-48 focus:outline-none focus:ring-1 focus:ring-[#125c3a]" />
                </div>
              </div>

              {!exams || exams.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No tests available.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-xs text-gray-500 bg-gray-50">
                        <th className="p-3 w-12 text-center">S/N</th>
                        <th className="p-3">Test Information</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.map((exam: any, i: number) => (
                        <tr key={exam._id} className="border-b hover:bg-gray-50">
                          <td className="p-4 text-center align-top font-bold text-gray-500">{i + 1}</td>
                          <td className="p-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-bold text-gray-800">{exam.title} <span className="font-normal text-gray-500">{exam.targetClass}</span></div>
                                  <div className="flex gap-4 mt-2">
                                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                                      <Clock size={10}/> Duration (mins): {exam.durationMinutes || 30}
                                    </span>
                                    <span className="text-xs font-bold text-gray-500 bg-indigo-50 px-2 py-0.5 rounded">Total Qs: 0</span>
                                    <span className="text-xs font-bold text-gray-500 bg-amber-50 px-2 py-0.5 rounded">Total Mrks: 0</span>
                                  </div>
                                  <div className="mt-2">
                                    <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Published</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs font-bold text-gray-500 mb-2">
                                    {exam.startAt ? format(new Date(exam.startAt), "M/d/yyyy, h:mm:ss a") : "Not set"} - {exam.endAt ? format(new Date(exam.endAt), "M/d/yyyy, h:mm:ss a") : "Not set"}
                                  </div>
                                  <div className="flex gap-1 justify-end">
                                    <button disabled={isDownloading} onClick={() => handleDownloadPdf(exam._id, exam.title)} className="text-xs border text-blue-600 hover:bg-blue-50 px-2 py-1 rounded font-medium flex items-center gap-1"><Download size={12}/> Download</button>
                                    <button onClick={() => setPreviewExamId(exam._id)} className="text-xs border text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded font-medium flex items-center gap-1"><Eye size={12}/> Preview</button>
                                    <button onClick={() => { 
                                      setSelectedExamId(exam._id); 
                                      setSelectedExamClass(exam.targetClass || "YEAR 7 PRIMEROSE");
                                      setActiveView("edit"); 
                                    }} className="text-xs border text-purple-600 hover:bg-purple-50 px-2 py-1 rounded font-medium flex items-center gap-1"><Edit size={12}/> Edit</button>
                                    <button onClick={() => { 
                                      setSelectedExamId(exam._id); 
                                      setSelectedExamClass(exam.targetClass || "YEAR 7 PRIMEROSE");
                                      setActiveView("assign"); 
                                    }} className="text-xs border text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded font-medium flex items-center gap-1"><Check size={12}/> Assign</button>
                                    <button className="text-xs border text-red-600 hover:bg-red-50 px-2 py-1 rounded font-medium flex items-center gap-1"><Trash size={12}/> Delete</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeView === "create" && (
          <CreateExamForm onCreated={handleCreated} onCancel={() => setActiveView("list")} />
        )}
        
        {activeView === "edit" && selectedExamId && (
          <ExamEditor 
            examId={selectedExamId} 
            onBack={() => { setActiveView("list"); refetch(); }} 
            onContinue={() => setActiveView("assign")} 
          />
        )}

        {activeView === "assign" && selectedExamId && (
          <AssignStudents 
            examId={selectedExamId}
            targetClass={selectedExamClass}
            onBack={() => { setActiveView("list"); refetch(); }} 
          />
        )}
      </div>

      {/* Preview Modal */}
      {previewExamId && (
        <PreviewModal 
          examId={previewExamId} 
          onClose={() => setPreviewExamId(null)} 
          isDownloading={isDownloading} 
        />
      )}
    </div>
  );
}

function CreateExamForm({ onCreated, onCancel }: { onCreated: (id: string, targetClass: string) => void, onCancel: () => void }) {
  const createMutation = trpc.school.createCBTExam.useMutation({
    onSuccess: (data) => onCreated(data._id, "YEAR 7 PRIMEROSE"),
    onError: (err) => toast.error(err.message)
  });

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    marksPerQuestion: 1,
    randomQuestionSelection: false,
    isPracticeTest: false,
    startAt: "",
    endAt: "",
    durationHours: 0,
    durationMinutes: 30,
    shuffleQuestions: false,
    shuffleAnswers: false,
    allowViewCorrectAnswers: false,
    publishResultAutomatically: false,
    instructions: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      subject: "ICT",
      targetClass: "YEAR 7 PRIMEROSE"
    });
  };

  return (
    <div className="bg-white rounded border overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide text-sm">Year 7 Primerose (ICT)</h2>
        <button onClick={onCancel} className="text-sm font-medium text-gray-500 hover:text-gray-800">Cancel</button>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
          <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Home Test" className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Code <span className="text-red-500">*</span></label>
          <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="Test" className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Marks Per Question <span className="text-red-500">*</span></label>
          <input type="number" required value={formData.marksPerQuestion} onChange={e => setFormData({...formData, marksPerQuestion: Number(e.target.value)})} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]" />
        </div>

        <div className="flex gap-12">
          <Switch label="Enable Random Question Selection ?" checked={formData.randomQuestionSelection} onChange={c => setFormData({...formData, randomQuestionSelection: c})} />
        </div>
        <div className="flex gap-12">
          <Switch label="Enable Practice Test ?" checked={formData.isPracticeTest} onChange={c => setFormData({...formData, isPracticeTest: c})} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Start Date And Time <span className="text-red-500">*</span></label>
            <input type="datetime-local" required value={formData.startAt} onChange={e => setFormData({...formData, startAt: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">End Date And Time <span className="text-red-500">*</span></label>
            <input type="datetime-local" required value={formData.endAt} onChange={e => setFormData({...formData, endAt: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]" />
          </div>
        </div>

        <div className="border-t pt-4">
          <label className="block text-sm font-bold text-gray-700 mb-3 text-red-500">Duration *</label>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Hours</label>
              <input type="number" min="0" value={formData.durationHours} onChange={e => setFormData({...formData, durationHours: Number(e.target.value)})} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Minutes</label>
              <input type="number" min="0" max="59" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: Number(e.target.value)})} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          <Switch label="Shuffle Questions" checked={formData.shuffleQuestions} onChange={c => setFormData({...formData, shuffleQuestions: c})} />
          <Switch label="Shuffle Answer" checked={formData.shuffleAnswers} onChange={c => setFormData({...formData, shuffleAnswers: c})} />
          <Switch label="Allow to view correct answers" checked={formData.allowViewCorrectAnswers} onChange={c => setFormData({...formData, allowViewCorrectAnswers: c})} />
          <Switch label="Publish Result Automatically" checked={formData.publishResultAutomatically} onChange={c => setFormData({...formData, publishResultAutomatically: c})} />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Instructions</label>
          <div className="bg-white">
            <ReactQuill
              theme="snow"
              value={formData.instructions}
              onChange={(val) => setFormData({...formData, instructions: val})}
              modules={quillModules}
              className="min-h-[150px]"
              placeholder="Enter exam instructions, math formulas, or image references here..."
            />
          </div>
        </div>

        <div className="pt-4 border-t flex gap-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded shadow-sm font-bold text-sm">Go Back</button>
          <div className="flex-1" />
          <button type="submit" disabled={createMutation.isPending} className="px-8 py-2 bg-[#2d7a9f] hover:bg-[#1f5b7a] text-white rounded shadow-sm font-bold text-sm">
            {createMutation.isPending ? "Submitting..." : "SUBMIT"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ExamEditor({ examId, onBack, onContinue }: { examId: string, onBack: () => void, onContinue: () => void }) {
  const { data, isLoading, refetch } = trpc.school.getCBTExam.useQuery({ id: examId });
  const publishMutation = trpc.school.publishCBTExam.useMutation({
    onSuccess: () => { toast.success("Status updated!"); refetch(); },
    onError: (err) => toast.error(err.message)
  });

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-[#1b4332]" /></div>;
  if (!data?.exam) return <div>Exam not found</div>;

  const totalAssigned = data.questions?.length || 0;
  const marksPerQuestion = data.exam.marksPerQuestion || 1;
  const totalMarkAssigned = totalAssigned * marksPerQuestion;

  return (
    <div className="space-y-6">
      {/* Top Filter Panel - Question Bank style */}
      <div className="bg-white rounded border overflow-hidden">
        <div className="bg-[#125c3a] text-white px-4 py-2 text-sm font-semibold">
          Advanced Search Filter (Question Bank)
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 border-b">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-600 w-32 text-right">Select Subject:</label>
            <select className="flex-1 border p-2 text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#125c3a]">
              <option>{data.exam.subject}</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-600 w-32 text-right">Question Source:</label>
            <select className="flex-1 border p-2 text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#125c3a]">
              <option>Question Bank</option>
            </select>
          </div>
          <div className="flex items-center gap-4 md:col-span-2 justify-center mt-2">
            <button className="bg-[#2d7a9f] hover:bg-[#1f5b7a] text-white px-6 py-2 rounded text-sm font-bold shadow-sm flex items-center gap-2">
              <ListFilter size={16} /> Search
            </button>
          </div>
        </div>

        <div className="p-6 flex justify-between items-end bg-white border-b">
          <div className="text-sm text-gray-600">
            <div>Marks Assigned: <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">{marksPerQuestion}</span></div>
            <div className="mt-1">Total Questions Assigned: <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">{totalAssigned}</span></div>
          </div>
          <div className="text-sm text-gray-600 text-right">
            <div>Subject Marks Assigned: <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">{totalMarkAssigned}</span></div>
            <div className="mt-1">Subject Questions Assigned: <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">{totalAssigned}</span></div>
          </div>
        </div>

        <div className="bg-gray-100 text-gray-600 px-4 py-2 text-sm font-semibold flex items-center gap-2 border-b">
          <ListFilter size={16} /> Select Questions for {data.exam.title}
        </div>

        <div className="p-4 flex justify-between items-center text-sm border-b">
          <div>
            <select className="border p-1 rounded mr-2"><option>10</option></select> records
          </div>
          <div>
            Search: <input className="border p-1 rounded ml-2 focus:outline-none focus:ring-1 focus:ring-[#125c3a]" />
          </div>
        </div>

        <div className="p-6 space-y-4">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="px-4 py-3 w-12 text-center">S/N</th>
                <th className="px-4 py-3">Question Information</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.questions?.map((q: any, i: number) => (
                <tr key={q._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-center align-top text-gray-500 font-bold">{i + 1}</td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-800 mb-2" dangerouslySetInnerHTML={{ __html: q.questionText }}></div>
                    <div className="text-xs text-gray-500 mb-3">
                      <span className="text-[#125c3a] font-bold">ICT</span> <span className="text-gray-400">(Multiple Choice Single Answer)</span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">EASY</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">My Questions</span>
                      <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-xs font-bold">{data.exam.targetClass}</span>
                    </div>
                    <div className="flex justify-end items-center gap-3 mt-4">
                      <button className="text-xs border text-gray-600 hover:bg-gray-100 px-2 py-1 rounded font-medium flex items-center gap-1"><Eye size={12}/> Preview</button>
                      <span className="text-xs font-bold text-gray-600">{q.marks || 1}mrk(s)</span>
                      <DeleteQuestionButton id={q._id} onDeleted={refetch} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <AddQuestionForm examId={examId} onAdded={refetch} defaultMarks={marksPerQuestion} />
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#4667af] text-white p-4 flex justify-between items-center">
          <div className="font-semibold">Total Question Assigned</div>
          <div className="font-semibold">Total Mark Assigned <span className="bg-white text-[#4667af] px-2 py-0.5 rounded-full text-xs ml-2">{totalMarkAssigned}</span></div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 flex gap-4 bg-gray-50">
          <button type="button" onClick={onBack} className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded shadow-sm font-bold text-sm">Go Back</button>
          <div className="flex-1" />
          <button className="px-6 py-2 bg-[#2d7a9f] hover:bg-[#1f5b7a] text-white rounded shadow-sm font-bold text-sm">UPDATE</button>
          <button className="px-6 py-2 bg-[#4cc36b] hover:bg-[#3ba355] text-white rounded shadow-sm font-bold text-sm">ADD QUESTIONS</button>
          <button onClick={onContinue} className="px-6 py-2 bg-[#4bc0c0] hover:bg-[#3a9c9c] text-white rounded shadow-sm font-bold text-sm">Continue</button>
        </div>
      </div>
    </div>
  );
}

function AssignStudents({ examId, onBack, targetClass }: { examId: string, onBack: () => void, targetClass: string }) {
  const { data: students, isLoading } = trpc.school.getStudentsByClass.useQuery({ className: targetClass });
  const { data: examData } = trpc.school.getCBTExam.useQuery({ id: examId });
  const assignMut = trpc.school.assignStudentsToCBTExam.useMutation({
    onSuccess: () => {
      toast.success("Students assigned successfully!");
    },
    onError: (err) => toast.error(err.message)
  });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Initialize selected from DB
  if (examData?.exam && selectedIds.size === 0 && students && assignMut.isIdle) {
    const assigned = (examData.exam as any).assignedStudents || [];
    if (assigned.length > 0) {
      const s = new Set<string>();
      assigned.forEach((id: any) => s.add(id.toString()));
      setSelectedIds(s);
    } else {
      // Default all
      const s = new Set<string>();
      students.forEach((st: any) => s.add(st._id));
      setSelectedIds(s);
    }
  }

  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const s = new Set<string>();
      students?.forEach((st: any) => s.add(st._id));
      setSelectedIds(s);
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleUpdate = () => {
    assignMut.mutate({ examId, studentIds: Array.from(selectedIds) });
  };

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div>;

  return (
    <div className="bg-white border rounded">
      <div className="bg-[#125c3a] text-white font-bold p-3 text-sm flex gap-8">
        <span>TEST / ASSIGNMENT DETAILS</span>
        <span>ASSIGN QUESTIONS</span>
        <span className="border-b-2 border-white pb-1">STUDENTS</span>
      </div>
      <div className="bg-emerald-50 text-emerald-800 font-bold text-center text-sm p-2 border-b">
        Total Assigned: <span className="bg-white text-emerald-800 px-2 py-0.5 rounded">{selectedIds.size}</span> Current Class Total: <span className="bg-white text-emerald-800 px-2 py-0.5 rounded">{students?.length || 0}</span>
      </div>
      
      <div className="p-4">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
            <tr>
              <th className="p-3 w-10 text-center"><input type="checkbox" onChange={toggleAll} checked={students?.length! > 0 && selectedIds.size === students?.length} /></th>
              <th className="p-3 w-16 text-center border-l">#</th>
              <th className="p-3 text-left border-l">Student Name</th>
              <th className="p-3 text-left border-l w-48">Student Class</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {students?.map((s: any, i: number) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-center"><input type="checkbox" checked={selectedIds.has(s._id)} onChange={() => toggleOne(s._id)} /></td>
                <td className="p-3 text-center text-gray-500 border-l">{i + 1}</td>
                <td className="p-3 font-medium text-gray-800 border-l uppercase">{s.firstName} {s.lastName}</td>
                <td className="p-3 text-gray-600 border-l uppercase">{s.class}</td>
              </tr>
            ))}
            {students?.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">No students found in this class.</td></tr>}
          </tbody>
        </table>
        
        <div className="mt-4 flex justify-between">
          <button onClick={onBack} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 rounded shadow-sm text-sm">Go Back</button>
          <button onClick={handleUpdate} disabled={assignMut.isPending} className="bg-[#125c3a] hover:bg-[#0e482d] text-white font-bold px-6 py-2 rounded shadow-sm text-sm">
            {assignMut.isPending ? "Updating..." : "Update"}
          </button>
        </div>
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
    <button onClick={() => { if(confirm("Remove this question?")) mut.mutate({ id }) }} className="text-xs bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 rounded font-bold flex items-center gap-1 shadow-sm">
      <Trash size={12} /> Remove
    </button>
  );
}

function AddQuestionForm({ examId, onAdded, defaultMarks }: { examId: string, onAdded: () => void, defaultMarks: number }) {
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
    mut.mutate({ examId, questionText: qText, options, correctOptionIndex: correct, marks: defaultMarks });
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 border-dashed border-[#125c3a]/30 rounded p-6 bg-emerald-50/30 mt-8">
      <h4 className="font-bold text-[#125c3a] mb-4 flex items-center gap-2"><Plus size={18} /> Quick Add Question</h4>
      <div className="mb-4 bg-white rounded">
        <ReactQuill 
          theme="snow"
          value={qText} 
          onChange={setQText} 
          modules={quillModules}
          placeholder="Type your question here (supports images and math formulas)..." 
          className="min-h-[100px]"
        />
      </div>
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
              className={`flex-1 p-2 border text-sm rounded outline-none focus:ring-1 focus:ring-[#125c3a] ${correct === i ? 'border-[#125c3a] bg-white' : 'border-gray-300 bg-white'}`}
            />
          </div>
        ))}
      </div>
      <button type="submit" disabled={mut.isPending} className="px-6 py-2 bg-[#4cc36b] text-white font-bold rounded shadow-sm hover:bg-[#3ba355] transition-colors disabled:opacity-50 text-sm">
        {mut.isPending ? "Adding..." : "+ Add to Test"}
      </button>
    </form>
  );
}

const Switch = ({ checked, onChange, label }: { checked: boolean, onChange: (c: boolean) => void, label?: string }) => (
  <div className="flex flex-col gap-1 items-start">
    {label && <label className="text-xs font-bold text-gray-700">{label}</label>}
    <button 
      type="button" 
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-sm flex items-center px-1 transition-colors relative ${checked ? 'bg-[#125c3a] justify-end' : 'bg-red-500 justify-start'}`}
    >
      <div className="w-4 h-4 bg-white rounded-sm shadow-sm z-10" />
      <span className={`absolute text-[10px] text-white font-bold px-1.5 pointer-events-none ${checked ? 'left-0' : 'right-0'}`}>
        {checked ? 'ON' : 'OFF'}
      </span>
    </button>
  </div>
);

function PreviewModal({ examId, onClose, isDownloading }: { examId: string, onClose: () => void, isDownloading: boolean }) {
  const { data, isLoading } = trpc.school.getCBTExam.useQuery({ id: examId });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg flex items-center gap-2"><Loader2 className="animate-spin"/> Loading preview...</div>
      </div>
    );
  }

  if (!data?.exam) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 overflow-y-auto pt-10 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded shadow-2xl relative">
        {!isDownloading && (
          <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t">
            <h2 className="font-bold text-lg text-gray-800">Exam Preview: {data.exam.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-bold bg-white px-3 py-1 rounded shadow-sm border text-sm">Close</button>
          </div>
        )}
        
        <div id="pdf-content" className="p-10 bg-white">
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
            <h1 className="text-2xl font-black uppercase tracking-wider mb-2">{data.exam.title}</h1>
            <p className="font-bold text-gray-600 text-lg uppercase">{data.exam.subject} - {data.exam.targetClass}</p>
            <div className="flex justify-center gap-6 mt-4 font-bold text-sm">
              <span>Time: {data.exam.durationHours ? `${data.exam.durationHours}h ` : ''}{data.exam.durationMinutes}m</span>
              <span>Marks per Question: {data.exam.marksPerQuestion}</span>
              <span>Total Questions: {data.questions.length}</span>
            </div>
          </div>
          
          {data.exam.instructions && data.exam.instructions !== "<p><br></p>" && (
            <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded">
              <h3 className="font-bold text-sm mb-2 text-gray-800 uppercase tracking-wider underline">Instructions:</h3>
              <div dangerouslySetInnerHTML={{ __html: data.exam.instructions }} className="text-sm prose max-w-none" />
            </div>
          )}

          <div className="space-y-8">
            {data.questions.map((q: any, i: number) => (
              <div key={q._id} className="break-inside-avoid">
                <div className="flex gap-4">
                  <div className="font-bold text-lg pt-0.5">{i + 1}.</div>
                  <div className="flex-1">
                    <div className="text-base mb-3 font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: q.questionText }}></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                      {q.options.map((opt: string, optIdx: number) => (
                        <div key={optIdx} className="flex gap-3 text-sm">
                          <span className="font-bold text-gray-700">{String.fromCharCode(65 + optIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-300 text-center text-xs text-gray-400 font-medium">
            End of Document - Generated by GreenLedger
          </div>
        </div>
      </div>
    </div>
  );
}
