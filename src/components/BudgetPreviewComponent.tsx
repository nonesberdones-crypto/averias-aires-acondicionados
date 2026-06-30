/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Budget, CompanyConfig } from '../types';
import { Printer, Copy, Check, FileText, Calendar, Building, User, Info, Smartphone } from 'lucide-react';

interface BudgetPreviewComponentProps {
  budget: Budget;
  companyConfig: CompanyConfig;
  onUpdateStatus?: (id: string, status: Budget['status']) => void;
}

export default function BudgetPreviewComponent({
  budget,
  companyConfig,
  onUpdateStatus
}: BudgetPreviewComponentProps) {
  const [copied, setCopied] = useState(false);

  const getMachineLabel = (type: string) => {
    const labels: Record<string, string> = {
      split: 'Split Pared',
      'multi-split': 'Multi-Split',
      conductos: 'Conductos / Centralizado',
      cassette: 'Cassette Techo',
      'suelo-techo': 'Suelo - Techo',
      otro: 'Otro Tipo'
    };
    return labels[type] || type;
  };

  // Calculations
  const subtotal = budget.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  let discountAmount = budget.discountAmount;
  if (budget.discountPercent > 0) {
    discountAmount = subtotal * (budget.discountPercent / 100);
  }

  const baseImponible = Math.max(0, subtotal - discountAmount);
  const ivaAmount = baseImponible * (budget.ivaPercent / 100);
  const total = baseImponible + ivaAmount;

  // Format budget text for WhatsApp sharing
  const handleCopyWhatsApp = () => {
    const itemsText = budget.items
      .map(item => `- ${item.quantity}x ${item.concept}: ${(item.price * item.quantity).toFixed(2)}€`)
      .join('\n');

    const message = `*PRESUPUESTO DE CLIMATIZACIÓN*
📄 *Nº Presupuesto:* ${budget.budgetNumber}
📅 *Fecha:* ${budget.date}
🏢 *Empresa:* ${companyConfig.name} (Tlf: ${companyConfig.phone})

👤 *Cliente:* ${budget.client.name}
📍 *Dirección:* ${budget.client.address || 'No especificada'}
❄️ *Equipo:* ${getMachineLabel(budget.client.machineType)} ${budget.client.machineBrand} ${budget.client.machineModel ? `(${budget.client.machineModel})` : ''}

*Detalle de Servicios:*
${itemsText}

---------------------------------
💰 *Subtotal:* ${subtotal.toFixed(2)}€
${budget.discountPercent > 0 ? `📉 *Descuento (${budget.discountPercent}%):* -${discountAmount.toFixed(2)}€\n` : ''}${budget.discountAmount > 0 && !budget.discountPercent ? `📉 *Descuento:* -${budget.discountAmount.toFixed(2)}€\n` : ''}💵 *Base Imponible:* ${baseImponible.toFixed(2)}€
🧾 *IVA (${budget.ivaPercent}%):* ${ivaAmount.toFixed(2)}€
*TOTAL PRESUPUESTADO:* *${total.toFixed(2)}€*

📝 *Condiciones/Notas:* ${budget.notes || companyConfig.notes}

_¿Desea aceptar este presupuesto? Por favor, responda a este mensaje con un "Acepto" para proceder a programar la fecha de intervención._`;

    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="budget-preview-container" className="space-y-6">
      {/* Action panel - Hidden in print */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 md:p-6 shadow-sm no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Vista de Impresión e Intercambio
          </h3>
          <p className="text-xs text-slate-500">El presupuesto está listo. Puedes imprimirlo en papel o guardarlo como PDF directo, o enviarlo por WhatsApp al cliente.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onUpdateStatus && (
            <div className="flex items-center gap-1.5 mr-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado:</span>
              <select
                id="preview-status-select"
                value={budget.status}
                onChange={(e) => onUpdateStatus(budget.id, e.target.value as any)}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  budget.status === 'aceptado'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : budget.status === 'facturado'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : budget.status === 'rechazado'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                <option value="pendiente">⏳ Pendiente</option>
                <option value="aceptado">✅ Aceptado</option>
                <option value="facturado">🧾 Facturado</option>
                <option value="rechazado">❌ Rechazado</option>
              </select>
            </div>
          )}

          <button
            id="btn-print-budget"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir / Guardar PDF
          </button>

          <button
            id="btn-whatsapp-budget"
            onClick={handleCopyWhatsApp}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                ¡Copiado para WhatsApp!
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                Compartir WhatsApp
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real A4 Budget page mockup */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-md max-w-4xl mx-auto print-card font-sans text-slate-800 relative overflow-hidden">
        {/* Decorative elements (hidden in print) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-40 -mr-10 -mt-10 no-print"></div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                ❄️
              </div>
              <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 leading-none">
                {companyConfig.name}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Instalación y Climatización Residencial</p>
            <div className="space-y-1 text-xs text-slate-500 pt-2 font-light">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">CIF/NIF:</span> {companyConfig.nif}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Tlf:</span> {companyConfig.phone}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Email:</span> {companyConfig.email}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Dir:</span> {companyConfig.address}
              </p>
            </div>
          </div>

          <div className="text-left md:text-right space-y-3 md:self-stretch flex flex-col justify-between items-start md:items-end">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              budget.status === 'aceptado'
                ? 'bg-emerald-100 text-emerald-800'
                : budget.status === 'facturado'
                ? 'bg-blue-100 text-blue-800'
                : budget.status === 'rechazado'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {budget.status}
            </span>
            <div className="space-y-1">
              <h2 className="text-lg font-display font-bold text-slate-900">
                PRESUPUESTO
              </h2>
              <p className="text-sm font-mono font-bold text-blue-600">
                {budget.budgetNumber}
              </p>
            </div>
            <div className="text-xs text-slate-500 space-y-0.5">
              <p><span className="font-medium text-slate-600">Fecha de Emisión:</span> {budget.date}</p>
              <p><span className="font-medium text-slate-600">Validez hasta:</span> {budget.dueDate}</p>
            </div>
          </div>
        </div>

        {/* CUSTOMER & SYSTEM DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-slate-100">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" />
              Datos del Cliente
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 space-y-1.5 text-xs text-slate-600 print-card">
              <p className="font-semibold text-slate-800 text-sm">{budget.client.name}</p>
              {budget.client.phone && <p><span className="font-medium text-slate-400">Teléfono:</span> {budget.client.phone}</p>}
              {budget.client.email && <p><span className="font-medium text-slate-400">Email:</span> {budget.client.email}</p>}
              {budget.client.address && <p><span className="font-medium text-slate-400">Dirección:</span> {budget.client.address}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-blue-500 text-sm">❄️</span>
              Ficha Técnica de Climatización
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 space-y-1.5 text-xs text-slate-600 print-card">
              <p><span className="font-semibold text-slate-700">Tipo de Sistema:</span> {getMachineLabel(budget.client.machineType)}</p>
              {budget.client.machineBrand && <p><span className="font-semibold text-slate-700">Marca del Equipo:</span> {budget.client.machineBrand}</p>}
              {budget.client.machineModel && <p><span className="font-semibold text-slate-700">Modelo:</span> {budget.client.machineModel}</p>}
              {budget.client.frigories && <p><span className="font-semibold text-slate-700">Potencia/Frigorías:</span> {budget.client.frigories}</p>}
              {!budget.client.machineBrand && !budget.client.machineModel && !budget.client.frigories && (
                <p className="text-slate-400 italic">No se especificaron detalles del equipo.</p>
              )}
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="py-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-xs font-semibold tracking-wider uppercase">
                <th className="py-3 pl-1 font-bold">Descripción del Servicio</th>
                <th className="py-3 pr-4 text-right font-bold w-20">Cant.</th>
                <th className="py-3 pr-4 text-right font-bold w-28">Precio Unit.</th>
                <th className="py-3 text-right font-bold w-32 pl-4">Importe</th>
              </tr>
            </thead>
            <tbody>
              {budget.items.map((item, index) => (
                <tr key={item.id || index} className="border-b border-slate-100/50 text-slate-700 text-xs group">
                  <td className="py-4 pr-4 pl-1">
                    <span className="font-semibold text-slate-900 block">{item.concept}</span>
                    {item.description && (
                      <span className="text-slate-400 text-[11px] block mt-1 leading-relaxed">
                        {item.description}
                      </span>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-right font-mono text-slate-600">
                    {item.quantity}
                  </td>
                  <td className="py-4 pr-4 text-right font-mono text-slate-600">
                    {item.price.toFixed(2)}€
                  </td>
                  <td className="py-4 text-right font-mono font-semibold text-slate-900 pl-4">
                    {(item.price * item.quantity).toFixed(2)}€
                  </td>
                </tr>
              ))}
              {budget.items.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 text-xs italic">
                    No hay conceptos añadidos a este presupuesto.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TOTALS & NOTES */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 border-t border-slate-100">
          <div className="md:col-span-6 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Condiciones Generales</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans text-justify">
                {budget.notes || companyConfig.notes || 'El plazo de validez de este presupuesto es de 15 días a partir de la fecha de emisión. La garantía legal de reparaciones y mano de obra es de 6 meses.'}
              </p>
            </div>

            {/* Signature fields for paper print */}
            <div className="hidden print:grid grid-cols-2 gap-4 pt-12 text-center text-[10px] text-slate-400 font-sans">
              <div className="border-t border-slate-200 pt-3">
                <p className="font-semibold">Firma del Técnico</p>
                <p className="mt-1">{companyConfig.name}</p>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <p className="font-semibold">Firma de Aceptación del Cliente</p>
                <p className="mt-1">{budget.client.name}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 md:pl-8 space-y-3">
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Subtotal:</span>
                <span className="font-mono">{subtotal.toFixed(2)}€</span>
              </div>

              {(budget.discountPercent > 0 || budget.discountAmount > 0) && (
                <div className="flex justify-between items-center text-rose-600">
                  <span className="font-medium">
                    Descuento {budget.discountPercent > 0 ? `(${budget.discountPercent}%)` : ''}:
                  </span>
                  <span className="font-mono">-{discountAmount.toFixed(2)}€</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">Base Imponible:</span>
                <span className="font-mono text-slate-800">{baseImponible.toFixed(2)}€</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500">I.V.A. ({budget.ivaPercent}%):</span>
                <span className="font-mono">{ivaAmount.toFixed(2)}€</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="text-sm font-display font-extrabold text-slate-900">
                TOTAL PRESUPUESTO:
              </span>
              <span className="text-lg font-mono font-extrabold text-blue-600">
                {total.toFixed(2)}€
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
