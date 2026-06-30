/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { DiagnosticIssue, BudgetItem } from '../types';
import { DIAGNOSTIC_GUIDES } from '../utils/defaultServices';
import { Snowflake, Droplet, Wind, Volume2, PowerOff, HelpCircle, Check, Plus, ClipboardList } from 'lucide-react';

interface DiagnosticWizardComponentProps {
  onAddSolution: (solution: Omit<BudgetItem, 'id'>) => void;
  addedItemIds: string[]; // To give quick feedback if they added it
}

export default function DiagnosticWizardComponent({
  onAddSolution,
  addedItemIds
}: DiagnosticWizardComponentProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const selectedIssue = DIAGNOSTIC_GUIDES.find(issue => issue.id === selectedIssueId);

  // Map icon string to Lucide component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Snowflake':
        return <Snowflake className="w-5 h-5 text-sky-500" />;
      case 'Droplet':
        return <Droplet className="w-5 h-5 text-blue-500" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-teal-500" />;
      case 'Volume2':
        return <Volume2 className="w-5 h-5 text-amber-500" />;
      case 'PowerOff':
        return <PowerOff className="w-5 h-5 text-rose-500" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleAdd = (sol: typeof DIAGNOSTIC_GUIDES[0]['recommendedSolutions'][0]) => {
    onAddSolution({
      concept: sol.concept,
      description: sol.description,
      price: sol.price,
      quantity: 1,
      category: sol.category
    });
  };

  return (
    <div id="diagnostic-wizard" className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-slate-800 text-sm md:text-base">Asistente de Diagnóstico Rápido</h3>
          <p className="text-xs text-slate-500">¿Qué síntoma presenta el equipo? Selecciónalo para guiar tu revisión e incluir soluciones recomendadas.</p>
        </div>
      </div>

      {/* Symptoms list */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        {DIAGNOSTIC_GUIDES.map(issue => {
          const isSelected = selectedIssueId === issue.id;
          return (
            <button
              id={`symptom-btn-${issue.id}`}
              key={issue.id}
              onClick={() => setSelectedIssueId(isSelected ? null : issue.id)}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className={`p-2 rounded-lg mb-2 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-50'}`}>
                {getIcon(issue.icon)}
              </div>
              <span className="text-xs font-semibold leading-snug break-words">
                {issue.symptom}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected diagnostic checklist and solutions */}
      {selectedIssue ? (
        <div className="bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-inner space-y-4 animate-fade-in">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detalle del Síntoma</h4>
            <p className="text-sm font-medium text-slate-700 mt-1">{selectedIssue.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-3 border-t border-slate-50">
            {/* Checks Checklist */}
            <div className="md:col-span-5 space-y-2.5">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                Inspección Recomendada
              </h5>
              <ul className="space-y-2">
                {selectedIssue.checks.map((check, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-50 text-blue-500 shrink-0 font-bold text-[10px] mt-0.5">
                      {index + 1}
                    </span>
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended items to add */}
            <div className="md:col-span-7 space-y-2.5">
              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tareas y Soluciones Sugeridas
              </h5>
              <div className="space-y-2.5">
                {selectedIssue.recommendedSolutions.map((sol, index) => {
                  const alreadyAdded = addedItemIds.includes(sol.concept);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 gap-3">
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-700 block truncate" title={sol.concept}>
                          {sol.concept}
                        </span>
                        <span className="text-[11px] text-slate-400 line-clamp-1" title={sol.description}>
                          {sol.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-mono font-bold text-slate-700 bg-white border border-slate-100 px-2 py-0.5 rounded">
                          {sol.price.toFixed(2)}€
                        </span>
                        <button
                          id={`btn-add-diagnostic-sol-${index}`}
                          onClick={() => handleAdd(sol)}
                          className={`flex items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer ${
                            alreadyAdded
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                              : 'bg-white border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200'
                          }`}
                          title={alreadyAdded ? "Ya añadido al presupuesto" : "Añadir tarea"}
                        >
                          {alreadyAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 bg-white/50 border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-400">Selecciona uno de los síntomas de arriba para abrir la guía interactiva.</p>
        </div>
      )}
    </div>
  );
}
