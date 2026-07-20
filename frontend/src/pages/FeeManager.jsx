import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { feeApi, userApi } from '../services/api';
import { CreditCard, DollarSign, CheckCircle2, AlertTriangle, Clock, Loader2, Plus, X, Info } from 'lucide-react';

const FeeManager = () => {
  const { user } = useAuth();
  const [statements, setStatements] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Payment Modal State
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [submittingPay, setSubmittingPay] = useState(false);

  // Admin Generate Modal State
  const [genModalOpen, setGenModalOpen] = useState(false);
  const [genStudentId, setGenStudentId] = useState('');
  const [genTuitionAmount, setGenTuitionAmount] = useState(1200);
  const [submittingGen, setSubmittingGen] = useState(false);

  useEffect(() => {
    fetchStatements();
    if (user?.role === 'ADMIN') {
      fetchStudents();
    }
  }, [user]);

  const fetchStatements = async () => {
    try {
      setLoading(true);
      if (user?.role === 'ADMIN') {
        const res = await feeApi.getAllStatements();
        setStatements(res.data);
      } else {
        const res = await feeApi.getMyStatement();
        setStatements(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve tuition fee statements.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await userApi.getAll();
      setStudents(res.data.filter(u => u.role === 'STUDENT'));
    } catch (err) {
      console.error(err);
    }
  };

  const openPayModal = (statement) => {
    setSelectedStatement(statement);
    setPaymentAmount(statement.balance || 100);
    setPaymentMethod('CREDIT_CARD');
    setPayModalOpen(true);
  };

  const handleMakePayment = async (e) => {
    e.preventDefault();
    setSubmittingPay(true);
    setError('');
    setSuccess('');

    try {
      await feeApi.makePayment({
        statementId: selectedStatement.id,
        paymentAmount: parseFloat(paymentAmount),
        paymentMethod
      });
      setSuccess('Payment processed successfully!');
      setPayModalOpen(false);
      fetchStatements();
    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
    } finally {
      setSubmittingPay(false);
    }
  };

  const handleGenerateStatement = async (e) => {
    e.preventDefault();
    setSubmittingGen(true);
    setError('');
    setSuccess('');

    try {
      await feeApi.generateStatement(genStudentId, parseFloat(genTuitionAmount));
      setSuccess('Tuition fee statement generated!');
      setGenModalOpen(false);
      fetchStatements();
    } catch (err) {
      console.error(err);
      setError('Failed to generate fee statement.');
    } finally {
      setSubmittingGen(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'PAID') return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200"><CheckCircle2 className="h-3.5 w-3.5" /> Fully Paid</span>;
    if (status === 'OVERDUE') return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black border border-rose-200"><AlertTriangle className="h-3.5 w-3.5" /> Overdue</span>;
    return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black border border-amber-200"><Clock className="h-3.5 w-3.5" /> Pending Balance</span>;
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
          <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">Bursar & Financial Services</span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1 flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-blue-300" />
            Tuition & Fee Portal
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {user?.role === 'ADMIN' ? 'Manage university fee collections and generate student billing statements.' : 'View fee statements, itemized breakdowns, and submit tuition payments.'}
          </p>
        </div>

        {user?.role === 'ADMIN' && (
          <button
            onClick={() => { setGenStudentId(students[0]?.id || ''); setGenModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#0f224a] font-bold text-sm shadow-md transition-all border border-transparent"
          >
            <Plus className="h-4.5 w-4.5" />
            Generate Fee Statement
          </button>
        )}
      </div>

      {/* Demo & Section Explanation Banner */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-slate-800 text-xs leading-relaxed space-y-1 shadow-xs">
        <div className="flex items-center gap-2 font-extrabold text-[#0f224a] text-sm">
          <Info className="h-4 w-4 text-blue-600" />
          Feature Demo Guide: Tuition & Fee Statement Manager
        </div>
        <p>
          Students can view their itemized term fee breakdown (Tuition per credit, Lab fee, Registration fee), remaining balance, and payment status (`PAID`, `PENDING`, `OVERDUE`). Click <strong>"Make Payment"</strong> to simulate paying tuition. Admins can click <strong>"Generate Fee Statement"</strong> to bill any student account.
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

      {/* Statements Directory */}
      <div className="navy-card rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-extrabold text-[#0f224a] text-base flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Academic Billing & Payment Statements
          </h3>
          <span className="text-xs font-bold text-slate-500">{statements.length} Statements Recorded</span>
        </div>

        {statements.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm bg-white">
            No tuition fee statements found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-[#0f224a] font-black uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  {user?.role === 'ADMIN' && <th className="px-6 py-3.5">Student Account</th>}
                  <th className="px-6 py-3.5">Academic Term</th>
                  <th className="px-6 py-3.5">Tuition</th>
                  <th className="px-6 py-3.5">Lab & Reg Fees</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Paid</th>
                  <th className="px-6 py-3.5">Remaining Balance</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-medium">
                {statements.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    {user?.role === 'ADMIN' && (
                      <td className="px-6 py-4 font-bold text-[#0f224a]">
                        {s.student?.username} <span className="text-slate-400 font-normal text-xs">({s.student?.email})</span>
                      </td>
                    )}
                    <td className="px-6 py-4 font-bold text-slate-800">{s.academicTerm}</td>
                    <td className="px-6 py-4 text-slate-700">${s.tuitionAmount?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-600">${((s.labFee || 0) + (s.registrationFee || 0)).toFixed(2)}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">${s.totalFee?.toFixed(2)}</td>
                    <td className="px-6 py-4 font-bold text-emerald-700">${s.paidAmount?.toFixed(2)}</td>
                    <td className="px-6 py-4 font-black text-rose-700">${s.balance?.toFixed(2)}</td>
                    <td className="px-6 py-4">{getStatusBadge(s.status)}</td>
                    <td className="px-6 py-4 text-right">
                      {s.balance > 0 && (
                        <button
                          onClick={() => openPayModal(s)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0f224a] hover:bg-blue-900 text-white text-xs font-bold transition-all shadow-sm"
                        >
                          Make Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Online Payment Modal */}
      {payModalOpen && selectedStatement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={() => setPayModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-black text-[#0f224a]">
              Submit Tuition Payment
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between font-medium text-slate-600">
                <span>Total Statement Amount:</span>
                <span className="font-bold text-slate-900">${selectedStatement.totalFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-slate-600">
                <span>Already Paid:</span>
                <span className="font-bold text-emerald-700">${selectedStatement.paidAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-200">
                <span>Remaining Balance Due:</span>
                <span className="text-rose-700">${selectedStatement.balance?.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleMakePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Payment Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={selectedStatement.balance}
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                >
                  <option value="CREDIT_CARD">Credit / Debit Card</option>
                  <option value="BANK_TRANSFER">Direct Bank Transfer</option>
                  <option value="SCHOLARSHIP">University Financial Aid / Scholarship</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPay}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0f224a] hover:bg-blue-900 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {submittingPay && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Generate Statement Modal */}
      {genModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={() => setGenModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-black text-[#0f224a]">
              Generate Student Billing Statement
            </h3>

            <form onSubmit={handleGenerateStatement} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Select Student Account *
                </label>
                <select
                  value={genStudentId}
                  onChange={(e) => setGenStudentId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.username} ({s.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0f224a] uppercase tracking-wider mb-1">
                  Tuition Fee Amount ($) *
                </label>
                <input
                  type="number"
                  step="50"
                  min="100"
                  required
                  value={genTuitionAmount}
                  onChange={(e) => setGenTuitionAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0f224a]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGenModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGen}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0f224a] hover:bg-blue-900 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {submittingGen && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Generate Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeeManager;
