/**
 * Green Ledger: authenticated portal shell with a persistent ledger rail.
 * School records are always loaded from protected tRPC procedures; no sample learners or financial data is displayed.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import {
  AlertCircle, ArrowRight, ArrowUpRight, Award, Bell, BookOpen, CalendarDays, CheckCircle2, CircleDot,
  ClipboardCheck, Download, GraduationCap, LayoutDashboard, Loader2, LogIn, LogOut, Menu, MessageCircle,
  Plus, Search, School, Settings, SlidersHorizontal, Sparkles, Users, WalletCards, X, type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type PortalRole = "Administrator" | "Teacher" | "Student" | "Parent";
type SectionKey = "overview" | "students" | "classes" | "attendance" | "exams" | "results" | "fees" | "announcements" | "calendar" | "settings" | "users";
type ProtectedSection = Exclude<SectionKey, "overview" | "users">;
type NavItem = { label: string; key: SectionKey; icon: LucideIcon };

const primaryNav: NavItem[] = [
  { label: "Overview", key: "overview", icon: LayoutDashboard }, { label: "Students", key: "students", icon: Users },
  { label: "Teachers", key: "teachers", icon: Users },
  { label: "Classes & subjects", key: "classes", icon: School }, { label: "Attendance", key: "attendance", icon: ClipboardCheck },
  { label: "Exams & practice", key: "exams", icon: BookOpen }, { label: "Results", key: "results", icon: Award }, { label: "Fees & payments", key: "fees", icon: WalletCards },
];
const secondaryNav: NavItem[] = [
  { label: "Announcements", key: "announcements", icon: Bell }, { label: "School calendar", key: "calendar", icon: CalendarDays }, { label: "Settings", key: "settings", icon: Settings }, { label: "User Admin", key: "users", icon: Settings }, { label: "User Admin", key: "users", icon: Settings }
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
};

const roleCopy: Record<PortalRole, { eyebrow: string; greeting: string; description: string; action: string }> = {
  Administrator: { eyebrow: "Operations desk", greeting: "The school day is in good order.", description: "Review live attendance, assessment, and payment signals from your secure school records.", action: "Manage school records" },
  Teacher: { eyebrow: "Teaching desk", greeting: "Your learning rhythm is ready.", description: "Review the class register and assessment activity assigned to your teaching role.", action: "Review assessments" },
  Student: { eyebrow: "Learning desk", greeting: "Your learning record is ready.", description: "See only your own published school information and practice activity.", action: "Review learning" },
  Parent: { eyebrow: "Family desk", greeting: "Your family view is ready.", description: "See only the published information connected to your child or children.", action: "Review family records" },
};

function LedgerMark() {
  return <div className="brand-lockup" aria-label="Green Ledger"><span className="brand-mark"><img src="/manus-storage/green-ledger-mark_48929d3e.png" alt="" /></span><span className="wordmark"><b>GREEN</b><i>LEDGER</i></span></div>;
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

  // Define fields based on section
  const fields = useMemo(() => {
    switch (section) {
      case "students": return [
        { key: "fullName", label: "Full Name" },
      { key: "className", label: "Class Name" }, 
        { key: "admissionNumber", label: "Admission Number" },
        { key: "dob", label: "Date of Birth (YYYY-MM-DD)" },
        { key: "address", label: "Address" },
        { key: "state", label: "State" },
      { key: "email", label: "Email (Leave blank to auto-generate)" },
        { key: "password", label: "Initial Password (for login)" }
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
          <div className="panel-actions" style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12, gridColumn: '1 / -1' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save Record"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ role, summary, isLoading, onNavigate, onCreate }: { role: PortalRole; summary: any; isLoading: boolean; onNavigate: (key: SectionKey) => void; onCreate: () => void }) {
  const copy = roleCopy[role];

  if (summary?.isAdminView) {
    const adminMetrics = summary.metrics || {};
    const chartData = summary.classDistribution || [];
    return (
      <>
        <section className="welcome-band">
          <div className="welcome-copy">
            <p className="eyebrow"><span /> Administrator Desk</p>
            <h1>School Operations Overview</h1>
            <p className="intro">Live statistics from your active, protected database.</p>
            <div className="welcome-actions">
              <Button onClick={onCreate}><Plus size={17} /> New Record</Button>
            </div>
          </div>
        </section>
        <ConnectionNotice summary={summary} />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { label: "Active Students", value: adminMetrics.activeStudents || 0, bg: "bg-blue-500" },
            { label: "Male Students", value: adminMetrics.maleStudents || 0, bg: "bg-emerald-400" },
            { label: "Female Students", value: adminMetrics.femaleStudents || 0, bg: "bg-amber-400" },
            { label: "Classes", value: adminMetrics.totalClasses || 0, bg: "bg-cyan-500" },
            { label: "Teachers", value: adminMetrics.totalTeachers || 0, bg: "bg-purple-600" },
            { label: "Total Attendance", value: (adminMetrics.totalAttendance || 0) + "%", bg: "bg-teal-400" }
          ].map(m => (
            <div key={m.label} className={`${m.bg} text-white p-4 rounded-xl shadow-sm flex flex-col justify-between`}>
              <div className="text-3xl font-bold font-serif mb-2">{m.value}</div>
              <div className="text-xs uppercase tracking-wider font-semibold opacity-90">{m.label}</div>
            </div>
          ))}
        </div>

        <section className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900">School Class Distribution</h2>
            <p className="text-sm text-gray-500">Number of Active Students per Class</p>
          </div>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#2d6a4f" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <AlertCircle size={24} className="mb-2" />
                <p>No class distribution data available.</p>
              </div>
            )}
          </div>
        </section>
      </>
    );
  }

  const metrics = summary?.metrics ?? [];
  const attendance = metrics.find((metric: any) => metric.key === "attendance");
  const attendanceValue = Number.parseFloat(attendance?.value ?? "0") || 0;
  const upcoming = summary?.upcoming ?? [];
  const followUps = summary?.followUps ?? [];
  return <>
    <section className="welcome-band"><div className="welcome-copy"><p className="eyebrow"><span /> {copy.eyebrow}</p><h1>{copy.greeting}</h1><p className="intro">{copy.description}</p><div className="welcome-actions"><Button onClick={onCreate}><Plus size={17} /> {copy.action}</Button><button className="text-action" onClick={() => onNavigate("calendar")}>View school rhythm <ArrowRight size={16} /></button></div></div><div className="welcome-image" style={{ backgroundImage: "url('/manus-storage/green-ledger-learning-hero_14e29074.jpg')" }}><span className="image-caption">Learning works better in company.</span></div></section>
    <ConnectionNotice summary={summary} />
    <section className="metric-strip" aria-label="Live school overview metrics">{isLoading ? <article><span>Loading secure records</span><strong>…</strong><p><Loader2 size={14} className="animate-spin" /> Connecting to school data</p></article> : metrics.length ? metrics.map((metric: any) => <article key={metric.key} className={metric.key === "attention" ? "metric-callout" : ""}><span>{metric.label}</span><strong>{metric.value}</strong><p>{metric.key === "attention" ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />} {metric.detail}</p></article>) : <article><span>Live metrics</span><strong>—</strong><p><AlertCircle size={14} /> No authorised records are available yet</p></article>}</section>
    <section className="dashboard-grid"><article className="ledger-card activity-card"><div className="section-heading"><div><p className="eyebrow"><span /> Activity pulse</p><h2>Records will tell the learning story.</h2></div><button className="icon-button" onClick={() => toast.info("Attendance and assessment entries will populate this view as staff submit them.")}><SlidersHorizontal size={17} /></button></div><div className="pulse-chart"><div className="chart-key"><span><i className="line-key attendance" /> Attendance</span><span><i className="line-key practice" /> Practice</span></div><div className="chart-lines chart-empty"><p>{summary?.identity?.connection === "connected" ? "No dated activity is available for this week yet." : "Live trends appear after Atlas is connected."}</p></div></div><div className="activity-note"><span className="note-icon"><Sparkles size={16} /></span><p><b>Live source:</b> daily attendance and submitted practice attempts are the only inputs used for this view.</p><button onClick={() => onNavigate("exams")}>Review practice <ArrowUpRight size={15} /></button></div></article>
      <article className="ledger-card insight-card"><div className="section-heading"><div><p className="eyebrow"><span /> Today’s register</p><h2>Attendance, at a glance.</h2></div><button className="text-action compact" onClick={() => onNavigate("attendance")}>Open register <ArrowRight size={14} /></button></div><div className="register-content"><ProgressRing value={attendanceValue} label="Present" /><div className="register-stats"><p><b>{attendance?.detail ?? "No register submitted"}</b></p><span><i className="dot green" /> Live result from today’s records</span><span><i className="dot gold" /> Absent students appear in follow-up</span></div></div><div className="mini-list"><span><b>Source</b><em>{summary?.identity?.connection === "connected" ? "MongoDB Atlas" : "Awaiting Atlas"}</em></span><span><b>Profile link</b><em>{summary?.identity?.linked ? "Ready" : "Required"}</em></span></div></article>
      <article className="ledger-card upcoming-card"><div className="section-heading"><div><p className="eyebrow"><span /> On the horizon</p><h2>Keep the next few days clear.</h2></div><button className="icon-button" onClick={() => onNavigate("calendar")}><CalendarDays size={17} /></button></div><div className="event-list">{upcoming.length ? upcoming.map((event: any) => { const date = event.startsAt ? new Date(event.startsAt) : null; return <div key={event.id}><time><b>{date ? date.getDate() : "—"}</b><span>{date ? date.toLocaleDateString(undefined, { month: "short" }).toUpperCase() : "DATE"}</span></time><p><b>{event.title}</b><span>{date ? date.toLocaleString() : "Schedule pending"}</span></p><em className="event-tag assess">{event.type}</em></div>; }) : <div className="data-empty">No scheduled assessments are available for your role.</div>}</div></article>
      <article className="ledger-card teacher-card"><div className="teacher-image" style={{ backgroundImage: "url('/manus-storage/green-ledger-teacher-portrait_83aca894.jpg')" }}><span>Teaching desk</span></div><div className="teacher-copy"><p className="eyebrow"><span /> Learning insight</p><h2>Every submitted record makes the next conversation clearer.</h2><p>Teachers can use attendance, practice, and result records to decide what support is useful next.</p><button className="text-action" onClick={() => onNavigate("students")}>See student records <ArrowRight size={15} /></button></div></article></section>
    <section className="lower-grid"><article className="ledger-card action-card"><div className="section-heading"><div><p className="eyebrow"><span /> Follow-up</p><h2>Attention items from today’s live records.</h2></div><button className="text-action compact" onClick={() => onNavigate("announcements")}>View notices <ArrowRight size={14} /></button></div><div className="follow-list">{followUps.length ? followUps.map((item: any, index: number) => <div key={`${item.label}-${index}`}><span className="avatar mint">{String(index + 1).padStart(2, "0")}</span><p><b>{item.label}</b><span>{item.detail}</span></p><button onClick={() => toast.info("Messaging will use protected recipient records after staff accounts are linked.")}>Review <MessageCircle size={14} /></button></div>) : <div className="data-empty">No follow-up records are available today.</div>}</div></article><article className="ledger-card weekly-card" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.88), rgba(255,255,255,.94)), url('/manus-storage/green-ledger-study-texture_fef1cfb2.jpg')" }}><p className="eyebrow"><span /> Secure data plan</p><h2>Link your school user, then let the records lead.</h2><p>When MongoDB Atlas is available, the dashboard refreshes from protected procedures instead of display-only values.</p><div className="weekly-meta"><span><CheckCircle2 size={16} /> Session-aware data contract installed</span><button onClick={() => onNavigate("settings")}>Review setup <ArrowUpRight size={16} /></button></div></article></section>
  </>;
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
  const isClickable = id && section === "students";
  return (
    <tr 
      key={id || rowIndex} 
      onClick={() => isClickable && window.location.assign("/students/" + id)}
      style={{ cursor: isClickable ? "pointer" : "default" }}
      className={isClickable ? "hover:bg-gray-50 transition-colors" : ""}
    >
      {cells.map((cell: string, index: number) => 
        <td key={index}>{index === 0 ? <b>{cell}</b> : index === cells.length - 1 ? <span className="status-pill">{cell}</span> : cell}</td>
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
  const permittedPrimary = role === "Administrator" ? primaryNav : role === "Teacher" ? primaryNav.filter((item) => item.key !== "fees") : primaryNav.filter((item) => item.key === "overview");
  const permittedSecondary = role === "Administrator" ? secondaryNav : secondaryNav.filter((item) => item.key !== "settings");
  const initials = (dashboardQuery.data?.identity.displayName ?? user?.name ?? "GL").split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase();
  const createLabel = active === "overview" ? roleCopy[role].action : active === "users" ? "New User" : (moduleData as any)[active]?.primary;
  const navigate = (key: SectionKey) => { setActive(key); setMobileNavOpen(false); };
  return <div className="portal-shell"><aside className={`sidebar ${mobileNavOpen ? "is-open" : ""}`}><div className="sidebar-top"><LedgerMark /><button className="mobile-close icon-button" onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><X size={20} /></button></div><div className="sidebar-label">School desk</div><NavList items={permittedPrimary} active={active} onNavigate={navigate} /><div className="sidebar-label more">More</div><NavList items={permittedSecondary} active={active} onNavigate={navigate} /><div className="sidebar-spacer" /><div className="sidebar-note"><span><Sparkles size={15} /> Secure session</span><p>“Small records make a well-run school.”</p></div><div className="account-row"><span className="avatar account">{initials}</span><div><b>{dashboardQuery.data?.identity.displayName ?? user?.name ?? "Signed-in user"}</b><span>{schoolRole ?? "School profile pending"}</span></div><button onClick={() => void logout()} aria-label="Sign out"><LogOut size={17} /></button></div></aside>{mobileNavOpen && <button className="sidebar-scrim" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}<main className="main-canvas"><header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="topbar-brand"><LedgerMark /></div><span className="topbar-rule" /><span className="topbar-date"><CalendarDays size={15} /> Secure school workspace</span></div><div className="topbar-actions"><button className="notice-button" onClick={() => navigate("announcements")} aria-label="Open announcements"><Bell size={18} /></button><span className="role-chip">{schoolRole ?? "Link profile"}</span><span className="avatar top-avatar">{initials}</span><button className="notice-button" style={{marginLeft:"8px"}} onClick={() => void logout()} aria-label="Sign out" title="Log Out"><LogOut size={18} /></button></div></header><div className="canvas-content">{active === "overview" ? <Dashboard role={role} summary={dashboardQuery.data} isLoading={dashboardQuery.isLoading} onNavigate={navigate} onCreate={() => setCreateOpen(true)} /> : active === "users" ? <UserManagement /> : <Workspace section={active as any} onCreate={() => setCreateOpen(true)} />}</div></main>{createOpen && <CreatePanel section={active} label={createLabel} onClose={() => setCreateOpen(false)} />}</div>;
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
                  <button onClick={() => impersonateMutation.mutate({ email: u.email })} className="text-blue-500 hover:text-blue-700 text-sm font-medium mr-4">Impersonate</button>
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
