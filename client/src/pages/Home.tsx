/**
 * Green Ledger: authenticated portal shell with a persistent ledger rail.
 * School records are always loaded from protected tRPC procedures; no sample learners or financial data is displayed.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import AvatarUploader from "../components/AvatarUploader";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import {
  AlertCircle, ArrowRight, ArrowUpRight, Award, Bell, BookOpen, CalendarDays, CheckCircle2, CircleDot,
  ClipboardCheck, Download, Eye, EyeOff, FileText, GraduationCap, LayoutDashboard, Loader2, LogIn, LogOut, Menu, MessageCircle,
  Plus, Search, School, Settings, SlidersHorizontal, Sparkles, Users, WalletCards, X, type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type PortalRole = "Administrator" | "Teacher" | "Student" | "Parent";
type SectionKey = "overview" | "students" | "teachers" | "classes" | "attendance" | "exams" | "results" | "fees" | "announcements" | "calendar" | "settings" | "users" | "pastoral" | "feedback" | "eclassroom" | "library" | "lessonPlanner" | "cbt" | "voting" | "timetable" | "pocketMoney" | "rateTeachers" | "medical" | "remarks";
type ProtectedSection = Exclude<SectionKey, "overview" | "users">;
type NavItem = { label: string; key: SectionKey; icon: LucideIcon };

const primaryNav: NavItem[] = [
  { label: "Dashboard", key: "overview", icon: LayoutDashboard }, { label: "Students", key: "students", icon: Users },
  { label: "Teachers", key: "teachers", icon: Users },
  { label: "Classes & subjects", key: "classes", icon: School }, { label: "Attendance", key: "attendance", icon: ClipboardCheck },
  { label: "Exams & practice", key: "exams", icon: BookOpen }, { label: "Results", key: "results", icon: Award }, { label: "Fees & payments", key: "fees", icon: WalletCards },
];

const studentNav: NavItem[] = [
  { label: "Dashboard", key: "overview", icon: LayoutDashboard },
  { label: "Pastoral", key: "pastoral", icon: Users },
  { label: "Feedback", key: "feedback", icon: MessageCircle },
  { label: "eClassroom", key: "eclassroom", icon: BookOpen },
  { label: "Subjects", key: "classes", icon: School },
  { label: "Assignments", key: "exams", icon: FileText },
  { label: "Library", key: "library", icon: BookOpen },
  { label: "Lesson Planner", key: "lessonPlanner", icon: CalendarDays },
  { label: "Cbt", key: "cbt", icon: CheckCircle2 },
  { label: "Voting System", key: "voting", icon: Users },
  { label: "TimeTable", key: "timetable", icon: CalendarDays },
  { label: "Calendar", key: "calendar", icon: CalendarDays },
  { label: "PocketMoney Manager", key: "pocketMoney", icon: WalletCards },
];

const secondaryNav: NavItem[] = [
  { label: "Announcements", key: "announcements", icon: Bell }, { label: "School calendar", key: "calendar", icon: CalendarDays }, { label: "Settings", key: "settings", icon: Settings }, { label: "User Admin", key: "users", icon: Settings }
];

const moduleData: Record<ProtectedSection, { eyebrow: string; title: string; description: string; primary: string }> = {
  students: { eyebrow: "Student records", title: "A clearer view of every learner.", description: "Search the student profiles and admission records that are available to your role.", primary: "Add new student" },
  classes: { eyebrow: "Academic structure", title: "Classes with a complete learning picture.", description: "Review class setup, academic levels, and subject organisation from the school database.", primary: "Create class" },
  attendance: { eyebrow: "Daily register", title: "See who is present, early, and supported.", description: "Live attendance records appear here once the register is submitted by an authorised teacher.", primary: "Take attendance" },
  exams: { eyebrow: "Practice & assessment", title: "Assessment that shows the next learning step.", description: "Review assessments and practice activity that your school role is permitted to manage.", primary: "Create assessment" },
  results: { eyebrow: "Results desk", title: "Move from scores to useful conversations.", description: "Review the protected result records that have been processed for this term.", primary: "Process results" },
  fees: { eyebrow: "Finance desk", title: "A respectful, transparent view of school fees.", description: "Finance data is restricted to authorised school administrators.", primary: "Record payment" },
  announcements: { eyebrow: "School voice", title: "Keep every family informed, without noise.", description: "Published and scheduled notices are available from the school database.", primary: "Create announcement" },
  calendar: { eyebrow: "School rhythm", title: "The term at a glance, then in detail.", description: "Upcoming scheduled assessments and school dates load from the secure timetable data.", primary: "Add calendar event" },
  settings: { eyebrow: "School settings", title: "Keep the foundation orderly.", description: "Academic sessions and protected school configuration are reserved for administrators.", primary: "Update settings" },
  teachers: { eyebrow: "Teacher roster", title: "Manage teaching staff.", description: "Review and manage the teacher roster and subjects.", primary: "New Teacher" },
  pastoral: { eyebrow: "Pastoral", title: "Pastoral care & well-being", description: "View your pastoral records.", primary: "Request Support" },
  feedback: { eyebrow: "Feedback", title: "Provide feedback", description: "Your voice matters.", primary: "New Feedback" },
  eclassroom: { eyebrow: "eClassroom", title: "Digital learning space", description: "Access virtual classes and materials.", primary: "Join Class" },
  library: { eyebrow: "Library", title: "School Library", description: "Browse digital resources and books.", primary: "Reserve Book" },
  lessonPlanner: { eyebrow: "Lesson Planner", title: "Your learning path", description: "View your upcoming lessons.", primary: "View Planner" },
  cbt: { eyebrow: "CBT", title: "Computer Based Testing", description: "Take your active assessments here.", primary: "Start Exam" },
  voting: { eyebrow: "Voting System", title: "School Elections", description: "Participate in student elections.", primary: "Vote Now" },
  timetable: { eyebrow: "TimeTable", title: "Your Schedule", description: "View your weekly timetable.", primary: "Download" },
  pocketMoney: { eyebrow: "PocketMoney Manager", title: "Manage your funds", description: "Track your pocket money spending.", primary: "Add Funds" },
  rateTeachers: { eyebrow: "Rate Teachers", title: "Teacher Evaluation", description: "Provide constructive feedback for your teachers.", primary: "Start Evaluation" },
  medical: { eyebrow: "Medical Records", title: "Health & Wellbeing", description: "Your medical history and current health status.", primary: "Update Record" },
  remarks: { eyebrow: "Teacher Remarks", title: "Termly Remarks", description: "Comments and behavior reports from your teachers.", primary: "View Remarks" }
};

const roleCopy: Record<PortalRole, { eyebrow: string; greeting: string; description: string; action: string }> = {
  Administrator: { eyebrow: "Operations desk", greeting: "The school day is in good order.", description: "Review live attendance, assessment, and payment signals from your secure school records.", action: "Manage school records" },
  Teacher: { eyebrow: "Teaching desk", greeting: "Your learning rhythm is ready.", description: "Review the class register and assessment activity assigned to your teaching role.", action: "Review assessments" },
  Student: { eyebrow: "Learning desk", greeting: "Your learning record is ready.", description: "See only your own published school information and practice activity.", action: "Review learning" },
  Parent: { eyebrow: "Family desk", greeting: "Your family view is ready.", description: "See only the published information connected to your child or children.", action: "Review family records" },
};

function LedgerMark() {
  return <div className="brand-lockup" aria-label="Green Ledger"><img src="/greenledger-logo.png" alt="Green Ledger" className="h-8 w-auto bg-white p-1 rounded" /></div>;
}

function NavList({ items, active, onNavigate }: { items: NavItem[]; active: SectionKey; onNavigate: (key: SectionKey) => void }) {
  return <nav className="nav-list" aria-label="Portal navigation">{items.map((item) => { const Icon = item.icon; return <button key={item.key} className={`nav-item ${active === item.key ? "is-active" : ""}`} onClick={() => onNavigate(item.key)}><Icon size={18} strokeWidth={active === item.key ? 2.4 : 1.8} /><span>{item.label}</span></button>; })}</nav>;
}

function ProgressRing({ value, label }: { value: number; label: string }) {
  return <div className="progress-ring" style={{ background: `conic-gradient(#7dcb71 ${Math.max(0, Math.min(value, 100)) * 3.6}deg, rgba(23, 107, 77, .12) 0deg)` }}><div><strong>{value ? `${value}%` : "—"}</strong><span>{label}</span></div></div>;
}

function SignInGate() {
  return <main className="auth-gate"><div className="auth-gate-card"><LedgerMark /><p className="eyebrow"><span /> Secure school access</p><h1>One school desk, protected by a real sign-in.</h1><p>Your identity and school role determine the records you can see. Sign in to load the secure Green Ledger dashboard.</p><Button onClick={() => window.location.href='/login'}><LogIn size={17} /> Sign in to Green Ledger</Button></div></main>;
}

function ConnectionNotice({ summary }: { summary: any }) {
  const identity = summary?.identity;
  if (!identity || identity.connection === "connected" && identity.linked) return null;
  const content = identity?.connection === "unavailable" ? "MongoDB Atlas is not reachable yet. Add the deployment network rule and a full MONGODB_URI to enable live school records." : "Your sign-in worked, but this account has not been linked to a school user record in MongoDB Atlas yet.";
  return <div className="data-status"><AlertCircle size={17} /><p><b>Live data waiting for setup.</b> {content}</p></div>;
}

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
  const [showPassword, setShowPassword] = useState(false);

  const generateAdmission = () => {
    const year = new Date().getFullYear();
    const nextYear = year + 1;
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setFormData(p => ({ ...p, admissionNumber: `${year}/${nextYear}/${randomNum}` }));
  };

  // Define fields based on section
  const fields = useMemo(() => {
    switch (section) {
      case "students": return [
        { key: "fullName", label: "Full Name" },
        { key: "className", label: "Class Name" }, 
        { key: "admissionNumber", label: "Reg. Number" },
        { key: "dob", label: "Date of Birth" },
        { key: "address", label: "Address" },
        { key: "state", label: "State" },
        { key: "email", label: "Email Address" },
        { key: "password", label: "Initial Password (for login)" },
        { key: "profilePicture", label: "Student's Photo", type: "image" }
      ];
      case "teachers": return [
        { key: "fullName", label: "Full Name" },
        { key: "password", label: "Initial Password (for login)" }
      ];
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
    if (section === "fees") payload.totalAmount = Number(payload.totalAmount) as any;
    mutation.mutate({ section: section as any, payload });
  };

  return (
    <div className="create-overlay" role="dialog" aria-modal="true" aria-label={label}>
      <div className="create-panel" style={{ width: fields.length > 4 ? 600 : 400, padding: 24 }}>
        <button className="icon-button close" onClick={onClose} aria-label="Close panel"><X size={19} /></button>
        <span className="stamp"><CircleDot size={14} /> Database Write</span>
        <h2 style={{ marginBottom: 16 }}>{label}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: fields.length > 4 ? '1fr 1fr' : '1fr', gap: 16 }}>
          {fields.map(f => {
            const isEmailAuto = (f.key === 'email' && (section === 'students' || section === 'teachers'));
            const displayValue = isEmailAuto && !formData[f.key] && formData.fullName 
                ? formData.fullName.toLowerCase().replace(/\s+/g, '.') + '@springdrill.edu.ng' 
                : (formData[f.key] || "");
            
            return (
            <div key={f.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600 }}>{f.label}</label>
                {f.key === 'admissionNumber' && (
                  <Button type="button" variant="outline" size="sm" style={{ padding: '0 8px', height: 24, fontSize: 11 }} onClick={generateAdmission}>Generate</Button>
                )}
              </div>
              
              {f.type === 'image' ? (
                <div style={{ marginTop: 8 }}>
                  {formData[f.key] && (
                    <img src={formData[f.key]} alt="Preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 4, marginBottom: 8, border: '1px solid #ddd' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(p => ({ ...p, [f.key]: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{
                      width: '100%', padding: '4px', border: '1px solid #ddd', borderRadius: 6, fontSize: 12, backgroundColor: '#f0f4f8'
                    }}
                  />
                  <div style={{ fontSize: 11, color: '#333', marginTop: 8, fontStyle: 'italic' }}>
                    <span style={{ backgroundColor: '#e74c3c', color: 'white', padding: '2px 6px', borderRadius: 2, marginRight: 6, fontWeight: 'bold', fontStyle: 'normal' }}>NOTE!</span>
                    Image must not be more than 500px in size.
                  </div>
                </div>
              ) : f.key === 'password' ? (
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    style={{ 
                      width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6
                    }}
                    value={formData[f.key] || ""}
                    onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: 10, background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              ) : (
                <input 
                  type={f.key === 'dob' ? 'date' : 'text'}
                  required={f.key !== 'email'}
                  disabled={isEmailAuto}
                  style={{ 
                    width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6,
                    backgroundColor: isEmailAuto ? '#f5f5f5' : 'white',
                    color: isEmailAuto ? '#666' : 'inherit'
                  }}
                  value={displayValue}
                  placeholder={isEmailAuto ? "Auto-generated..." : ""}
                  onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                />
              )}
              {isEmailAuto && (
                <div style={{ fontSize: 11, color: '#16a34a', marginTop: 4, fontWeight: 500 }}>
                  ✓ Email will auto-generate based on this name.
                </div>
              )}
            </div>
            );
          })}
          <div className="panel-actions" style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12, gridColumn: '1 / -1' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save Record"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}


import AdminDashboard from "./AdminDashboard";
import TeacherExams from "./TeacherExams";

function Dashboard({ role, summary, isLoading, onNavigate, onCreate }: { role: PortalRole; summary: any; isLoading: boolean; onNavigate: (key: SectionKey) => void; onCreate: () => void }) {
  if (role === "Student") return <StudentDashboard onNavigate={onNavigate} />;
  if (role === "Teacher") return <TeacherDashboard summary={summary} onNavigate={onNavigate} />;
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#1b4332]" size={32} /></div>;
  }
  
  return <AdminDashboard summary={summary} onNavigate={onNavigate} />;
}

function Workspace({ section, onCreate }: { section: ProtectedSection; onCreate: () => void }) {
  const [query, setQuery] = useState("");
  const data = moduleData[section];
  const recordsQuery = trpc.school.records.useQuery({ section, query }, { retry: false, refetchOnWindowFocus: false });
  const records = recordsQuery.data?.records ?? [];
  const columns = recordsQuery.data?.columns ?? [];
  const databaseUnavailable = recordsQuery.data?.identity.connection === "unavailable";
  return <section className="workspace"><div className="workspace-hero"><div><p className="eyebrow"><span /> {data.eyebrow}</p><h1>{data.title}</h1><p className="intro">{data.description}</p></div><Button onClick={onCreate}><Plus size={17} /> {data.primary}</Button></div><div className="workspace-metrics"><article><p>Live records</p><strong>{recordsQuery.isLoading ? "…" : recordsQuery.data?.total ?? 0}</strong><span>{databaseUnavailable ? "Awaiting Atlas network access" : "Protected MongoDB query"}</span></article><article><p>Access rule</p><strong>{recordsQuery.data?.identity.role ?? "—"}</strong><span>{recordsQuery.data?.identity.linked ? "School profile linked" : "Profile link required"}</span></article><article><p>Query state</p><strong>{recordsQuery.isError ? "Blocked" : databaseUnavailable ? "Offline" : "Ready"}</strong><span>{recordsQuery.isError ? "Your role may not access this section" : "Search is server-side"}</span></article></div><article className="ledger-card table-card"><div className="table-toolbar"><div><p className="eyebrow"><span /> Current records</p><h2>Find what you need, quickly.</h2></div><label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this section" /><kbd>⌘ K</kbd></label></div><div className="table-wrap"><table><thead><tr>{columns.map((header: string) => <th key={header}>{header}</th>)}</tr></thead><tbody>{recordsQuery.isLoading ? <tr><td colSpan={Math.max(columns.length, 1)} className="empty-row"><Loader2 size={16} className="animate-spin" /> Loading protected records…</td></tr> : recordsQuery.isError ? <tr><td colSpan={Math.max(columns.length, 1)} className="empty-row">{recordsQuery.error.message}</td></tr> : records.length ? records.map((rowItem: any, rowIndex: number) => {
  const cells = Array.isArray(rowItem) ? rowItem : rowItem.cells;
  const id = Array.isArray(rowItem) ? null : rowItem.id;
  const isClickable = id && (section === "students" || section === "teachers");
  return (
    <tr 
      key={id || rowIndex} 
      onClick={() => { if (!isClickable) return; if (section === "students") window.location.assign("/students/" + id); else if (section === "teachers") window.location.assign("/teachers/" + id); }}
      style={{ cursor: isClickable ? "pointer" : "default" }}
      className={isClickable ? "hover:bg-gray-50 transition-colors" : ""}
    >
      {cells.map((cell: string, index: number) => 
        <td key={index}>
          {typeof cell === 'string' && cell.startsWith('data:image/') ? (
            <img src={cell} alt="Profile" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }} />
          ) : (index === 0 || index === 1) ? (
            <b>{cell}</b>
          ) : index === cells.length - 1 ? (
            <span className="status-pill">{cell}</span>
          ) : (
            cell
          )}
        </td>
      )}
    </tr>
  );
}) : <tr><td colSpan={Math.max(columns.length, 1)} className="empty-row">{databaseUnavailable ? "MongoDB Atlas is unavailable. Update Network Access, then refresh this view." : "No records are available for this section and your assigned role."}</td></tr>}</tbody></table></div><div className="table-footer"><span>{recordsQuery.data?.total ?? 0} live records found</span><button onClick={() => toast.info("Exports will be enabled after the school administrator confirms role and data-retention rules.")}><Download size={15} /> Export records</button></div></article></section>;
}

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [active, setActive] = useState<SectionKey>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const dashboardQuery = trpc.school.dashboard.useQuery(undefined, { enabled: isAuthenticated, retry: false, refetchOnWindowFocus: false });
  if (loading) return <main className="auth-gate"><Loader2 className="animate-spin" /><span>Checking your secure session…</span></main>;
  if (!isAuthenticated) return <SignInGate />;
  const schoolRole = dashboardQuery.data?.identity.role;
  const role: PortalRole = schoolRole === "teacher" ? "Teacher" : schoolRole === "student" ? "Student" : schoolRole === "parent" ? "Parent" : "Administrator";
  const permittedPrimary = role === "Administrator" ? primaryNav : role === "Teacher" ? primaryNav.filter((item) => item.key !== "fees") : role === "Student" ? studentNav : primaryNav.filter((item) => item.key === "overview");
  const permittedSecondary = role === "Student" ? [] : role === "Administrator" ? secondaryNav : secondaryNav.filter((item) => item.key === "announcements" || item.key === "calendar");
  const initials = (dashboardQuery.data?.identity.displayName ?? user?.name ?? "GL").split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase();
  const createLabel = active === "overview" ? roleCopy[role].action : active === "users" ? "New User" : (moduleData as any)[active]?.primary;
  const navigate = (key: SectionKey) => { setActive(key); setMobileNavOpen(false); };
  
  const renderContent = () => {
    if (active === "overview") return <Dashboard role={role} summary={dashboardQuery.data} isLoading={dashboardQuery.isLoading} onNavigate={navigate} onCreate={() => setCreateOpen(true)} />;
    if (active === "users") return <UserManagement />;
    if (active === "exams" && role === "Teacher") return <TeacherExams summary={dashboardQuery.data} />;
    return <Workspace section={active as any} onCreate={() => setCreateOpen(true)} />;
  };

  return <div className="portal-shell"><aside className={`sidebar ${mobileNavOpen ? "is-open" : ""}`}><div className="sidebar-top"><LedgerMark /><button className="mobile-close icon-button" onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><X size={20} /></button></div><div className="sidebar-label">School desk</div><NavList items={permittedPrimary} active={active} onNavigate={navigate} /><div className="sidebar-label more">More</div><NavList items={permittedSecondary} active={active} onNavigate={navigate} /><div className="sidebar-spacer" /></aside>{mobileNavOpen && <button className="sidebar-scrim" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}<main className="main-canvas"><header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="topbar-brand"><LedgerMark /></div><span className="topbar-rule" /><span className="topbar-date"><CalendarDays size={15} /> Secure school workspace</span></div><div className="topbar-actions"><button className="notice-button" onClick={() => navigate("announcements")} aria-label="Open announcements"><Bell size={18} /></button><span className="role-chip">{schoolRole ?? "Link profile"}</span><AvatarUploader initials={initials} currentPicture={user?.profilePicture} size="sm" editable={role === "Administrator"} /><button className="notice-button" style={{marginLeft:"8px"}} onClick={() => void logout()} aria-label="Sign out" title="Log Out"><LogOut size={18} /></button></div></header><div className="canvas-content">{renderContent()}</div></main>{createOpen && <CreatePanel section={active} label={createLabel} onClose={() => setCreateOpen(false)} />}</div>;
}


function UserManagement() {
  const { data: users, refetch } = trpc.users.listUsers.useQuery();
  const deleteMutation = trpc.users.deleteUser.useMutation({
    onSuccess: () => refetch(),
    onError: (err) => toast.error(err.message)
  });
  const createMutation = trpc.users.createUser.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("User created");
    },
    onError: (err) => toast.error(err.message)
  });

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("Password123!");
  const impersonateMutation = trpc.auth.impersonate.useMutation({
    onSuccess: (res: any) => {
      if (res.token) sessionStorage.setItem("manus-cookie", `auth_token=${res.token}`);
      window.location.href = "/dashboard";
    },
    onError: (err) => toast.error(err.message)
  });


  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">User Management (Admin Only)</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-medium mb-4">Create New User</h3>
        <form className="flex gap-4 items-end flex-wrap" onSubmit={e => {
          e.preventDefault();
          createMutation.mutate({ email, displayName, role: role as any, password });
        }}>
          <div><label className="block text-sm mb-1">Email</label><input required className="border p-2 rounded" value={email} onChange={e=>setEmail(e.target.value)}/></div>
          <div><label className="block text-sm mb-1">Name</label><input required className="border p-2 rounded" value={displayName} onChange={e=>setDisplayName(e.target.value)}/></div>
          <div><label className="block text-sm mb-1">Role</label>
            <select className="border p-2 rounded" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div><label className="block text-sm mb-1">Initial Password</label><input required className="border p-2 rounded" value={password} onChange={e=>setPassword(e.target.value)}/></div>
          <Button type="submit" disabled={createMutation.isPending}>Create User</Button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map(u => (
              <tr key={u.id}>
                <td className="px-6 py-4 font-medium">{u.displayName}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4"><span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-semibold uppercase">{u.role}</span></td>
                <td className="px-6 py-4">
                  <button onClick={() => impersonateMutation.mutate({ email: u.email })} className="text-blue-500 hover:text-blue-700 text-sm font-medium mr-4">Login As User</button>
<button onClick={() => {
                    if(confirm("Are you sure?")) deleteMutation.mutate({ id: u.id });
                  }} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
