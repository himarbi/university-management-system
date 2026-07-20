import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseApi, userApi } from '../services/api';
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
  Bookmark,
  Layers,
  Award,
  Users,
  Info
} from 'lucide-react';

const CourseCatalog = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('CREATE');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Form Fields
  const [courseCode, setCourseCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [credits, setCredits] = useState(3);
  const [maxCapacity, setMaxCapacity] = useState(30);
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
      const res = await courseApi.getAll();
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
      const res = await userApi.getAll();
      const teacherList = res.data.filter(u => u.role === 'TEACHER');
      setTeachers(teacherList);
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
    setDepartment('Computer Science');
    setCredits(3);
    setMaxCapacity(30);
    setTeacherId('');
    setFieldErrors({});
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setModalMode('EDIT');
    setSelectedCourse(course);
    setCourseCode(course.courseCode);
    setName(course.name);
    setDescription(course.description || '');
    setDepartment(course.department || 'Computer Science');
    setCredits(course.credits || 3);
    setMaxCapacity(course.maxCapacity || 30);
    setTeacherId(course.teacher?.id || '');
    setFieldErrors({});
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await courseApi.delete(id);
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
    setFieldErrors({});
    setSuccess('');

    const payload = {
      courseCode,
      name,
      description,
      department,
      credits: parseInt(credits),
      maxCapacity: parseInt(maxCapacity),
      teacher: teacherId ? { id: parseInt(teacherId) } : null
    };

    try {
      if (modalMode === 'CREATE') {
        await courseApi.create(payload);
        setSuccess('Course created successfully.');
      } else {
        await courseApi.update(selectedCourse.id, payload);
        setSuccess('Course updated successfully.');
      }
      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        setError('Validation failed. Please correct the highlighted fields.');
      } else {
        setError(err.response?.data?.message || err.response?.data || 'Failed to submit course data.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEnrollment = async (courseId, enrolled) => {
    try {
      setError('');
      setSuccess('');
      if (enrolled) {
        await courseApi.unenroll(courseId);
        setSuccess('Successfully unenrolled from the course.');
      } else {
        await courseApi.enroll(courseId);
        setSuccess('Successfully enrolled in the course!');
      }
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Enrollment action failed.');
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      (c.department && c.department.toLowerCase().includes(search.toLowerCase())) ||
      (c.teacher && c.teacher.username.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = selectedDept ? c.department === selectedDept : true;
    return matchesSearch && matchesDept;
  });

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
            Course Directory & Enrollment
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Browse course offerings, check seat capacity, filter by department, and enroll instantly.
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

      {/* Demo & Section Explanation Banner */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-slate-800 text-xs leading-relaxed space-y-1 shadow-xs">
        <div className="flex items-center gap-2 font-extrabold text-[#0f224a] text-sm">
          <Info className="h-4 w-4 text-blue-600" />
          Feature Demo Guide: Course Directory & Instant Self-Enrollment
        </div>
        <p>
          Students can click <strong>"Enroll"</strong> or <strong>"Drop"</strong> to register for courses in real-time. 
          Admins can click <strong>"Create Course"</strong> or edit syllabus outlines and assign faculty professors. 
          Use the department filter dropdown to filter courses by department.
        </p>
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

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, title, or instructor..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] focus:ring-1 focus:ring-[#0f224a] text-sm text-slate-800 transition-all shadow-sm"
          />
        </div>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f224a] text-sm text-slate-800 shadow-sm"
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
          <option value="Business">Business</option>
        </select>
      </div>

      {/* Grid List */}
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
              const isFull = (course.studentCount || 0) >= (course.maxCapacity || 30);

              return (
                <div 
                  key={course.id} 
                  className="navy-card rounded-2xl flex flex-col justify-between p-6 relative overflow-hidden group hover:border-[#0f224a]/50 transition-all duration-200 shadow-md bg-white text-slate-800"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between mb-3">
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

                    <h3 className="font-extrabold text-[#0f224a] text-lg leading-snug group-hover:text-blue-700 transition-colors">
                      {course.name}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 my-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        <Layers className="h-3 w-3 text-slate-500" />
                        {course.department || 'Computer Science'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                        <Award className="h-3 w-3 text-amber-600" />
                        {course.credits || 3} Credits
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {course.description || 'No description available for this course.'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-150 space-y-4">
                    {/* Capacity Indicator Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-extrabold text-slate-600">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-slate-500" /> Seat Capacity
                        </span>
                        <span className={isFull ? "text-rose-600 font-black" : "text-slate-700"}>
                          {course.studentCount || 0} / {course.maxCapacity || 30} {isFull ? '(FULL)' : ''}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${isFull ? 'bg-rose-500' : 'bg-[#0f224a]'}`}
                          style={{ width: `${Math.min(((course.studentCount || 0) / (course.maxCapacity || 30)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <UserCheck className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-500 font-medium">Instructor:</span>
                        <span className="font-bold text-[#0f224a]">
                          {course.teacher?.username || 'Unassigned'}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {user?.role === 'ADMIN' && (
                          <>
                            <button
                              onClick={() => openEditModal(course)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="Edit Course"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(course.id)}
                              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                              title="Delete Course"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {user?.role === 'TEACHER' && isAssignedTeacher && (
                          <button
                            onClick={() => openEditModal(course)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Update Syllabus"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {user?.role === 'STUDENT' && (
                          <button
                            onClick={() => handleEnrollment(course.id, enrolled)}
                            disabled={!enrolled && isFull}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                              enrolled
                                ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                                : isFull
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : 'bg-[#0f224a] hover:bg-blue-900 text-white'
                            }`}
                          >
                            {enrolled ? (
                              <>
                                <MinusCircle className="h-3.5 w-3.5" />
                                Drop
                              </>
                            ) : (
                              <>
                                <PlusCircle className="h-3.5 w-3.5" />
                                {isFull ? 'Full' : 'Enroll'}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal - Create/Edit Course */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-black text-[#0f224a]">
              {modalMode === 'CREATE' ? 'Create New Course' : 'Edit Course Details'}
            </h3>

            {error && (
              <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Course Code * (e.g. CS-101)
                </label>
                <input
                  type="text"
                  required
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                  placeholder="CS-101"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0f224a] ${
                    fieldErrors.courseCode ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {fieldErrors.courseCode && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1">{fieldErrors.courseCode}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Introduction to Computer Science"
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-800 focus:outline-none focus:border-[#0f224a] ${
                    fieldErrors.name ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                    Credits (1-6) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    required
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                  />
                </div>
              </div>

              {user?.role === 'ADMIN' && (
                <div>
                  <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                    Assign Faculty Instructor
                  </label>
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#0f224a]"
                  >
                    <option value="">-- Unassigned --</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.username} ({t.email})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Syllabus Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of course content, objectives, and prerequisites..."
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
                  disabled={formLoading}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0f224a] hover:bg-blue-900 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {formLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {modalMode === 'CREATE' ? 'Save Course' : 'Update Course'}
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
