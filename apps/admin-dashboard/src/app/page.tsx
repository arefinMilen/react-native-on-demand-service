import React from 'react';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">System Dashboard Overview</h1>
        <p className="text-slate-400 text-sm">Real-time metrics, active bookings & platform revenue summary.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-bold text-sky-400 tracking-wider uppercase">Total Bookings</p>
          <p className="text-3xl font-black text-slate-100 mt-2">1,248</p>
          <p className="text-xs text-emerald-400 mt-1">↑ +14% this week</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Platform Commission</p>
          <p className="text-3xl font-black text-slate-100 mt-2">৳42,850</p>
          <p className="text-xs text-emerald-400 mt-1">Net System Earnings</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-bold text-amber-400 tracking-wider uppercase">Active Online Providers</p>
          <p className="text-3xl font-black text-slate-100 mt-2">84</p>
          <p className="text-xs text-slate-400 mt-1">Streaming live GPS in Redis</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-bold text-rose-400 tracking-wider uppercase">Pending KYC Approvals</p>
          <p className="text-3xl font-black text-slate-100 mt-2">12</p>
          <a href="/kyc" className="text-xs text-sky-400 hover:underline mt-1 inline-block">Review documents →</a>
        </div>
      </div>

      {/* Live Active Bookings Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Recent Platform Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-3.5 px-4 font-mono text-sky-400">#BK-90412</td>
                <td className="py-3.5 px-4 font-semibold">Handyman & Plumbing</td>
                <td className="py-3.5 px-4">Tanvir Ahmed</td>
                <td className="py-3.5 px-4">Rahim Plumbing Expert</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">৳520.00</td>
                <td className="py-3.5 px-4">
                  <span className="bg-emerald-950 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold">
                    IN_PROGRESS
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono text-sky-400">#BK-88301</td>
                <td className="py-3.5 px-4 font-semibold">AC Repair & Servicing</td>
                <td className="py-3.5 px-4">Kamrul Hasan</td>
                <td className="py-3.5 px-4">Cooling Master Pro</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">৳820.00</td>
                <td className="py-3.5 px-4">
                  <span className="bg-sky-950 text-sky-300 text-xs px-2.5 py-1 rounded-full font-bold">
                    COMPLETED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
