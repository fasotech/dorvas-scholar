import { useState } from "react";
import { Plus, Edit, Trash, Eye, Loader2, Circle, Copy, Check, X as CloseIcon } from "lucide-react";
import { trpc } from "../lib/trpc";
import { toast } from "sonner";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import katex from "katex";
import "katex/dist/katex.min.css";

if (typeof window !== "undefined") {
  (window as any).katex = katex;
}

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['formula', 'image'],
    ['clean']
  ],
};

export default function QuestionBank() {
  const [activeView, setActiveView] = useState<"list" | "create">("list");
  const [targetClass, setTargetClass] = useState("YEAR 7 PRIMEROSE");
  const [subject, setSubject] = useState("ICT");

  const { data: questions, isLoading, refetch } = trpc.school.listBankQuestions.useQuery({ targetClass, subject });

  const deleteMut = trpc.school.deleteCBTQuestion.useMutation({
    onSuccess: () => { toast.success("Question deleted"); refetch(); },
    onError: (err) => toast.error(err.message)
  });

  return (
    <div className="flex-1 bg-[#e0f2ec] overflow-auto h-[calc(100vh-64px)]">
      <div className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-emerald-900">Home &middot; Cbt &middot; Question Bank</h1>
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
                  <label className="text-sm font-bold text-gray-700 w-24 text-right">Year Group</label>
                  <select value={targetClass} onChange={e => setTargetClass(e.target.value)} className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]">
                    <option>YEAR 7 PRIMEROSE</option>
                    <option>YEAR EIGHT</option>
                    <option>YEAR NINE</option>
                    <option>All</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-bold text-gray-700 w-24 text-right">Select Subject</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]">
                    <option>ICT</option>
                    <option>Mathematics</option>
                    <option>Social Studies</option>
                    <option>All</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List Panel */}
            <div className="bg-white border rounded shadow-sm">
              <div className="bg-[#125c3a] text-white p-2 text-sm font-bold flex items-center justify-between">
                <span>Question List (ALL Questions)</span>
                <div className="flex gap-2">
                  <button onClick={() => setActiveView("create")} className="bg-[#4bc0c0] hover:bg-[#3a9c9c] px-3 py-1 rounded text-xs font-bold shadow-sm flex items-center gap-1">
                    <Plus size={14} /> New Questions
                  </button>
                  <button className="bg-amber-500 hover:bg-amber-600 px-3 py-1 rounded text-xs font-bold shadow-sm flex items-center gap-1">
                    <Plus size={14} /> Import Questions
                  </button>
                  <select className="text-gray-800 bg-white rounded px-2 text-xs py-1 outline-none"><option>All Questions</option></select>
                  <button className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-bold shadow-sm flex items-center gap-1">
                    Filter
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

              {isLoading ? (
                <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div>
              ) : !questions || questions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No questions found in this bank.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-xs text-gray-500 bg-gray-50 uppercase">
                      <th className="p-3 w-16 text-center font-bold">S/N</th>
                      <th className="p-3 font-bold border-l">Question Information</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q: any, i: number) => (
                      <tr key={q._id} className="border-b hover:bg-gray-50 group">
                        <td className="p-4 text-center align-top text-gray-500 font-bold border-r">{i + 1}</td>
                        <td className="p-4 flex justify-between items-start">
                          <div>
                            <div className="text-gray-800 font-bold text-sm mb-1" dangerouslySetInnerHTML={{ __html: q.questionText }}></div>
                            <div className="text-xs text-gray-500 mb-1">{q.subject} <span className="text-red-400 font-bold">(Multiple Choice Single Answer)</span></div>
                            <div className="flex gap-2 items-center">
                              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">{q.difficulty || 'EASY'}</span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">My Questions</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-xs border text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded font-medium flex items-center gap-1"><Eye size={12}/> Preview</button>
                            <button className="text-xs border text-purple-600 hover:bg-purple-50 px-2 py-1 rounded font-medium flex items-center gap-1"><Edit size={12}/> Edit</button>
                            <button onClick={() => { if(confirm("Delete question?")) deleteMut.mutate({ id: q._id }); }} className="text-xs bg-red-500 text-white hover:bg-red-600 px-2 py-1 rounded font-medium flex items-center gap-1"><Trash size={12}/> Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeView === "create" && (
          <CreateQuestionForm 
            targetClass={targetClass} 
            subject={subject} 
            onBack={() => { setActiveView("list"); refetch(); }} 
          />
        )}
      </div>
    </div>
  );
}

