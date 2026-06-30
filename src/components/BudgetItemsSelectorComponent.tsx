/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PresetService, BudgetItem } from '../types';
import { Plus, Sparkles, Sliders, Settings2, ShieldCheck, Euro } from 'lucide-react';

interface BudgetItemsSelectorComponentProps {
  presetServices: PresetService[];
  onAddItem: (item: Omit<BudgetItem, 'id'>) => void;
}

type TabType = 'instalacion' | 'limpieza' | 'reparacion' | 'mano_obra' | 'personalizado';

export default function BudgetItemsSelectorComponent({
  presetServices,
  onAddItem
}: BudgetItemsSelectorComponentProps) {
  const [activeTab, setActiveTab] = useState<TabType>('instalacion');

  // State for custom item form
  const [customConcept, setCustomConcept] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customQty, setCustomQty] = useState('1');
  const [customCategory, setCustomCategory] = useState<'instalacion' | 'limpieza' | 'reparacion' | 'mano_obra' | 'personalizado'>('personalizado');

  const tabs: { value: TabType; label: string; icon: string }[] = [
    { value: 'instalacion', label: 'Instalaciones', icon: '🔧' },
    { value: 'limpieza', label: 'Limpieza/Mantenimiento', icon: '✨' },
    { value: 'reparacion', label: 'Reparaciones/Averías', icon: '⚡' },
    { value: 'mano_obra', label: 'Mano de Obra/Viajes', icon: '🚗' },
    { value: 'personalizado', label: 'Línea Personalizada', icon: '📝' }
  ];

  const handleAddPreset = (service: PresetService) => {
    onAddItem({
      concept: service.concept,
      description: service.description,
      price: service.defaultPrice,
      quantity: 1,
      category: service.category
    });
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customConcept.trim()) return;

    onAddItem({
      concept: customConcept,
      description: customDescription,
      price: parseFloat(customPrice) || 0,
      quantity: parseInt(customQty) || 1,
      category: customCategory
    });

    // Reset form
    setCustomConcept('');
    setCustomDescription('');
    setCustomPrice('');
    setCustomQty('1');
  };

  const filteredPresets = presetServices.filter(s => s.category === activeTab);

  return (
    <div id="items-selector" className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-display font-semibold text-slate-800 text-sm md:text-base">Seleccionar Tareas y Materiales</h3>
      </div>

      {/* Selector Tabs */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-100 pb-px mb-5 no-scrollbar">
        {tabs.map(tab => {
          const isSelected = activeTab === tab.value;
          return (
            <button
              id={`tab-btn-${tab.value}`}
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`whitespace-nowrap px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-t-2 cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/50 text-blue-600 border-blue-600 font-bold'
                  : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50/50'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Preset Lists / Custom form */}
      {activeTab !== 'personalizado' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
          {filteredPresets.map(service => (
            <div
              id={`preset-card-${service.id}`}
              key={service.id}
              className="group p-4 bg-slate-50/50 hover:bg-blue-50/20 border border-slate-100 hover:border-blue-100 rounded-xl transition-all duration-200 flex justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-semibold text-slate-700 leading-snug group-hover:text-blue-700 transition-colors">
                  {service.concept}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
                <div className="pt-1.5 flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-slate-600 bg-white border border-slate-100 px-2 py-0.5 rounded-md">
                    {service.defaultPrice.toFixed(2)}€
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center self-center shrink-0">
                <button
                  id={`btn-add-preset-${service.id}`}
                  onClick={() => handleAddPreset(service)}
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-white hover:bg-blue-600 border border-slate-200 hover:border-blue-600 text-blue-600 hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-blue-500/10 active:scale-95"
                  title="Añadir a la lista"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredPresets.length === 0 && (
            <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
              No hay tareas en esta categoría.
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleAddCustom} className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label htmlFor="custom-concept" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Concepto / Tarea</label>
              <input
                id="custom-concept"
                type="text"
                required
                value={customConcept}
                onChange={e => setCustomConcept(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                placeholder="Ej. Suministro de latiguillo flexible antivibración"
              />
            </div>

            <div className="md:col-span-3">
              <label htmlFor="custom-price" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Precio Unitario (€)</label>
              <div className="relative">
                <input
                  id="custom-price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={customPrice}
                  onChange={e => setCustomPrice(e.target.value)}
                  className="block w-full pr-7 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-mono"
                  placeholder="0.00"
                />
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs text-slate-400">€</span>
              </div>
            </div>

            <div className="md:col-span-3">
              <label htmlFor="custom-qty" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Cantidad</label>
              <input
                id="custom-qty"
                type="number"
                min="1"
                required
                value={customQty}
                onChange={e => setCustomQty(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-center font-mono"
              />
            </div>

            <div className="md:col-span-8">
              <label htmlFor="custom-desc" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Descripción Ampliada (Opcional)</label>
              <input
                id="custom-desc"
                type="text"
                value={customDescription}
                onChange={e => setCustomDescription(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                placeholder="Detalle técnico, material adicional, etc."
              />
            </div>

            <div className="md:col-span-4">
              <label htmlFor="custom-cat-select" className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Categoría de Facturación</label>
              <select
                id="custom-cat-select"
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value as any)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              >
                <option value="instalacion">Instalación</option>
                <option value="limpieza">Mantenimiento / Limpieza</option>
                <option value="reparacion">Reparación / Avería</option>
                <option value="mano_obra">Mano de Obra / Viajes</option>
                <option value="personalizado">Otro (Material / Varios)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              id="btn-add-custom-item"
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Añadir Línea Personalizada
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
