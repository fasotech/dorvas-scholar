const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

const dynamicForm = `
function CreatePanel({ section, label, onClose }: { section: string; label: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const mutation = trpc.school.createRecord.useMutation({
    onSuccess: () => {
      toast.success(label + " created successfully!");
      queryClient.invalidateQueries({ queryKey: [["school", "records"]] });
      queryClient.invalidateQueries({ queryKey: [["school", "dashboard"]] });
      onClose();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const [formData, setFormData] = useState<Record<string, string>>({});

  // Define fields based on section
  const fields = useMemo(() => {
    switch (section) {
      case "students": return [{ key: "fullName", label: "Full Name" }, { key: "admissionNumber", label: "Admission Number" }];
      case "classes": return [{ key: "name", label: "Class Name" }, { key: "code", label: "Class Code" }, { key: "gradeLevel", label: "Grade Level" }];
      case "attendance": return [{ key: "studentId", label: "Student Name/ID" }, { key: "status", label: "Status (present/absent)" }];
      case "exams": return [{ key: "title", label: "Assessment Title" }, { key: "examType", label: "Type (Quiz, Final)" }];
      case "results": return [{ key: "studentId", label: "Student Name/ID" }, { key: "percentage", label: "Percentage Score" }, { key: "grade", label: "Letter Grade" }];
      case "fees": return [{ key: "name", label: "Fee Name" }, { key: "totalAmount", label: "Amount (Numbers only)" }];
      case "announcements": return [{ key: "title", label: "Announcement Title" }, { key: "priority", label: "Priority (low, normal, high)" }];
      case "calendar": return [{ key: "title", label: "Event Title" }, { key: "startsAt", label: "Start Date (YYYY-MM-DD)" }];
      case "settings": return [{ key: "name", label: "Session Name" }];
      default: return [{ key: "name", label: "Name" }];
    }
  }, [section]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (section === "fees") payload.totalAmount = Number(payload.totalAmount);
    mutation.mutate({ section: section as any, payload });
  };

  return (
    <div className="create-overlay" role="dialog" aria-modal="true" aria-label={label}>
      <div className="create-panel" style={{ width: 400, padding: 24 }}>
        <button className="icon-button close" onClick={onClose} aria-label="Close panel"><X size={19} /></button>
        <span className="stamp"><CircleDot size={14} /> Database Write</span>
        <h2 style={{ marginBottom: 16 }}>{label}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
              <input 
                required
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6 }}
                value={formData[f.key] || ""}
                onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="panel-actions" style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save Record"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
`;

// Replace old CreatePanel
const oldCreatePanelRegex = /function CreatePanel\(\{ label, onClose \}: \{ label: string; onClose: \(\) => void \}\) \{[\s\S]*?<\/div><\/div>;\n\}/;
code = code.replace(oldCreatePanelRegex, dynamicForm);

// Also replace how it is called at the bottom of Home.tsx
code = code.replace(
  '{createOpen && <CreatePanel label={createLabel} onClose={() => setCreateOpen(false)} />}',
  '{createOpen && <CreatePanel section={active} label={createLabel} onClose={() => setCreateOpen(false)} />}'
);

fs.writeFileSync('client/src/pages/Home.tsx', code, 'utf8');