function CreateQuestionForm({ targetClass, subject, onBack }: { targetClass: string, subject: string, onBack: () => void }) {
  const [formClass, setFormClass] = useState(targetClass || "YEAR 7 PRIMEROSE");
  const [formSubject, setFormSubject] = useState(subject || "ICT");
  const [qText, setQText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [difficulty, setDifficulty] = useState("EASY");
  const [topic, setTopic] = useState(subject || "ICT");
  const [tags, setTags] = useState("");
  const [questionType, setQuestionType] = useState("Multiple Choice Single Answer");
  
  const createMut = trpc.school.createBankQuestion.useMutation({
    onSuccess: () => { toast.success("Question added to bank!"); onBack(); },
    onError: (err) => toast.error(err.message)
  });

  const handleSubmit = () => {
    if (!qText.trim()) return toast.error("Question text is required");
    if (options.length < 2) return toast.error("Provide at least 2 options");
    if (options.some(o => !o.trim())) return toast.error("All options must be filled");
    createMut.mutate({
      targetClass: formClass,
      subject: formSubject,
      topic,
      difficulty,
      questionText: qText,
      options,
      correctOptionIndex: correctIdx >= options.length ? 0 : correctIdx,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      questionType
    });
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return toast.error("Minimum 2 options required");
    const newOpts = options.filter((_, i) => i !== idx);
    setOptions(newOpts);
    if (correctIdx === idx) setCorrectIdx(0);
    else if (correctIdx > idx) setCorrectIdx(correctIdx - 1);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  return (
    <div className="bg-white border rounded shadow-sm relative pb-16">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-bold text-gray-700 block mb-1">Class</label>
            <select value={formClass} onChange={e => setFormClass(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]">
              <option>YEAR 7 PRIMEROSE</option>
              <option>YEAR 8 DAFFODIL</option>
              <option>YEAR 9 TULIP</option>
              <option>YEAR 10 VIOLET</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-bold text-gray-700 block mb-1">Subject</label>
            <select value={formSubject} onChange={e => setFormSubject(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]">
              <option>ICT</option>
              <option>MATHEMATICS</option>
              <option>ENGLISH</option>
              <option>PHYSICS</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Question Option Type <span className="text-red-500">*</span></label>
            <select value={questionType} onChange={e => setQuestionType(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#125c3a] text-sm text-gray-700">
              <option>Multiple Choice Single Answer</option>
              <option>True or False</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Question <span className="text-red-500">*</span></label>
            <ReactQuill 
              theme="snow"
              value={qText} 
              onChange={setQText} 
              modules={quillModules}
              className="min-h-[150px] mb-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-100 p-4 rounded border mt-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Difficulty Level <span className="text-red-500">*</span></label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none">
                <option>EASY</option>
                <option>MEDIUM</option>
                <option>HARD</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Is Examination?</label>
              <div className="w-full p-2 border border-gray-300 rounded bg-white text-sm">No</div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Topic <span className="text-red-500">*</span></label>
              <input value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Tags (optional)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags separated by comma" className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]" />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-4">Answer options</label>
            <div className="space-y-3 pl-8">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-4">
                  <input 
                    type="radio" 
                    name="correctOption" 
                    checked={correctIdx === i} 
                    onChange={() => setCorrectIdx(i)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" 
                  />
                  <span className="font-bold text-gray-500 w-4">{String.fromCharCode(65 + i)}</span>
                  <input 
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[i] = e.target.value;
                      setOptions(newOpts);
                    }}
                    placeholder="Answer"
                    className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]"
                  />
                  <button onClick={() => removeOption(i)} className="text-red-500 hover:text-red-700"><CloseIcon size={16} /></button>
                </div>
              ))}
            </div>
            <button onClick={addOption} className="mt-4 ml-8 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs font-bold text-gray-700 flex items-center gap-1">
              + Add Option
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4">
        <button onClick={onBack} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded text-xs shadow-sm">
          Back To Questions
        </button>
      </div>

      <div className="p-4 border-t flex justify-between bg-gray-50 rounded-b mt-8">
        <button onClick={onBack} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 rounded text-sm shadow-sm">Go Back</button>
        <button onClick={handleSubmit} disabled={createMut.isPending} className="bg-[#2d7a9f] hover:bg-[#1f5b7a] text-white font-bold px-8 py-2 rounded text-sm shadow-sm">
          {createMut.isPending ? "SUBMITTING..." : "SUBMIT"}
        </button>
      </div>
    </div>
  );
}
