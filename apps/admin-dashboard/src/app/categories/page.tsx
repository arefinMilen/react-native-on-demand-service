'use client';

import React, { useState } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: '1', name: 'Handyman & Plumbing', basePrice: 500, hourlyRate: 300, commissionPercent: 10 },
    { id: '2', name: 'AC Repair & Servicing', basePrice: 800, hourlyRate: 500, commissionPercent: 12 },
    { id: '3', name: 'Electrician Services', basePrice: 400, hourlyRate: 250, commissionPercent: 10 },
    { id: '4', name: 'Doctor Tele-Consultation', basePrice: 1000, hourlyRate: 0, commissionPercent: 15 },
    { id: '5', name: 'Car & Bike Mechanic', basePrice: 600, hourlyRate: 400, commissionPercent: 10 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Categories & Pricing Rules</h1>
          <p className="text-slate-400 text-sm">Configure base prices, hourly charges, and platform commission percentages.</p>
        </div>
        <button className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
          + Add New Category
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
            <tr>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Base Service Fee</th>
              <th className="py-3 px-4">Hourly Charge</th>
              <th className="py-3 px-4">Platform Commission %</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="py-3.5 px-4 font-bold text-slate-100">{c.name}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400">৳{c.basePrice}.00</td>
                <td className="py-3.5 px-4 font-mono text-slate-300">
                  {c.hourlyRate ? `৳${c.hourlyRate}.00 / hr` : 'N/A'}
                </td>
                <td className="py-3.5 px-4">
                  <span className="bg-sky-950 text-sky-300 text-xs font-bold px-2.5 py-1 rounded">
                    {c.commissionPercent}% Commission
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button className="text-sky-400 hover:text-sky-300 text-xs font-semibold underline">
                    Edit Rules
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
