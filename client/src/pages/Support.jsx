import React, { useState, useEffect } from 'react';
import { LifeBuoy, AlertCircle, CheckCircle, MessageSquare, Send, User, ChevronRight } from 'lucide-react';
import api from '../services/api';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  
  // New Ticket Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Delivery issue');
  const [priority, setPriority] = useState('MEDIUM');
  const [message, setMessage] = useState('');

  // Reply State
  const [replyMessage, setReplyMessage] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support/tickets');
      setTickets(res.data.tickets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const res = await api.get(`/support/tickets/${ticketId}`);
      setSelectedTicket(res.data.ticket);
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      setError('Please provide a subject and message');
      return;
    }

    setSubmitLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/support/tickets', {
        subject,
        category,
        priority,
        message
      });
      setSuccess('Support ticket created successfully!');
      setSubject('');
      setMessage('');
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to open support ticket');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setReplyLoading(true);
    try {
      const res = await api.post(`/support/tickets/${selectedTicket._id}/reply`, {
        message: replyMessage
      });
      setReplyMessage('');
      fetchTicketDetails(selectedTicket._id);
    } catch (err) {
      alert('Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center">
        <span className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Customer Support</h1>
        <p className="text-xs text-slate-500">Open inquiry tickets or resolve wallet, shipping, and advertising placements issues</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Ticket form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <LifeBuoy className="w-4.5 h-4.5 text-violet-500" /> Open Support Ticket
            </h3>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-1">
                <AlertCircle className="w-4 h-4 shrink-0" /> <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs rounded-xl flex items-center gap-1">
                <CheckCircle className="w-4 h-4 shrink-0" /> <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Deposit not reflecting"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none text-slate-500"
                  >
                    <option value="Deposit issue">Deposit issue</option>
                    <option value="Delivery issue">Delivery issue</option>
                    <option value="Order issue">Order issue</option>
                    <option value="Advertising issue">Advertising issue</option>
                    <option value="Wallet issue">Wallet issue</option>
                    <option value="Account issue">Account issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none text-slate-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">Describe Issue *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your request..."
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none h-24"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
              >
                {submitLoading ? 'Creating...' : 'OPEN SUPPORT CASE'}
              </button>
            </form>
          </div>
        </div>

        {/* Right 2 Columns: Tickets list / Active chat thread */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTicket ? (
            /* Active Support Chat Window */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between min-h-[450px]">
              <div>
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">{selectedTicket.category} ({selectedTicket.ticket_number})</span>
                    <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">{selectedTicket.subject}</h3>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full uppercase bg-slate-100 border text-slate-500">{selectedTicket.priority}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border ${
                      selectedTicket.status === 'CLOSED' || selectedTicket.status === 'RESOLVED'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>

                {/* Message list container */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {messages.map((msg) => {
                    const isAdmin = msg.sender_type === 'ADMIN';
                    return (
                      <div key={msg._id} className={`flex gap-3 max-w-[80%] ${isAdmin ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-slate-100 text-slate-800 dark:bg-slate-850 dark:text-slate-100'
                            : 'bg-violet-600 text-white'
                        }`}>
                          <p>{msg.message}</p>
                          <span className={`text-[8px] block mt-1 ${isAdmin ? 'text-slate-400' : 'text-violet-200'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chat Reply Input Form */}
              {selectedTicket.status !== 'CLOSED' ? (
                <form onSubmit={handleReplySubmit} className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={replyLoading}
                    className="p-2.5 bg-violet-600 text-white hover:bg-violet-750 rounded-xl transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-2 bg-slate-50 text-[10px] text-slate-400 rounded-xl">
                  This ticket has been marked as CLOSED. Feel free to open another case if you need more assistance.
                </div>
              )}
            </div>
          ) : (
            /* Tickets list */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-violet-500" /> Active Support Tickets
              </h3>

              {tickets.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No tickets opened yet.</p>
              ) : (
                <div className="space-y-4">
                  {tickets.map((t) => (
                    <div
                      key={t._id}
                      onClick={() => fetchTicketDetails(t._id)}
                      className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 flex justify-between items-center cursor-pointer hover:border-slate-300 transition"
                    >
                      <div className="text-xs">
                        <strong className="text-slate-800 dark:text-slate-200 font-bold block">{t.subject}</strong>
                        <span className="text-[10px] text-slate-400">{t.ticket_number} | Category: {t.category}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border ${
                          t.status === 'RESOLVED' || t.status === 'CLOSED'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {t.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
