/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CompanyConfig, PresetService } from '../types';
import { Building, CreditCard, Phone, Mail, MapPin, Save, RefreshCw, Check, Euro, HelpCircle } from 'lucide-react';

interface CompanyConfigComponentProps {
  config: CompanyConfig;
  onSaveConfig: (newConfig: CompanyConfig) => void;
  presetServices: PresetService[];
  onSavePresets: (newPresets: PresetService[]) => void;
  onResetPresets: () => void;
}

export default function CompanyConfigComponent({
  config,
  onSaveConfig,
  presetServices,
  onSavePresets,
  onResetPresets
}: CompanyConfigComponentProps) {
  const [localConfig, setLocalConfig] = useState<CompanyConfig>({ ...config });
  const [localPresets, setLocalPresets] = useState<PresetService[]>([...presetServices]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [presetSuccess, setPresetSuccess] = useState(false);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalConfig(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (id: string, priceStr: string) => {
    const price = parseFloat(priceStr) || 0;
    setLocalPresets(prev =>
      prev.map(item => (item.id === id ? { ...item, defaultPrice: price } : item))
    );
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(localConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSavePresets = () => {
    onSavePresets(localPresets);
    setPresetSuccess(true);
    setTimeout(() => setPresetSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres restablecer todos los precios de fábrica? Se perderán tus cambios personalizados.')) {
      onResetPresets();
      // Wait for parent state to reset and then align local state
      setTimeout(() => {
        window.location.reload(); // Quick way to align all states
      }, 100);
    }
  };

  const categories = {
    instalacion: 'Instalaciones',
    limpieza: 'Mantenimiento y Limpieza',
    reparacion: 'Reparaciones y Averías',
    mano_obra: 'Mano de Obra y Viajes'
  };

  return (
    <div id="config-component" className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-semibold text-slate-800">Perfil del Instalador</h2>
            <p className="text-sm text-slate-500 mt-1">Configura tus datos fiscales y de contacto. Aparecerán de forma automática en la cabecera y el pie de cada presupuesto.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 self-start md:self-auto">
            <Building className="w-3.5 h-3.5" />
            Datos de Empresa
          </span>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company-name" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Nombre Comercial / Nombre Autónomo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  id="company-name"
                  type="text"
                  name="name"
                  value={localConfig.name}
                  onChange={handleConfigChange}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  placeholder="Ej. Climatizaciones Gómez"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="company-nif" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">CIF / NIF / DNI</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  id="company-nif"
                  type="text"
                  name="nif"
                  value={localConfig.nif}
                  onChange={handleConfigChange}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  placeholder="Ej. 12345678Z o B-12345678"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="company-phone" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Teléfono de Contacto</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="company-phone"
                  type="text"
                  name="phone"
                  value={localConfig.phone}
                  onChange={handleConfigChange}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  placeholder="Ej. +34 600 000 000"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="company-email" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email Profesional</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="company-email"
                  type="email"
                  name="email"
                  value={localConfig.email}
                  onChange={handleConfigChange}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  placeholder="Ej. contacto@climagomez.com"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="company-address" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Dirección Fiscal / Oficina</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="company-address"
                  type="text"
                  name="address"
                  value={localConfig.address}
                  onChange={handleConfigChange}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  placeholder="Calle Clavel 12, Planta 1, Madrid"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="company-notes" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Cláusulas de Presupuesto, Garantía y Condiciones de Pago</label>
              <textarea
                id="company-notes"
                name="notes"
                value={localConfig.notes}
                onChange={handleConfigChange}
                rows={4}
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-sans"
                placeholder="Escribe aquí las condiciones de garantía del trabajo o plazos de validez del presupuesto..."
              />
              <p className="text-xs text-slate-400 mt-2">Este texto aparecerá al pie del presupuesto (Ej: 'Validez del presupuesto: 15 días. Garantía de 6 meses en reparaciones').</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              id="btn-save-config"
              type="submit"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
                saveSuccess
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-800 text-white hover:bg-slate-950 active:scale-98'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  ¡Guardado Correctamente!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Perfil
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-semibold text-slate-800">Tarifas de Servicios por Defecto</h2>
            <p className="text-sm text-slate-500 mt-1">Edita tus precios estándar de mano de obra, carga de gas e instalaciones. Los nuevos presupuestos se generarán con estas tarifas automáticas.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="btn-reset-presets"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-100 hover:border-rose-200 px-3 py-1.5 rounded-lg transition-all"
              title="Restablecer precios estándar"
            >
              <RefreshCw className="w-3 h-3" />
              Restablecer
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {(Object.keys(categories) as Array<keyof typeof categories>).map(catKey => {
            const catItems = localPresets.filter(item => item.category === catKey);
            return (
              <div key={catKey} className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg border-l-4 border-blue-500 inline-block">
                  {categories[catKey]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-700 truncate" title={item.concept}>
                          {item.concept}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1" title={item.description}>
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="relative max-w-[100px]">
                          <input
                            id={`price-preset-${item.id}`}
                            type="number"
                            value={item.defaultPrice}
                            onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            step="0.01"
                            min="0"
                            className="block w-full pr-7 pl-2 py-1.5 text-right bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-mono font-medium"
                          />
                          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-xs text-slate-400 font-sans">
                            €
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100 mt-8">
          <button
            id="btn-save-presets"
            onClick={handleSavePresets}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
              presetSuccess
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98'
            }`}
          >
            {presetSuccess ? (
              <>
                <Check className="w-4 h-4" />
                ¡Tarifas Guardadas!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Lista de Precios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
