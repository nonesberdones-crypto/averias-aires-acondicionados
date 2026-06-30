/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Budget, BudgetStatus } from '../types';
import { Search, Trash2, Edit, Eye, Filter, Calendar, FolderOpen, Coins, TrendingUp, CheckCircle2 } from 'lucide-react';

interface BudgetHistoryComponentProps {
  budgets: Budget[];
  onLoadBudget: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
  onUpdateStatus: (id: string, status: BudgetStatus) => void;
}

export default function BudgetHistoryComponent({
  budgets,
  onLoadBudget,
  onDeleteBudget,
  onUpdateStatus
}: BudgetHistoryComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | 'all'>('all');

  // Filter budgets
  const filteredBudgets = budgets.filter(b => {
    const matchesSearch =
      b.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.budgetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.client.phone && b.client.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate quick summary metrics
  const totalBudgetsCount = budgets.length;
  
  const calculateTotalValue = (items: Budget['items'], discountPct: number, discountAmt: number, ivaPct: number) => {
    const sub = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const disc = discountPct > 0 ? sub * (discountPct / 100) : discountAmt;
    const base = Math.max(0, sub - disc);
    return base + (base * (ivaPct / 100));
  };

  const totalsByStatus = budgets.reduce(
    (acc, b) => {
      const val = calculateTotalValue(b.items, b.discountPercent, b.discountAmount, b.ivaPercent);
      if (b.status === 'aceptado') acc.aceptados += val;
      if (b.status === 'pendiente') acc.pendientes += val;
      if (b.status === 'facturado') acc.facturados += val;
      return acc;
    },
    { aceptados: 0, pendientes: 0, facturados: 0 }
  );

  const getStatusBadge = (status: BudgetStatus) => {
    switch (status) {
      case 'aceptado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Aceptado
          </span>
        );
      case 'facturado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            Facturado
          </span>
        );
      case 'rechazado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
            Rechazado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            Pendiente
          </span>
        );
    }
  };

  return (
    <div id="budget-history" className="space-y-6">
      {/* Quick stats panel */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Presupuestos</span>
            <span className="text-xl font-bold font-mono text-slate-800">{totalBudgetsCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pendientes</span>
            <span className="text-xl font-bold font-mono text-amber-600">{totalsByStatus.pendientes.toFixed(2)}€</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aceptados</span>
            <span className="text-xl font-bold font-mono text-emerald-600">{totalsByStatus.aceptados.toFixed(2)}€</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Facturados</span>
            <span className="text-xl font-bold font-mono text-blue-600">{totalsByStatus.facturados.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="history-search-input"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            placeholder="Buscar por cliente, teléfono, nº presupuesto..."
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            id="history-status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="block px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-semibold"
          >
            <option value="all">📁 Todos los estados</option>
            <option value="pendiente">⏳ Pendientes</option>
            <option value="aceptado">✅ Aceptados</option>
            <option value="facturado">🧾 Facturados</option>
            <option value="rechazado">❌ Rechazados</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-semibold tracking-wider uppercase">
                <th className="py-3 px-5">Presupuesto</th>
                <th className="py-3 px-5">Cliente</th>
                <th className="py-3 px-5">Fecha</th>
                <th className="py-3 px-5 text-right">Importe Total</th>
                <th className="py-3 px-5 text-center">Estado</th>
                <th className="py-3 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBudgets.map(b => {
                const totalVal = calculateTotalValue(b.items, b.discountPercent, b.discountAmount, b.ivaPercent);
                return (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-mono font-bold text-blue-600 block text-xs">{b.budgetNumber}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-medium uppercase">{b.client.machineType} {b.client.machineBrand}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-semibold text-slate-700 block text-sm">{b.client.name}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{b.client.phone || 'Sin teléfono'}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {b.date}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {totalVal.toFixed(2)}€
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(b.status)}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <select
                          id={`status-select-${b.id}`}
                          value={b.status}
                          onChange={(e) => onUpdateStatus(b.id, e.target.value as BudgetStatus)}
                          className="text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 mr-2 focus:outline-none"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="aceptado">Aceptado</option>
                          <option value="facturado">Facturado</option>
                          <option value="rechazado">Rechazado</option>
                        </select>
                        <button
                          id={`btn-history-view-${b.id}`}
                          onClick={() => onLoadBudget(b)}
                          className="p-1.5 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-100 rounded-lg transition-all cursor-pointer"
                          title="Cargar / Ver Detalles"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-history-delete-${b.id}`}
                          onClick={() => {
                            if (confirm(`¿Estás seguro de que quieres eliminar el presupuesto ${b.budgetNumber} de ${b.client.name}?`)) {
                              onDeleteBudget(b.id);
                            }
                          }}
                          className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-lg transition-all cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredBudgets.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs italic">
                    {budgets.length === 0 ? 'No hay presupuestos guardados en el historial.' : 'No se encontraron presupuestos que coincidan con los filtros.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
