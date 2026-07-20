import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { gradeApi } from '../services/api';
import { Award, BookOpen, GraduationCap, Loader2, CheckCircle2 } from 'lucide-react';

const StudentTranscript = () => {
  const { user } = useAuth();
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTranscript();
  }, []);

  const fetchTranscript = async () => {
    try {
      setLoading(true);
      const res = await gradeApi.getTranscript();
      setTranscript(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve academic transcript.');
    } finally {
      setLoading(false);
    }
  };

  const getGradeBadgeColor = (grade) => {
    if (!grade) return 'bg-slate-100 text-slate-700';
    if (grade.startsWith('A')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (grade.startsWith('C')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0f224a]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none animate-[fadeIn_0.2s_ease-out]">
      
      {/* Header Banner */}
      <div className="bg-[#0f224a] text-white p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
        <div>
          <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">Student Academic Services</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-300" />
            Official Academic Transcript
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Student: <span className="font-bold text-white">{user?.username}</span> ({user?.email})
          </p>
        </div>

        {/* GPA Summary Stat Cards */}
        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl text-center">
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Cumulative GPA</span>
            <span className="text-3xl font-black text-white">{transcript?.cumulativeGpa || '0.00'}</span>
            <span className="text-[10px] text-blue-200 block font-semibold">Scale 0.0 - 4.0</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl text-center">
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Total Credits</span>
            <span className="text-3xl font-black text-white">{transcript?.totalCreditsEarned || 0}</span>
            <span className="text-[10px] text-blue-200 block font-semibold">Earned Credits</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Transcript Records Table */}
      <div className="navy-card rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-extrabold text-[#0f224a] text-base flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Course Grades & Evaluation Records
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {transcript?.grades?.length || 0} Graded Courses
          </span>
        </div>

        {transcript?.grades?.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm bg-white">
            No grades have been posted for your account yet. Check back after midterms or finals!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-[#0f224a] font-black uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Course Code</th>
                  <th className="px-6 py-3.5">Course Name</th>
                  <th className="px-6 py-3.5">Credits</th>
                  <th className="px-6 py-3.5">Letter Grade</th>
                  <th className="px-6 py-3.5">Score %</th>
                  <th className="px-6 py-3.5">GPA Point</th>
                  <th className="px-6 py-3.5">Faculty Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-medium">
                {transcript?.grades?.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0f224a]">
                      <span className="px-2.5 py-1 rounded bg-blue-50 border border-blue-100 text-blue-900 text-xs">
                        {g.courseCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{g.courseName}</td>
                    <td className="px-6 py-4 text-slate-600">{g.credits || 3} Credits</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full border text-xs font-black shadow-xs ${getGradeBadgeColor(g.letterGrade)}`}>
                        {g.letterGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{g.numericalScore}%</td>
                    <td className="px-6 py-4 font-black text-[#0f224a]">{g.gpaPoint?.toFixed(1)}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 italic max-w-xs truncate">
                      {g.remarks || 'No remarks added'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentTranscript;
