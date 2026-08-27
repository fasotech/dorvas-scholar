import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Circle, Search, CheckCircle, UploadCloud, FileText } from "lucide-react";
import { format } from "date-fns";

export default function ResultManager() {
  const { data: stats, isLoading } = trpc.school.getExamResultStats.useQuery();

  return (
    <div className="flex-1 bg-[#e0f2ec] overflow-auto h-[calc(100vh-64px)]">
      <div className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-emerald-900">Home &middot; Cbt &middot; Result Manager</h1>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        
        {/* Top Filters */}
        <div className="bg-white border rounded shadow-sm">
          <div className="bg-[#125c3a] text-white p-2 text-sm font-bold flex items-center gap-2">
            <Circle size={10} fill="white" /> Test/Assignment/Examination Result Manager
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-700 w-32 text-right">Select School</label>
              <select className="flex-1 p-2 border border-gray-300 rounded text-sm"><option>Spring Valley High School</option></select>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-700 w-32 text-right">Session</label>
              <select className="flex-1 p-2 border border-gray-300 rounded text-sm"><option>2025/2026</option></select>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-700 w-32 text-right">Class</label>
              <select className="flex-1 p-2 border border-gray-300 rounded text-sm"><option>YEAR 7 PRIMEROSE</option><option>All</option></select>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-700 w-32 text-right">Subject</label>
              <select className="flex-1 p-2 border border-gray-300 rounded text-sm"><option>ICT</option><option>All</option></select>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-700 w-32 text-right">Selection Type</label>
              <select className="flex-1 p-2 border border-gray-300 rounded text-sm"><option>All</option></select>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="bg-white border rounded shadow-sm">
          <div className="bg-[#125c3a] text-white p-2 text-sm font-bold flex items-center gap-2">
            <Circle size={10} fill="white" /> Test/Assignment/Exam List
          </div>
          <div className="p-3 border-b flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <select className="border border-gray-300 rounded p-1"><option>10</option></select> records
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              Search: <input className="border border-gray-300 rounded p-1 w-48 focus:outline-none focus:ring-1 focus:ring-[#125c3a]" />
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs text-gray-500 bg-gray-50 uppercase">
                <th className="p-3 w-16 text-center font-bold">#</th>
                <th className="p-3 font-bold border-l text-center">Test Result Information</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={2} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : !stats || stats.length === 0 ? (
                <tr><td colSpan={2} className="p-8 text-center text-gray-500">No exams available.</td></tr>
              ) : (
                stats.map((stat: any, i: number) => (
                  <tr key={stat._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-center align-top text-gray-500 font-bold border-r">{i + 1}</td>
                    <td className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-lg text-gray-800 mb-1">{stat.title} <span className="text-sm text-gray-500">({stat.subject || 'ICT'})</span></div>
                          <div className="flex gap-4 text-xs font-bold text-gray-500 mb-1">
                            <span>Duration (mins): {stat.durationMinutes || 30}</span>
                            <span>Total Ques: {stat.questions?.length || 0}</span>
                            <span>Total Mrks: {stat.totalMarks || 0}</span>
                          </div>
                          <div className="flex gap-4 text-xs font-bold text-red-500 mb-2">
                            <span>Total Completed: {stat.totalCompleted || 0}</span>
                            <span>Total Attempt: {stat.totalAttempt || 0}</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-bold">{stat.totalAttempt || 0} mrk(s)/ques</span>
                            <span className="bg-amber-400 text-white px-2 py-0.5 rounded text-xs font-bold">Not Published</span>
                            <span className="text-gray-600 text-xs font-bold">Adiela Samogide</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-xs text-gray-500 font-bold">
                            {stat.startDate && stat.endDate ? (
                              <>
                                <div className="text-right mb-1">Start Date - End Date</div>
                                <div>{format(new Date(stat.startDate), "EEE MMM do, yy h:mma")} - {format(new Date(stat.endDate), "EEE MMM do, yy h:mma")}</div>
                              </>
                            ) : null}
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button className="text-xs bg-[#4bc0c0] hover:bg-[#3a9c9c] text-white px-2 py-1 rounded font-bold flex items-center gap-1 shadow-sm"><CheckCircle size={12}/> Mark as Completed</button>
                            <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded font-bold flex items-center gap-1 shadow-sm"><UploadCloud size={12}/> Publish Result</button>
                            <button className="text-xs border text-gray-500 hover:bg-gray-100 px-2 py-1 rounded font-bold flex items-center gap-1 shadow-sm"><FileText size={12}/> Test Details</button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
