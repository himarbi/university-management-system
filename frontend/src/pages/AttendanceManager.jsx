import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { attendanceApi, courseApi } from '../services/api';
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle, Loader2, Save, Users, Info } from 'lucide-react';

const AttendanceManager = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Recording form state (Teacher/Admin)
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [recordingData, setRecordingData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'STUDENT') {
      fetchStudentAttendance();
    } else {
      fetchTeacherCourses();
    }
  }, [user]);

  const fetchStudentAttendance = async () => {
    try {
      setLoading(true);
      const res = await attendanceApi.getMyAttendance();
      setAttendanceLogs(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch attendance records.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherCourses = async () => {
    try {
      setLoading(true);
      const res = await courseApi.getMyCourses();
      setCourses(res.data);
      if (res.data.length > 0) {
        setSelectedCourseId(res.data[0].id);
        loadCourseAttendance(res.data[0]);
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
      loadCourseAttendance(found);
    }
  };

  const loadCourseAttendance = async (courseObj) => {
    setSelectedCourse(courseObj);
    setError('');
    try {
      const res = await attendanceApi.getCourseAttendance(courseObj.id);
      setAttendanceLogs(res.data);

      // Initialize recording state for enrolled students
      const initialRecording = {};
      courseObj.students?.forEach(student => {
        const existing = res.data.find(a => a.student?.id === student.id && a.date === attendanceDate);
        initialRecording[student.id] = {
          status: existing?.status || 'PRESENT',
          remarks: existing?.remarks || ''
        };
      });
      setRecordingData(initialRecording);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = (studentId, field, value) => {
    setRecordingData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedCourse) return;
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const promises = Object.entries(recordingData).map(([studentId, data]) => 
        attendanceApi.recordAttendance({
          studentId: parseInt(studentId),
          courseId: selectedCourse.id,
          date: attendanceDate,
          status: data.status,
          remarks: data.remarks
        })
      );
      await Promise.all(promises);
      setSuccess(`Attendance recorded for ${attendanceDate}`);
      loadCourseAttendance(selectedCourse);
    } catch (err) {
      console.error(err);
      setError('Failed to record attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'PRESENT') return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200"><CheckCircle2 className="h-3.5 w-3.5" /> Present</span>;
    if (status === 'ABSENT') return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200"><XCircle className="h-3.5 w-3.5" /> Absent</span>;
    if (status === 'LATE') return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200"><Clock className="h-3.5 w-3.5" /> Late</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200"><AlertCircle className="h-3.5 w-3.5" /> Excused</span>;
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0f224a]" />
      </div>
    );
  }

  // Student Stats Calculation
  const totalLogs = attendanceLogs.length;
  const presentCount = attendanceLogs.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
  const attendancePercentage = totalLogs > 0 ? Math.round((presentCount / totalLogs) * 100) : 100;

  return (
    <div className="space-y-8 select-none animate-[fadeIn_0.2s_ease-out]">
      
      {/* Header Banner */}
      <div className="bg-[#0f224a] text-white p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
        <div>
          <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">Attendance Tracking Services</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-300" />
            Class Attendance Portal
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {user?.role === 'STUDENT' ? `Track your attendance rate across enrolled courses.` : `Record daily attendance for your taught classes.`}
          </p>
        </div>

        {/* Student Rate Card or Teacher Course Selector */}
        {user?.role === 'STUDENT' ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl text-center">
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Attendance Rate</span>
            <span className="text-3xl font-black text-white">{attendancePercentage}%</span>
            <span className="text-[10px] text-blue-200 block font-semibold">{presentCount} / {totalLogs} Sessions Present</span>
          </div>
        ) : (
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
        )}
      </div>

      {/* Demo & Section Explanation Banner */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-slate-800 text-xs leading-relaxed space-y-1 shadow-xs">
        <div className="flex items-center gap-2 font-extrabold text-[#0f224a] text-sm">
          <Info className="h-4 w-4 text-blue-600" />
          Feature Demo Guide: Daily Class Attendance Tracker
        </div>
        <p>
          {user?.role === 'STUDENT' 
            ? 'Students can monitor their overall class attendance rate (% Present), total logged sessions, and detailed date history across all enrolled courses.'
            : 'Teachers can pick a date using the calendar picker, select attendance statuses (PRESENT, ABSENT, LATE, EXCUSED) for each student in the roster, and click "Save Attendance Sheet" to record daily logs.'
          }
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

      {/* STUDENT VIEW - Attendance Log Table */}
      {user?.role === 'STUDENT' && (
        <div className="navy-card rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-extrabold text-[#0f224a] text-base">Personal Attendance History</h3>
            <span className="text-xs font-bold text-slate-500">{attendanceLogs.length} Sessions Logged</span>
          </div>

          {attendanceLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm bg-white">
              No attendance logs recorded yet for your courses.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-[#0f224a] font-black uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Course Code</th>
                    <th className="px-6 py-3.5">Course Name</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-medium">
                  {attendanceLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{log.date}</td>
                      <td className="px-6 py-4 font-bold text-[#0f224a]">
                        <span className="px-2.5 py-1 rounded bg-blue-50 border border-blue-100 text-blue-900 text-xs">
                          {log.courseCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">{log.courseName}</td>
                      <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 italic">{log.remarks || 'None'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TEACHER / ADMIN VIEW - Attendance Recorder Table */}
      {user?.role !== 'STUDENT' && selectedCourse && (
        <div className="navy-card rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-extrabold text-[#0f224a] text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Record Daily Attendance ({selectedCourse.students?.length || 0} Students)
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
              />
              <button
                onClick={handleSaveAttendance}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f224a] hover:bg-blue-900 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Attendance Sheet
              </button>
            </div>
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
                    <th className="px-6 py-3.5">Student Name</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Attendance Status</th>
                    <th className="px-6 py-3.5">Remarks / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-medium">
                  {selectedCourse.students.map(student => {
                    const data = recordingData[student.id] || { status: 'PRESENT', remarks: '' };

                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0f224a]">{student.username}</td>
                        <td className="px-6 py-4 text-slate-600 text-xs">{student.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={data.status}
                            onChange={(e) => handleStatusChange(student.id, 'status', e.target.value)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                          >
                            <option value="PRESENT">PRESENT ✅</option>
                            <option value="ABSENT">ABSENT ❌</option>
                            <option value="LATE">LATE ⏰</option>
                            <option value="EXCUSED">EXCUSED ℹ️</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={data.remarks}
                            placeholder="Optional note..."
                            onChange={(e) => handleStatusChange(student.id, 'remarks', e.target.value)}
                            className="w-full max-w-sm px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#0f224a]"
                          />
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

    </div>
  );
};

export default AttendanceManager;
