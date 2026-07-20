import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  UserCheck, 
  GraduationCap, 
  Loader2, 
  X,
  PlusCircle,
  MinusCircle,
  FileText,
  Bookmark
} from 'lucide-react';

const CourseCatalog = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('CREATE');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Form Fields
  const [courseCode, setCourseCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
    if (user?.role === 'ADMIN') {
      fetchTeachers();
    }

    const params = new URLSearchParams(location.search);
    if (params.get('create') === 'true') {
      openCreateModal();
    }
  }, [location, user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve courses directory.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/users/teachers');
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setModalMode('CREATE');
    setSelectedCourse(null);
    setCourseCode('');
    setName('');
    setDescription('');
    setTeacherId('');
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setModalMode('EDIT');
    setSelectedCourse(course);
    setCourseCode(course.courseCode);
    setName(course.name);
    setDescription(course.description || '');
    setTeacherId(course.teacher?.id || '');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setSuccess('Course deleted successfully.');
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError('Could not delete selected course.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      courseCode,
      name,
      description,
      teacher: teacherId ? { id: parseInt(teacherId) } : null
    };

    try {
      if (modalMode === 'CREATE') {
        await api.post('/courses', payload);
        setSuccess('Course created successfully.');
      } else {
        await api.put(`/courses/${selectedCourse.id}`, payload);
        setSuccess('Course updated successfully.');
      }
      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data || 'Failed to submit course data.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEnrollment = async (courseId, enrolled) => {
    try {
      setError('');
      setSuccess('');
      const action = enrolled ? 'unenroll' : 'enroll';
      await api.post(`/courses/${courseId}/${action}`);
      setSuccess(`Successfully ${enrolled ? 'unenrolled from' : 'enrolled in'} the course!`);
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError('Enrollment action failed.');
    }
  };

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.courseCode.toLowerCase().includes(search.toLowerCase()) ||
    (c.teacher && c.teacher.username.toLowerCase().includes(search.toLowerCase()))
  );

  const isStudentEnrolled = (course) => {
    return course.students?.some(s => s.id === user?.id);
  };

  return (
    <div className="space-y-6 select-none animate-[fadeIn_0.2s_ease-out]">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f224a] flex items-center gap-3">
            <BookOpen className="h-7 w-7" />
            Course Directories
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Browse active course plans, enroll as a student, and update syllabus outlines as a teacher.
          </p>
        </div>
        {user?.role === 'ADMIN' && (
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f224a] hover:bg-blue-900 text-white text-sm font-bold shadow-md transition-all"
          >
            <Plus className="h-5 w-5" />
            Create Course
          </button>
        )}
      </div>

      {/* Alert Feedbacks */}
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

      {/* Search Input Filter */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450">
          <Search className="h-4.5 w-4.5" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code, title, or teacher..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] focus:ring-1 focus:ring-[#0f224a] text-sm text-slate-800 transition-all shadow-sm"
        />
      </div>

      {/* Grid List - Solid White Navy Cards */}
      {loading ? (
        <div className="flex h-48 items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#0f224a]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
              No courses match your query.
            </div>
          ) : (
            filteredCourses.map((course) => {
              const enrolled = isStudentEnrolled(course);
              const isAssignedTeacher = course.teacher?.id === user?.id;

              return (
                <div 
                  key={course.id} 
                  className="navy-card rounded-2xl flex flex-col justify-between p-6 relative overflow-hidden group hover:border-[#0f224a]/50 transition-all duration-200 shadow-md bg-white text-slate-800"
                >
                  <div>
                    {/* Top Tag & Code */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[10px] text-blue-900 font-bold uppercase tracking-wider">
                        {course.courseCode}
                      </span>
                      {enrolled && (
                        <span className="flex items-center gap-1 text-[10px] text-blue-800 font-bold uppercase">
                          <Bookmark className="h-3.5 w-3.5 fill-blue-800" />
                          Enrolled
                        </span>
                      )}
                    </div>

                    {/* Course Title */}
                    <h3 className="text-base font-black text-[#0f224a] mb-2 truncate">
                      {course.name}
                    </h3>

                    {/* Course Description */}
                    <p className="text-xs text-slate-650 leading-relaxed mb-6 line-clamp-3">
                      {course.description || 'No description provided for this course syllabus yet.'}
                    </p>
                  </div>

                  {/* Metadata and Actions */}
                  <div>
                    <div className="h-px bg-slate-100 mb-4"></div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      {/* Teacher Profile */}
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#0f224a] border border-slate-200 shrink-0">
                          <UserCheck className="h-3.5 w-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Instructor</span>
                          <span className="text-xs font-bold text-slate-700 truncate block">
                            {course.teacher?.username || 'Unassigned'}
                          </span>
                        </div>
                      </div>

                      {/* Students Count */}
                      <div className="flex items-center gap-1.5 shrink-0 text-slate-500">
                        <GraduationCap className="h-4 w-4" />
                        <span className="text-xs font-bold">{course.studentCount}</span>
                      </div>
                    </div>

                    {/* Button controls */}
                    <div className="flex gap-2">
                      
                      {/* Admin controls */}
                      {user?.role === 'ADMIN' && (
                        <>
                          <button
                            onClick={() => openEditModal(course)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 hover:text-slate-900 transition-all"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="p-2 border border-slate-200 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl transition-all"
                            title="Delete Course"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </>
                      )}

                      {/* Teacher controls */}
                      {user?.role === 'TEACHER' && isAssignedTeacher && (
                        <button
                          onClick={() => openEditModal(course)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-105 hover:bg-slate-200 border border-slate-200 text-xs font-bold rounded-xl text-slate-700 hover:text-slate-900 transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Update Details
                        </button>
                      )}

                      {/* Student controls */}
                      {user?.role === 'STUDENT' && (
                        <button
                          onClick={() => handleEnrollment(course.id, enrolled)}
                          className={`w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                            enrolled
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-[#0f224a] hover:bg-blue-900 text-white shadow-sm'
                          }`}
                        >
                          {enrolled ? (
                            <>
                              <MinusCircle className="h-4 w-4" />
                              Unenroll
                            </>
                          ) : (
                            <>
                              <PlusCircle className="h-4 w-4" />
                              Self Enroll
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal - Solid White Navy */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-xs select-none">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 relative border border-slate-200 shadow-2xl animate-[scaleUp_0.15s_ease-out] text-slate-800">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-[#0f224a]"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-black text-[#0f224a] flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <FileText className="h-5 w-5" />
              {modalMode === 'CREATE' ? 'Add Course File' : 'Edit Syllabus Details'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  required
                  disabled={user?.role !== 'ADMIN'}
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CS101"
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] text-sm text-slate-800 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Introduction to Programming"
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] text-sm text-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Syllabus Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter syllabus details..."
                  rows="4"
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] text-sm text-slate-800 transition-all resize-none"
                ></textarea>
              </div>

              {user?.role === 'ADMIN' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Assign Instructor
                  </label>
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] text-sm text-slate-800 transition-all"
                  >
                    <option value="">Unassigned</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.username} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 mt-6 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f224a] hover:bg-blue-900 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  {formLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>{modalMode === 'CREATE' ? 'Create Class' : 'Save Changes'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseCatalog;
