import sys

def modify_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add useEffect
    content = content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";')
    
    # 2. Fix AssignStudents loop
    old_assign_init = '''  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
  }'''
    
    new_assign_init = '''  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (examData?.exam && students && !initialized) {
      const assigned = (examData.exam as any).assignedStudents || [];
      const s = new Set<string>();
      if (assigned.length > 0) {
        assigned.forEach((id: any) => s.add(id.toString()));
      } else {
        students.forEach((st: any) => s.add(st._id));
      }
      setSelectedIds(s);
      setInitialized(true);
    }
  }, [examData, students, initialized]);'''
    content = content.replace(old_assign_init, new_assign_init)

    # 3. Add publishMut and wire Update button
    old_toggleOne = '  const toggleOne = (id: string) => {'
    new_publishMut = '''  const publishMut = trpc.school.publishCBTExam.useMutation({
    onSuccess: () => {
      toast.success("Test Published to Student Dashboard!");
    },
    onError: (err) => toast.error(err.message)
  });

  const toggleOne = (id: string) => {'''
    content = content.replace(old_toggleOne, new_publishMut)
    
    old_handleUpdate = '''  const handleUpdate = () => {
    assignMut.mutate({ examId, studentIds: Array.from(selectedIds) });
  };'''
    new_handleUpdate = '''  const handleUpdate = () => {
    assignMut.mutate({ examId, studentIds: Array.from(selectedIds) }, {
      onSuccess: () => {
        publishMut.mutate({ id: examId, isPublished: true });
      }
    });
  };'''
    content = content.replace(old_handleUpdate, new_handleUpdate)
    
    old_update_btn = '''<button onClick={handleUpdate} disabled={assignMut.isPending} className="bg-[#125c3a] hover:bg-[#0e482d] text-white font-bold px-6 py-2 rounded shadow-sm text-sm">
            {assignMut.isPending ? "Updating..." : "Update"}
          </button>'''
    new_update_btn = '''<button onClick={handleUpdate} disabled={assignMut.isPending || publishMut.isPending} className="bg-[#125c3a] hover:bg-[#0e482d] text-white font-bold px-6 py-2 rounded shadow-sm text-sm">
            {assignMut.isPending || publishMut.isPending ? "Publishing..." : "Publish Test"}
          </button>'''
    content = content.replace(old_update_btn, new_update_btn)
    
    # 4. Add QuestionPicker state and button in ExamEditor
    old_editor_init = '''function ExamEditor({ examId, onBack, onContinue }: { examId: string, onBack: () => void, onContinue: () => void }) {
  const { data, isLoading, refetch } = trpc.school.getCBTExam.useQuery({ id: examId });
  const publishMutation = trpc.school.publishCBTExam.useMutation({
    onSuccess: () => { toast.success("Status updated!"); refetch(); },
    onError: (err) => toast.error(err.message)
  });

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-[#1b4332]" /></div>;
  if (!data?.exam) return <div>Exam not found</div>;'''
    new_editor_init = '''function ExamEditor({ examId, onBack, onContinue }: { examId: string, onBack: () => void, onContinue: () => void }) {
  const { data, isLoading, refetch } = trpc.school.getCBTExam.useQuery({ id: examId });
  const [showPicker, setShowPicker] = useState(false);
  const publishMutation = trpc.school.publishCBTExam.useMutation({
    onSuccess: () => { toast.success("Status updated!"); refetch(); },
    onError: (err) => toast.error(err.message)
  });

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-[#1b4332]" /></div>;
  if (!data?.exam) return <div>Exam not found</div>;'''
    content = content.replace(old_editor_init, new_editor_init)
    
    old_editor_return = '''  return (
    <div className="bg-white rounded border overflow-hidden pb-12">
      <div className="bg-gray-50 border-b p-4">'''
    new_editor_return = '''  return (
    <div className="bg-white rounded border overflow-hidden pb-12">
      {showPicker && <QuestionPicker examId={examId} defaultClass={data.exam.targetClass} defaultSubject={data.exam.subject} onClose={() => { setShowPicker(false); refetch(); }} />}
      <div className="bg-gray-50 border-b p-4">'''
    content = content.replace(old_editor_return, new_editor_return)
    
    old_add_btn = '<button className="px-6 py-2 bg-[#4cc36b] hover:bg-[#3ba355] text-white rounded shadow-sm font-bold text-sm">ADD QUESTIONS</button>'
    new_add_btn = '<button onClick={() => setShowPicker(true)} className="px-6 py-2 bg-[#4cc36b] hover:bg-[#3ba355] text-white rounded shadow-sm font-bold text-sm">ADD QUESTIONS</button>'
    content = content.replace(old_add_btn, new_add_btn)
    
    # 5. Append QuestionPicker
    picker_code = '''
function QuestionPicker({ examId, defaultClass, defaultSubject, onClose }: { examId: string, defaultClass: string, defaultSubject: string, onClose: () => void }) {
  const [targetClass, setTargetClass] = useState(defaultClass || "YEAR 7 PRIMEROSE");
  const [subject, setSubject] = useState(defaultSubject || "ICT");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: questions, isLoading } = trpc.school.listBankQuestions.useQuery({ targetClass, subject });
  const importMut = trpc.school.importBankQuestions.useMutation({
    onSuccess: (data) => { toast.success("Added " + data.count + " questions!"); onClose(); },
    onError: (err) => toast.error(err.message)
  });

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleUpdate = () => {
    if (selectedIds.size === 0) return toast.error("Select at least one question");
    importMut.mutate({ examId, questionIds: Array.from(selectedIds) });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 overflow-y-auto pt-10 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded shadow-2xl relative">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t">
          <h2 className="font-bold text-lg text-gray-800">Select Questions from Bank</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-bold bg-white px-3 py-1 rounded shadow-sm border text-sm">Close</button>
        </div>
        <div className="p-4 border-b flex gap-4 bg-gray-100">
          <select value={targetClass} onChange={e => setTargetClass(e.target.value)} className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]">
            <option>All</option>
            <option>YEAR 7 PRIMEROSE</option>
            <option>YEAR 8 DAFFODIL</option>
            <option>YEAR 9 TULIP</option>
            <option>YEAR 10 VIOLET</option>
          </select>
          <select value={subject} onChange={e => setSubject(e.target.value)} className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#125c3a]">
            <option>All</option>
            <option>ICT</option>
            <option>MATHEMATICS</option>
            <option>ENGLISH</option>
            <option>PHYSICS</option>
          </select>
          <div className="flex-1" />
          <div className="font-bold text-sm flex items-center">Selected: {selectedIds.size}</div>
        </div>
        
        <div className="p-4 min-h-[400px]">
          {isLoading ? <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div> : (
            <div className="space-y-4">
              {questions?.length === 0 && <div className="text-center text-gray-500 py-8">No questions found in the bank for this filter.</div>}
              {questions?.map((q: any) => (
                <div key={q._id} className="flex gap-4 p-4 border rounded hover:border-[#125c3a] cursor-pointer" onClick={() => toggleOne(q._id)}>
                  <input type="checkbox" checked={selectedIds.has(q._id)} onChange={() => toggleOne(q._id)} className="mt-1" />
                  <div>
                    <div dangerouslySetInnerHTML={{ __html: q.questionText }} className="text-sm font-bold text-gray-800" />
                    <div className="text-xs text-gray-500 mt-2">{q.subject} - {q.difficulty || "EASY"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-4 bg-gray-50 rounded-b">
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-6 py-2 rounded shadow-sm text-sm">Cancel</button>
          <button onClick={handleUpdate} disabled={importMut.isPending} className="bg-[#125c3a] hover:bg-[#0e482d] text-white font-bold px-6 py-2 rounded shadow-sm text-sm">
            {importMut.isPending ? "Adding..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
'''
    if 'function QuestionPicker' not in content:
        content += picker_code
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('client/src/pages/TeacherExams.tsx')
