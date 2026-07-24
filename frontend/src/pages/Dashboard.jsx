import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseApi, userApi, analyticsApi } from '../services/api';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  ArrowUpRight, 
  BookMarked,
  BarChart3,
  Percent,
  Info
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, analyticsRes] = await Promise.all([
          courseApi.getAll(),
          analyticsApi.getSummary()
        ]);
        setCourses(coursesRes.data);
        setAnalytics(analyticsRes.data);

        if (user?.role === 'ADMIN') {
          const usersRes = await userApi.getAll();
          setUsers(usersRes.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Could not retrieve dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const studentCourses = courses.filter(c => 
    c.students?.some(s => s.id === user?.id)
  );

  const teacherCourses = courses.filter(c => 
    c.teacher?.id === user?.id
  );

  const renderStats = () => {
    if (user?.role === 'ADMIN') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="navy-card p-6 rounded-2xl flex items-center gap-5 border-l-4 border-l-[#0f224a] navy-card-hover">
              <div className="p-3 bg-[#0f224a]/10 rounded-xl text-[#0f224a]">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Users</p>
                <h3 className="text-2xl font-black text-[#0f224a] mt-0.5">{users.length}</h3>
              </div>
            </div>

            <div className="navy-card p-6 rounded-2xl flex items-center gap-5 border-l-4 border-l-[#0f224a] navy-card-hover">
              <div className="p-[#0f224a]/10 rounded-xl text-[#0f224a] p-3">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Courses</p>
                <h3 className="text-2xl font-black text-[#0f224a] mt-0.5">{analytics?.totalCourses || courses.length}</h3>
              </div>
            </div>

            <div className="navy-card p-6 rounded-2xl flex items-center gap-5 border-l-4 border-l-[#0f224a] navy-card-hover">
              <div className="p-3 bg-[#0f224a]/10 rounded-xl text-[#0f224a]">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Enrollments</p>
                <h3 className="text-2xl font-black text-[#0f224a] mt-0.5">{analytics?.totalEnrollments || 0}</h3>
              </div>
            </div>

            <div className="navy-card p-6 rounded-2xl flex items-center gap-5 border-l-4 border-l-[#0f224a] navy-card-hover">
              <div className="p-3 bg-[#0f224a]/10 rounded-xl text-[#0f224a]">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Capacity Usage</p>
                <h3 className="text-2xl font-black text-[#0f224a] mt-0.5">{analytics?.capacityUtilizationRate || 0}%</h3>
              </div>
            </div>
          </div>

          {analytics && (
            <div className="navy-card p-6 rounded-2xl space-y-3 shadow-sm bg-white border border-slate-200">
              <div className="flex justify-between items-center text-sm font-extrabold text-[#0f224a]">
                <span className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-blue-600" />
                  Overall University Enrollment vs Max Capacity
                </span>
                <span>{analytics.totalEnrollments} / {analytics.totalCapacity} Seats Enrolled ({analytics.capacityUtilizationRate}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#0f224a] to-blue-600 h-3.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(analytics.capacityUtilizationRate, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (user?.role === 'TEACHER') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="navy-card p-6 rounded-2xl flex items-center gap-5 border-l-4 border-l-[#0f224a] navy-card-hover">
            <div className="p-3 bg-[#0f224a]/10 rounded-xl text-[#0f224a]">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Taught Courses</p>
              <h3 className="text-2xl font-black text-[#0f224a] mt-0.5">{teacherCourses.length}</h3>
            </div>
          </div>
          <div className="navy-card p-6 rounded-2xl flex items-center gap-5 border-l-4 border-l-[#0f224a] navy-card-hover">
            <div className="p-3 bg-[#0f224a]/10 rounded-xl text-[#0f224a]">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Enrolled Students</p>
              <h3 className="text-2xl font-black text-[#0f224a] mt-0.5">
                {teacherCourses.reduce((sum, c) => sum + (c.studentCount || 0), 0)}
              </h3>
            </div>
          </div>
          <div className="navy-card p-6 rounded-2xl flex items-center gap-5 border-l-4 border-l-[#0f224a] navy-card-hover">
            <div className="p-3 bg-[#0f224a]/10 rounded-xl text-[#0f224a]">
              <BookMarked className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Assigned Classes</p>
              <h3 className="text-2xl font-black text-[#0f224a] mt-0.5">{teacherCourses.length}</h3>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="navy-card p-6 rounded-2xl flex items-center gap-5 border-l-4 border-l-[#0f224a] navy-card-hover">
          <div className="p-3 bg-[#0f224a]/10 rounded-xl text-[#0f224a]">
            <BookMarked className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">My Enrolled Courses</p>
            <h3 className="text-2xl font-black text-[#0f224a] mt-0.5">{studentCourses.length}</h3>
          </div>
        </div>
        <div className="navy-card p-6 rounded-2xl flex items-center gap-5 border-l-4 border-l-[#0f224a] navy-card-hover">
          <div className="p-3 bg-[#0f224a]/10 rounded-xl text-[#0f224a]">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Available Courses</p>
            <h3 className="text-2xl font-black text-[#0f224a] mt-0.5">{courses.length}</h3>
          </div>
        </div>
        <div className="navy-card p-6 rounded-2xl flex items-center gap-5 border-l-4 border-l-[#0f224a] navy-card-hover">
          <div className="p-3 bg-[#0f224a]/10 rounded-xl text-[#0f224a]">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Faculty</p>
            <h3 className="text-2xl font-black text-[#0f224a] mt-0.5">
              {analytics?.totalTeachers || new Set(courses.map(c => c.teacher?.id).filter(Boolean)).size}
            </h3>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#0f224a] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      
      {/* Top Banner */}
      <div className="bg-[#0f224a] text-white p-8 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden shadow-lg">
        <div className="space-y-2">
          <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">Academic Portal Overview</span>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            System Dashboard
          </h2>
          <p className="text-blue-100 text-sm max-w-xl">
            Welcome to Odros University Portal. Use the sidebar to access dedicated pages. Use the sidebar top toggle button to minimize or expand the menu bar.
          </p>
        </div>
      </div>


      {error && (
        <div className="p-4 rounded-xl border border-rose-250 bg-rose-50 text-rose-800 text-sm font-medium">
          {error}
        </div>
      )}

      {renderStats()}

      {/* Clean Course Summary Section */}
      <div className="navy-card rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-extrabold text-[#0f224a] text-base flex items-center gap-2">
            <BookMarked className="h-5 w-5" />
            {user?.role === 'ADMIN' ? 'All System Courses' : 'My Assigned Courses'}
          </h3>
          <Link to="/courses" className="text-[#0f224a] hover:underline text-xs font-bold flex items-center gap-1">
            View All <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="divide-y divide-slate-150">
          {user?.role === 'ADMIN' && courses.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm bg-white">No courses available.</div>
          )}
          {user?.role === 'TEACHER' && teacherCourses.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm bg-white">You are not teaching any courses.</div>
          )}
          {user?.role === 'STUDENT' && studentCourses.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm bg-white">You are not enrolled in any courses.</div>
          )}

          {/* Render Admin Courses */}
          {user?.role === 'ADMIN' && courses.slice(0, 5).map(course => (
            <div key={course.id} className="p-6 flex items-start justify-between hover:bg-slate-50 transition-colors bg-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-650 font-bold uppercase">
                    {course.courseCode}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                    {course.department || 'Computer Science'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">
                    {course.credits || 3} Credits
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-1">{course.name}</h4>
                <p className="text-xs text-slate-500 max-w-lg line-clamp-1">{course.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Instructor</p>
                <p className="text-xs font-bold text-[#0f224a]">{course.teacher?.username || 'Unassigned'}</p>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                  Capacity: {course.studentCount} / {course.maxCapacity || 30}
                </p>
              </div>
            </div>
          ))}

          {/* Render Teacher Courses */}
          {user?.role === 'TEACHER' && teacherCourses.slice(0, 5).map(course => (
            <div key={course.id} className="p-6 flex items-start justify-between hover:bg-slate-50 transition-colors bg-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-800 font-bold uppercase">
                    {course.courseCode}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                    {course.department || 'Computer Science'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-1">{course.name}</h4>
                <p className="text-xs text-slate-500 max-w-lg line-clamp-1">{course.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Enrolled Students</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#0f224a] text-white text-xs font-bold mt-1 shadow-sm">
                  {course.studentCount || 0} / {course.maxCapacity || 30}
                </span>
              </div>
            </div>
          ))}

          {/* Render Student Courses */}
          {user?.role === 'STUDENT' && studentCourses.slice(0, 5).map(course => (
            <div key={course.id} className="p-6 flex items-start justify-between hover:bg-slate-50 transition-colors bg-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-105 text-[10px] text-blue-800 font-bold uppercase">
                    {course.courseCode}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">
                    {course.credits || 3} Credits
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-1">{course.name}</h4>
                <p className="text-xs text-slate-500 max-w-lg line-clamp-1">{course.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Instructor</p>
                <p className="text-xs font-bold text-slate-800">{course.teacher?.username || 'TBD'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
