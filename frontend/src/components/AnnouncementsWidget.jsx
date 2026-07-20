import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { announcementApi } from '../services/api';
import { Bell, Plus, Trash2, Megaphone, Loader2, X, Calendar, User } from 'lucide-react';

const AnnouncementsWidget = ({ fullPage = false }) => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State for Admin
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetRole, setTargetRole] = useState('ALL');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await announcementApi.getAll();
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve campus announcements.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await announcementApi.create({
        title,
        content,
        targetRole
      });
      setSuccess('Announcement published successfully!');
      setTitle('');
      setContent('');
      setTargetRole('ALL');
      setModalOpen(false);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data || 'Failed to post announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement broadcast?')) return;
    try {
      await announcementApi.delete(id);
      setSuccess('Announcement removed.');
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setError('Failed to delete announcement.');
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-[#0f224a] text-lg flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-blue-600" />
          University Announcements & Campus Broadcasts
        </h3>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f224a] hover:bg-blue-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            Post Announcement
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium">
          {success}
        </div>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="flex h-32 items-center justify-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="h-6 w-6 animate-spin text-[#0f224a]" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
          No campus announcements published yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {announcements.map((a) => (
            <div 
              key={a.id} 
              className="navy-card p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[10px] text-blue-900 font-bold uppercase tracking-wider">
                    Audience: {a.targetRole}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="h-3.5 w-3.5" />
                      {a.createdAt}
                    </span>
                    {user?.role === 'ADMIN' && (
                      <button
                        onClick={() => handleDeleteAnnouncement(a.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="Delete Announcement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="font-extrabold text-[#0f224a] text-base mb-2">
                  {a.title}
                </h4>

                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {a.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>Posted by Administrator: <strong className="text-slate-700">{a.author?.username || 'System Admin'}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Broadcast Composer Modal */}
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
              Post Campus Announcement
            </h3>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Examination Schedule Announcement"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Target Audience *
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                >
                  <option value="ALL">Everyone (All Students & Faculty)</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="TEACHER">Faculty Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Announcement Body Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detailed announcement description..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#0f224a]"
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
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Broadcast Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AnnouncementsWidget;
