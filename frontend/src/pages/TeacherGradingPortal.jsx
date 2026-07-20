import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseApi, gradeApi } from '../services/api';
import { 
  BookOpen, 
  UserCheck, 
  Edit3, 
  Loader2, 
  Save, 
  Users, 
  Award,
  TrendingUp,
  Percent,
  CheckCircle2,
  ListChecks,
  Info
} from 'lucide-react';

const TeacherGradingPortal = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [existingGrades, setExistingGrades] = useState([]);
  const [classStats, setClassStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Bulk Edit Table State
  const [bulkGrades, setBulkGrades] = useState({});
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  // Single Edit Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [letterGrade, setLetterGrade] = useState('A');
  const [numericalScore, setNumericalScore] = useState(90);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const fetchTeacherCourses = async () => {
    try {
      setLoading(true);
      const res = await courseApi.getMyCourses();
      setCourses(res.data);
      if (res.data.length > 0) {
        setSelectedCourseId(res.data[0].id);
        loadCourseRosterAndGrades(res.data[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Could not fetch taught courses.');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const courseId = parseInt(e.target.value);
    setSelectedCourseId(courseId);
    const found = courses.find(c => c.id === courseId);
    if (found) {
      loadCourseRosterAndGrades(found);
    }
  };

  const loadCourseRosterAndGrades = async (courseObj) => {
    setSelectedCourse(courseObj);
    setError('');
    try {
      const [gradesRes, statsRes] = await Promise.all([
        gradeApi.getCourseGrades(courseObj.id),
        gradeApi.getCourseStats(courseObj.id)
      ]);
      setExistingGrades(gradesRes.data);
      setClassStats(statsRes.data);

      // Initialize bulk grades state for table inputs
      const initialBulk = {};
      courseObj.students?.forEach(student => {
        const existing = gradesRes.data.find(g => g.student?.id === student.id);
        initialBulk[student.id] = {
          letterGrade: existing?.letterGrade || 'A',
          numericalScore: existing?.numericalScore || 90,
          remarks: existing?.remarks || ''
        };
      });
      setBulkGrades(initialBulk);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkInputChange = (studentId, field, value) => {
    setBulkGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleBulkSubmit = async () => {
    if (!selectedCourse) return;
    setBulkSubmitting(true);
    setError('');
    setSuccess('');

    const payload = Object.entries(bulkGrades).map(([studentId, data]) => ({
      studentId: parseInt(studentId),
      courseId: selectedCourse.id,
      letterGrade: data.letterGrade,
      numericalScore: parseFloat(data.numericalScore),
      remarks: data.remarks
    }));

    try {
      await gradeApi.submitBulkGrades(payload);
      setSuccess('All student roster grades updated successfully!');
      loadCourseRosterAndGrades(selectedCourse);
    } catch (err) {
      console.error(err);
      setError('Failed to save bulk grades.');
    } finally {
      setBulkSubmitting(false);
    }
  };

  const applyPresetScore = (score, letter) => {
    setNumericalScore(score);
    setLetterGrade(letter);
  };

  const openGradeModal = (student) => {
    setSelectedStudent(student);
    const existing = existingGrades.find(g => g.student?.id === student.id);
    if (existing) {
      setLetterGrade(existing.letterGrade || 'A');
      setNumericalScore(existing.numericalScore || 90);
      setRemarks(existing.remarks || '');
    } else {
      setLetterGrade('A');
      setNumericalScore(90);
      setRemarks('');
    }
    setModalOpen(true);
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await gradeApi.submitGrade({
        studentId: selectedStudent.id,
        courseId: selectedCourse.id,
        letterGrade,
        numericalScore: parseFloat(numericalScore),
        remarks
      });
      setSuccess(`Grade updated for ${selectedStudent.username}`);
      setModalOpen(false);
      loadCourseRosterAndGrades(selectedCourse);
    } catch (err) {
      console.error(err);
      setError('Failed to submit grade.');
    } finally {
      setSubmitting(false);
    }
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
          <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">Faculty Portal</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1 flex items-center gap-3">
            <UserCheck className="h-8 w-8 text-blue-300" />
            Class Roster & Grading Portal
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Faculty Instructor: <span className="font-bold text-white">{user?.username}</span>
          </p>
        </div>

        {/* Course Selector Dropdown */}
        <div className="min-w-[260px]">
          <label className="block text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">
            Select Taught Course
          </label>
          <select
            value={selectedCourseId}
            onChange={handleCourseChange}
            className="w-full px-4 py-2.5 bg-white rounded-xl border border-transparent text-[#0f224a] font-bold text-sm focus:outline-none shadow-md"
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.courseCode} - {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Demo & Section Explanation Banner */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-slate-800 text-xs leading-relaxed space-y-1 shadow-xs">
        <div className="flex items-center gap-2 font-extrabold text-[#0f224a] text-sm">
          <Info className="h-4 w-4 text-blue-600" />
          Feature Demo Guide: Faculty Grading & Class Roster Analytics
        </div>
        <p>
          Instructors can select any assigned course from the top dropdown to view enrolled students, monitor 
          **Class Average %, Pass Rates, and Score Distributions**. You can edit grades in bulk directly in the table and click <strong>"Save All Roster Grades"</strong>, or open the single student edit modal for preset shortcuts (`A-95%`, `B-85%`).
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl border border-emerald-250 bg-emerald-50 text-emerald-800 text-sm font-medium">
          {success}
        </div>
      )}

      {/* Class Performance Analytics Cards */}
      {classStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="navy-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-900">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Class Average</span>
              <h4 className="text-2xl font-black text-[#0f224a] mt-0.5">{classStats.averageScore}%</h4>
            </div>
          </div>

          <div className="navy-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pass Rate %</span>
              <h4 className="text-2xl font-black text-[#0f224a] mt-0.5">{classStats.passRatePercentage}%</h4>
            </div>
          </div>

          <div className="navy-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-900">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Highest Score</span>
              <h4 className="text-2xl font-black text-[#0f224a] mt-0.5">{classStats.highestScore}%</h4>
            </div>
          </div>

          <div className="navy-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-900">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Graded</span>
              <h4 className="text-2xl font-black text-[#0f224a] mt-0.5">{classStats.totalGraded}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Roster & Grade Table */}
      {selectedCourse && (
        <div className="navy-card rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-extrabold text-[#0f224a] text-base flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-blue-600" />
              Class Roster & Quick Grade Table ({selectedCourse.students?.length || 0})
            </h3>
            {selectedCourse.students?.length > 0 && (
              <button
                onClick={handleBulkSubmit}
                disabled={bulkSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f224a] hover:bg-blue-900 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {bulkSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save All Roster Grades
              </button>
            )}
          </div>

          {!selectedCourse.students || selectedCourse.students.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm bg-white">
              No students are currently enrolled in this course section.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-[#0f224a] font-black uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Student Username</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Letter Grade</th>
                    <th className="px-6 py-3.5">Score %</th>
                    <th className="px-6 py-3.5">Faculty Remarks</th>
                    <th className="px-6 py-3.5 text-right">Modal Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-medium">
                  {selectedCourse.students.map((student) => {
                    const studentBulk = bulkGrades[student.id] || { letterGrade: 'A', numericalScore: 90, remarks: '' };

                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3.5 font-bold text-[#0f224a]">{student.username}</td>
                        <td className="px-6 py-3.5 text-slate-600 text-xs">{student.email}</td>
                        <td className="px-6 py-3.5">
                          <select
                            value={studentBulk.letterGrade}
                            onChange={(e) => handleBulkInputChange(student.id, 'letterGrade', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-[#0f224a] focus:outline-none focus:border-[#0f224a]"
                          >
                            <option value="A">A (4.0)</option>
                            <option value="A-">A- (3.7)</option>
                            <option value="B+">B+ (3.3)</option>
                            <option value="B">B (3.0)</option>
                            <option value="B-">B- (2.7)</option>
                            <option value="C+">C+ (2.3)</option>
                            <option value="C">C (2.0)</option>
                            <option value="C-">C- (1.7)</option>
                            <option value="D">D (1.0)</option>
                            <option value="F">F (0.0)</option>
                          </select>
                        </td>
                        <td className="px-6 py-3.5">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={studentBulk.numericalScore}
                            onChange={(e) => handleBulkInputChange(student.id, 'numericalScore', e.target.value)}
                            className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                          />
                        </td>
                        <td className="px-6 py-3.5">
                          <input
                            type="text"
                            value={studentBulk.remarks}
                            placeholder="Add remarks..."
                            onChange={(e) => handleBulkInputChange(student.id, 'remarks', e.target.value)}
                            className="w-full max-w-xs px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#0f224a]"
                          />
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => openGradeModal(student)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0f224a] transition-colors"
                            title="Detailed Modal Editor"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Single Edit Modal */}
      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative border border-slate-100">
            <h3 className="text-xl font-black text-[#0f224a]">
              Assign Grade: {selectedStudent.username}
            </h3>

            {/* Quick Score Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Score Shortcuts</span>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => applyPresetScore(95, 'A')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold"
                >
                  A (95%)
                </button>
                <button 
                  type="button" 
                  onClick={() => applyPresetScore(85, 'B')}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold"
                >
                  B (85%)
                </button>
                <button 
                  type="button" 
                  onClick={() => applyPresetScore(75, 'C')}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold"
                >
                  C (75%)
                </button>
                <button 
                  type="button" 
                  onClick={() => applyPresetScore(50, 'F')}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold"
                >
                  F (50%)
                </button>
              </div>
            </div>

            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Letter Grade *
                </label>
                <select
                  value={letterGrade}
                  onChange={(e) => setLetterGrade(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                >
                  <option value="A">A (4.0 GPA)</option>
                  <option value="A-">A- (3.7 GPA)</option>
                  <option value="B+">B+ (3.3 GPA)</option>
                  <option value="B">B (3.0 GPA)</option>
                  <option value="B-">B- (2.7 GPA)</option>
                  <option value="C+">C+ (2.3 GPA)</option>
                  <option value="C">C (2.0 GPA)</option>
                  <option value="C-">C- (1.7 GPA)</option>
                  <option value="D">D (1.0 GPA)</option>
                  <option value="F">F (0.0 GPA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Numerical Score (0 - 100)% *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={numericalScore}
                  onChange={(e) => setNumericalScore(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Faculty Remarks / Feedback
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional comments regarding assignments, exams, or participation..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#0f224a]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0f224a] hover:bg-blue-900 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Single Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherGradingPortal;
