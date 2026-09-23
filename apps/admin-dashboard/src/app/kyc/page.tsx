'use client';

import React, { useState } from 'react';

export default function KycPage() {
  const [providers, setProviders] = useState([
    {
      id: 'p-101',
      name: 'Rahim Plumbing Expert',
      phone: '+8801900000000',
      nid: '1990123456789',
      category: 'Handyman & Plumbing',
      status: 'PENDING',
      submittedAt: '2026-09-22 14:30',
    },
    {
      id: 'p-102',
      name: 'Dr. Shahriar Hossain',
      phone: '+8801811111111',
      nid: '1988987654321',
      category: 'Doctor Tele-Consultation',
      status: 'PENDING',
      submittedAt: '2026-09-22 15:10',
    },
  ]);

  const handleApprove = (id: string) => {
    setProviders(providers.map((p) => (p.id === id ? { ...p, status: 'APPROVED' } : p)));
  };

  const handleReject = (id: string) => {
    setProviders(providers.map((p) => (p.id === id ? { ...p, status: 'REJECTED' } : p)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Provider KYC Verification</h1>
        <p className="text-slate-400 text-sm">Inspect submitted National IDs and professional certificates before granting platform access.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
            <tr>
              <th className="py-3 px-4">Provider Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Phone / NID</th>
              <th className="py-3 px-4">KYC Documents</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {providers.map((p) => (
              <tr key={p.id}>
                <td className="py-3.5 px-4 font-bold text-slate-100">{p.name}</td>
                <td className="py-3.5 px-4 text-sky-400">{p.category}</td>
                <td className="py-3.5 px-4">
                  <div>{p.phone}</div>
                  <div className="text-xs text-slate-500 font-mono">NID: {p.nid}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-xs text-sky-400 cursor-pointer underline">View 2 Attached Images</span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      p.status === 'APPROVED'
                        ? 'bg-emerald-950 text-emerald-300'
                        : p.status === 'REJECTED'
                        ? 'bg-rose-950 text-rose-300'
                        : 'bg-amber-950 text-amber-300'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  {p.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded text-xs transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
                        className="bg-slate-800 hover:bg-rose-900 text-rose-300 font-bold px-3 py-1.5 rounded text-xs transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500">Verified</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
