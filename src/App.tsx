/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CompanyConfig, ClientInfo, BudgetItem, Budget, BudgetStatus, PresetService } from './types';
import { DEFAULT_SERVICES } from './utils/defaultServices';
import CompanyConfigComponent from './components/CompanyConfigComponent';
import DiagnosticWizardComponent from './components/DiagnosticWizardComponent';
import BudgetItemsSelectorComponent from './components/BudgetItemsSelectorComponent';
import BudgetPreviewComponent from './components/BudgetPreviewComponent';
import BudgetHistoryComponent from './components/BudgetHistoryComponent';
import { 
  FileText, Plus, Trash2, Save, Sparkles, User, Settings2, FolderOpen, 
  RefreshCw, ClipboardList, Info, HelpCircle, ArrowRight, ChevronRight, Check, X, Printer
} from 'lucide-react';

const INITIAL_COMPANY_CONFIG: CompanyConfig = {
  name: 'Servicios Climatización Pro',
  nif: 'NIF-74859601A',
  phone: '+34 622 111 222',
  email: 'tecnico@climatizacionpro.es',
  address: 'Av. de la Constitución 142, local B, Sevilla',
  notes: 'Presupuesto válido durante 15 días desde la fecha de emisión. Garantía de 6 meses en todas las reparaciones efectuadas y materiales aportados. Precios condicionados a la aceptación del presupuesto completo.'
};

const INITIAL_CLIENT: ClientInfo = {
  name: '',
  phone: '',
  email: '',
  address: '',
  machineType: 'split',
  machineBrand: '',
  machineModel: '',
  frigories: ''
};

// Seed two initial budgets so the app is immediately useful on first load
const SEED_BUDGETS: Budget[] = [
  {
    id: 'seed-1',
    budgetNumber: 'PRE-2026-001',
    date: '2026-06-15',
    dueDate: '2026-06-30',
    client: {
      name: 'Manuel Sotomayor',
      phone: '654 321 098',
      email: 'm.sotomayor@email.com',
      address: 'Calle Sierpes 45, Piso 2A, Sevilla',
      machineType: 'split',
      machineBrand: 'Mitsubishi Electric',
      machineModel: 'MSZ-HR35VF',
      frigories: '3000 frig/h'
    },
    items: [
      {
        id: 'item-1',
        concept: 'Mantenimiento Higiénico Estándar (Split)',
        description: 'Desmontaje y lavado químico de filtros, limpieza mecánica de turbina evaporadora, desinfección fúngica/bactericida, y soplado del tubo de desagüe.',
        price: 75.00,
        quantity: 1,
        category: 'limpieza'
      },
      {
        id: 'item-2',
        concept: 'Sustitución de Condensador de Arranque',
        description: 'Desmontaje de condensadora exterior, testeo con capacímetro y reemplazo de condensador defectuoso del compresor o ventilador exterior (hasta 50uF).',
        price: 55.00,
        quantity: 1,
        category: 'reparacion'
      },
      {
        id: 'item-3',
        concept: 'Desplazamiento Técnico (Radio <20km)',
        description: 'Gastos de viaje y transporte de herramientas y equipo hasta el domicilio o comercio del cliente (dentro del radio urbano de actuación).',
        price: 30.00,
        quantity: 1,
        category: 'mano_obra'
      }
    ],
    discountPercent: 5,
    discountAmount: 0,
    ivaPercent: 21,
    status: 'aceptado',
    notes: 'Presupuesto pactado con descuento del 5%. Intervención programada para el lunes por la mañana.'
  },
  {
    id: 'seed-2',
    budgetNumber: 'PRE-2026-002',
    date: '2026-06-28',
    dueDate: '2026-07-13',
    client: {
      name: 'Carmen Martínez (Administradora)',
      phone: '954 888 777',
      email: 'carmen.martinez@gestoria.com',
      address: 'Calle San Jacinto 12, Planta 4, Sevilla',
      machineType: 'conductos',
      machineBrand: 'Daikin',
      machineModel: 'ADEQS71C',
      frigories: '6000 frig/h'
    },
    items: [
      {
        id: 'item-4',
        concept: 'Instalación de Aire por Conductos (Centralizado)',
        description: 'Montaje de máquina de conductos en falso techo, conexionado a embocaduras existentes, interconexión de cobre y eléctrica, colocación de termostato básico.',
        price: 480.00,
        quantity: 1,
        category: 'instalacion'
      },
      {
        id: 'item-5',
        concept: 'Línea frigorífica adicional (por metro)',
        description: 'Suministro e instalación de metro lineal adicional de tubería de cobre deshidratado, aislamiento de alta calidad y manguera de interconexión.',
        price: 25.00,
        quantity: 4,
        category: 'instalacion'
      },
      {
        id: 'item-6',
        concept: 'Desplazamiento Técnico (Radio <20km)',
        description: 'Gastos de viaje y transporte de herramientas y equipo hasta el domicilio o comercio del cliente (dentro del radio urbano de actuación).',
        price: 30.00,
        quantity: 1,
        category: 'mano_obra'
      }
    ],
    discountPercent: 0,
    discountAmount: 50,
    ivaPercent: 21,
    status: 'pendiente',
    notes: 'Pendiente de aceptación de la comunidad de propietarios. Descuento comercial directo de 50€ aplicado sobre mano de obra.'
  }
];

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'crear' | 'historial' | 'configuracion'>('crear');
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Core Data States
  const [companyConfig, setCompanyConfig] = useState<CompanyConfig>(INITIAL_COMPANY_CONFIG);
  const [presetServices, setPresetServices] = useState<PresetService[]>(DEFAULT_SERVICES);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Active Editing States
  const [client, setClient] = useState<ClientInfo>(INITIAL_CLIENT);
  const [activeItems, setActiveItems] = useState<BudgetItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [ivaPercent, setIvaPercent] = useState<0 | 10 | 21>(21);
  const [budgetNotes, setBudgetNotes] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNumber, setEditingNumber] = useState<string | null>(null);

  // Local Storage Sync
  useEffect(() => {
    const savedConfig = localStorage.getItem('ac_company_config');
    if (savedConfig) {
      try {
        setCompanyConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error('Error loading company config', e);
      }
    }

    const savedPresets = localStorage.getItem('ac_preset_services');
    if (savedPresets) {
      try {
        setPresetServices(JSON.parse(savedPresets));
      } catch (e) {
        console.error('Error loading presets', e);
      }
    }

    const savedBudgetsList = localStorage.getItem('ac_budgets');
    if (savedBudgetsList) {
      try {
        setBudgets(JSON.parse(savedBudgetsList));
      } catch (e) {
        console.error('Error loading budgets', e);
      }
    } else {
      // Use seeds on first launch ever
      setBudgets(SEED_BUDGETS);
      localStorage.setItem('ac_budgets', JSON.stringify(SEED_BUDGETS));
    }
  }, []);

  // Save Config to storage
  const handleSaveCompanyConfig = (newConfig: CompanyConfig) => {
    setCompanyConfig(newConfig);
    localStorage.setItem('ac_company_config', JSON.stringify(newConfig));
  };

  // Save Presets to storage
  const handleSavePresets = (newPresets: PresetService[]) => {
    setPresetServices(newPresets);
    localStorage.setItem('ac_preset_services', JSON.stringify(newPresets));
  };

  // Reset Presets
  const handleResetPresets = () => {
    setPresetServices(DEFAULT_SERVICES);
    localStorage.setItem('ac_preset_services', JSON.stringify(DEFAULT_SERVICES));
  };

  // Reset/Clear Form
  const handleClearForm = () => {
    setClient(INITIAL_CLIENT);
    setActiveItems([]);
    setDiscountPercent(0);
    setDiscountAmount(0);
    setDiscountType('percent');
    setIvaPercent(21);
    setBudgetNotes('');
    setEditingId(null);
    setEditingNumber(null);
    setIsPreviewing(false);
  };

  // Client Details changes
  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClient(prev => ({ ...prev, [name]: value }));
  };

  // Add Item to active budget
  const handleAddItem = (item: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    setActiveItems(prev => [...prev, newItem]);
  };

  // Remove Item from active budget
  const handleRemoveItem = (id: string) => {
    setActiveItems(prev => prev.filter(item => item.id !== id));
  };

  // Update item quantity or price in the active item table
  const handleUpdateItem = (id: string, field: 'quantity' | 'price' | 'concept' | 'description', val: any) => {
    setActiveItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (field === 'quantity') {
            return { ...item, quantity: Math.max(1, parseInt(val) || 1) };
          }
          if (field === 'price') {
            return { ...item, price: Math.max(0, parseFloat(val) || 0) };
          }
          return { ...item, [field]: val };
        }
        return item;
      })
    );
  };

  // Save budget to list
  const handleSaveBudget = (status: BudgetStatus = 'pendiente') => {
    if (!client.name.trim()) {
      alert('Por favor, indica al menos el nombre del cliente.');
      return;
    }
    if (activeItems.length === 0) {
      alert('Por favor, añade al menos un concepto o servicio al presupuesto.');
      return;
    }

    let budgetNumberStr = editingNumber;
    if (!budgetNumberStr) {
      // Auto-generate budget number: e.g. PRE-2026-003
      const currentYear = new Date().getFullYear();
      const yearBudgets = budgets.filter(b => b.budgetNumber.includes(`PRE-${currentYear}`));
      let maxSeq = 0;
      yearBudgets.forEach(b => {
        const parts = b.budgetNumber.split('-');
        const seq = parseInt(parts[2]) || 0;
        if (seq > maxSeq) maxSeq = seq;
      });
      const nextSeqStr = String(maxSeq + 1).padStart(3, '0');
      budgetNumberStr = `PRE-${currentYear}-${nextSeqStr}`;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const dueStr = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 15 days validity

    const newBudget: Budget = {
      id: editingId || `budget-${Date.now()}`,
      budgetNumber: budgetNumberStr,
      date: todayStr,
      dueDate: dueStr,
      client,
      items: activeItems,
      discountPercent: discountType === 'percent' ? discountPercent : 0,
      discountAmount: discountType === 'amount' ? discountAmount : 0,
      ivaPercent,
      status: editingId ? (budgets.find(b => b.id === editingId)?.status || status) : status,
      notes: budgetNotes || companyConfig.notes
    };

    let updatedBudgets: Budget[];
    if (editingId) {
      updatedBudgets = budgets.map(b => (b.id === editingId ? newBudget : b));
    } else {
      updatedBudgets = [newBudget, ...budgets];
    }

    setBudgets(updatedBudgets);
    localStorage.setItem('ac_budgets', JSON.stringify(updatedBudgets));
    
    // Quick confirmation alert
    alert(editingId ? 'Presupuesto actualizado con éxito.' : `Presupuesto ${budgetNumberStr} creado con éxito.`);
    
    // Switch to preview of the saved budget!
    setIsPreviewing(true);
  };

  // Load Budget from history to edit
  const handleLoadBudget = (budget: Budget) => {
    setClient(budget.client);
    setActiveItems(budget.items);
    if (budget.discountPercent > 0) {
      setDiscountPercent(budget.discountPercent);
      setDiscountAmount(0);
      setDiscountType('percent');
    } else {
      setDiscountPercent(0);
      setDiscountAmount(budget.discountAmount);
      setDiscountType('amount');
    }
    setIvaPercent(budget.ivaPercent);
    setBudgetNotes(budget.notes);
    setEditingId(budget.id);
    setEditingNumber(budget.budgetNumber);
    setIsPreviewing(false);
    setCurrentTab('crear');
  };

  // Delete budget
  const handleDeleteBudget = (id: string) => {
    const updated = budgets.filter(b => b.id !== id);
    setBudgets(updated);
    localStorage.setItem('ac_budgets', JSON.stringify(updated));
    if (editingId === id) {
      handleClearForm();
    }
  };

  // Update budget status in history or preview
  const handleUpdateStatus = (id: string, status: BudgetStatus) => {
    const updated = budgets.map(b => (b.id === id ? { ...b, status } : b));
    setBudgets(updated);
    localStorage.setItem('ac_budgets', JSON.stringify(updated));
  };

  // Active totals calculations
  const subtotal = activeItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discAmount = discountType === 'percent' ? (subtotal * (discountPercent / 100)) : discountAmount;
  const baseImponible = Math.max(0, subtotal - discAmount);
  const ivaAmount = baseImponible * (ivaPercent / 100);
  const total = baseImponible + ivaAmount;

  // Compile active budget object for temporary previewing
  const previewBudget: Budget = {
    id: editingId || 'temp-id',
    budgetNumber: editingNumber || 'PRE-Temporal',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    client,
    items: activeItems,
    discountPercent: discountType === 'percent' ? discountPercent : 0,
    discountAmount: discountType === 'amount' ? discountAmount : 0,
    ivaPercent,
    status: editingId ? (budgets.find(b => b.id === editingId)?.status || 'pendiente') : 'pendiente',
    notes: budgetNotes || companyConfig.notes
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* HEADER SECTION - Hidden in print */}
      <header className="bg-slate-900 text-white shadow-md py-4 px-6 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <span className="text-xl font-bold">❄️</span>
            </div>
            <div>
              <h1 className="text-base md:text-lg font-display font-extrabold tracking-tight">
                AVERIAS DE AIRES ACONDICIONADOS
              </h1>
              <span className="text-[10px] text-sky-400 font-mono tracking-wider block uppercase">
                Panel Técnico y Presupuestos
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button
              id="nav-btn-crear"
              onClick={() => { setCurrentTab('crear'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentTab === 'crear' && !isPreviewing
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo Presupuesto
            </button>

            <button
              id="nav-btn-historial"
              onClick={() => { setCurrentTab('historial'); setIsPreviewing(false); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentTab === 'historial'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Historial ({budgets.length})
            </button>

            <button
              id="nav-btn-config"
              onClick={() => { setCurrentTab('configuracion'); setIsPreviewing(false); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                currentTab === 'configuracion'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              Mis Tarifas
            </button>
          </nav>
        </div>
      </header>

      {/* DYNAMIC CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* If print previewing (independent mode) */}
        {isPreviewing && currentTab === 'crear' ? (
          <div className="space-y-4 animate-fade-in">
            <button
              id="btn-back-to-editor"
              onClick={() => setIsPreviewing(false)}
              className="no-print inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              ← Volver a Editar Presupuesto
            </button>
            <BudgetPreviewComponent
              budget={previewBudget}
              companyConfig={companyConfig}
              onUpdateStatus={editingId ? handleUpdateStatus : undefined}
            />
          </div>
        ) : (
          /* Normal Tab views */
          <>
            {/* TAB 1: CREAR NUEVO PRESUPUESTO */}
            {currentTab === 'crear' && (
              <div className="space-y-6 md:space-y-8 animate-fade-in no-print">
                {/* Visual state title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                      {editingId ? `Editar Presupuesto: ${editingNumber}` : 'Generar Nuevo Presupuesto'}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">
                      {editingId 
                        ? 'Estás modificando un presupuesto existente. Los cambios se guardarán sobre el mismo registro.'
                        : 'Introduce los datos del cliente, haz tu revisión con el asistente de averías y añade servicios.'}
                    </p>
                  </div>
                  
                  {editingId && (
                    <button
                      id="btn-cancel-editing"
                      onClick={handleClearForm}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl px-3 py-2 cursor-pointer transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancelar Edición
                    </button>
                  )}
                </div>

                {/* Interactive Diagnostic Helper */}
                <DiagnosticWizardComponent
                  onAddSolution={handleAddItem}
                  addedItemIds={activeItems.map(item => item.concept)}
                />

                {/* Main forms structure: 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                  {/* Left panel: Customer & Equipment specifications */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                      <h3 className="font-display font-semibold text-slate-800 text-sm md:text-base border-b border-slate-50 pb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        Información del Cliente
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label htmlFor="client-name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nombre Completo</label>
                          <input
                            id="client-name"
                            type="text"
                            name="name"
                            value={client.name}
                            onChange={handleClientChange}
                            required
                            className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                            placeholder="Ej. Juan Pérez Ortega"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="client-phone" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Teléfono</label>
                            <input
                              id="client-phone"
                              type="text"
                              name="phone"
                              value={client.phone}
                              onChange={handleClientChange}
                              className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                              placeholder="600 000 000"
                            />
                          </div>

                          <div>
                            <label htmlFor="client-email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email (Opcional)</label>
                            <input
                              id="client-email"
                              type="email"
                              name="email"
                              value={client.email}
                              onChange={handleClientChange}
                              className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                              placeholder="juan@correo.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="client-address" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Dirección de la Vivienda</label>
                          <input
                            id="client-address"
                            type="text"
                            name="address"
                            value={client.address}
                            onChange={handleClientChange}
                            className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                            placeholder="Calle Mayor 24, Ático C, Sevilla"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                      <h3 className="font-display font-semibold text-slate-800 text-sm md:text-base border-b border-slate-50 pb-3 flex items-center gap-2">
                        <span className="text-blue-500">❄️</span>
                        Ficha Técnica del Equipo
                      </h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="machine-type" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tipo de Aire</label>
                            <select
                              id="machine-type"
                              name="machineType"
                              value={client.machineType}
                              onChange={handleClientChange}
                              className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                            >
                              <option value="split">Split Pared</option>
                              <option value="multi-split">Multi-Split</option>
                              <option value="conductos">Conductos</option>
                              <option value="cassette">Cassette</option>
                              <option value="suelo-techo">Suelo-Techo</option>
                              <option value="otro">Otro</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="machine-brand" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Marca / Fabricante</label>
                            <input
                              id="machine-brand"
                              type="text"
                              name="machineBrand"
                              value={client.machineBrand}
                              onChange={handleClientChange}
                              className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                              placeholder="Mitsubishi, Daikin, LG..."
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="machine-model" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Modelo (Opcional)</label>
                            <input
                              id="machine-model"
                              type="text"
                              name="machineModel"
                              value={client.machineModel}
                              onChange={handleClientChange}
                              className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                              placeholder="Ej. MSZ-AP25VG"
                            />
                          </div>

                          <div>
                            <label htmlFor="machine-frigories" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Frigorías o kW</label>
                            <input
                              id="machine-frigories"
                              type="text"
                              name="frigories"
                              value={client.frigories}
                              onChange={handleClientChange}
                              className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                              placeholder="Ej. 3000 frig/h (3.5 kW)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right panel: Items Selection & Table view */}
                  <div className="lg:col-span-7 space-y-6">
                    <BudgetItemsSelectorComponent
                      presetServices={presetServices}
                      onAddItem={handleAddItem}
                    />

                    {/* Active Budget Lines Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                        <h3 className="font-display font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {activeItems.length}
                          </span>
                          Líneas del Presupuesto
                        </h3>
                        {activeItems.length > 0 && (
                          <button
                            id="btn-clear-items-table"
                            onClick={() => { if(confirm('¿Vaciar todas las líneas del presupuesto?')) setActiveItems([]); }}
                            className="text-xs font-semibold text-rose-500 hover:bg-rose-50 border border-rose-100 hover:border-rose-200 px-2.5 py-1 rounded-lg transition-all"
                          >
                            Vaciar líneas
                          </button>
                        )}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wide">
                              <th className="py-2.5 pl-1">Servicio / Concepto</th>
                              <th className="py-2.5 px-3 text-center w-20">Cant.</th>
                              <th className="py-2.5 px-3 text-right w-24">Precio Un.</th>
                              <th className="py-2.5 px-3 text-right w-24">Total</th>
                              <th className="py-2.5 pr-1 text-center w-10"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {activeItems.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-50/50">
                                <td className="py-3 pr-2 pl-1">
                                  <input
                                    id={`item-concept-input-${item.id}`}
                                    type="text"
                                    value={item.concept}
                                    onChange={(e) => handleUpdateItem(item.id, 'concept', e.target.value)}
                                    className="block w-full font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none pb-0.5"
                                  />
                                  <input
                                    id={`item-desc-input-${item.id}`}
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                                    className="block w-full text-[10px] text-slate-400 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none mt-1"
                                    placeholder="Descripción corta de la tarea..."
                                  />
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <input
                                    id={`item-qty-input-${item.id}`}
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                                    className="block w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-center font-mono font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                  />
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <div className="relative">
                                    <input
                                      id={`item-price-input-${item.id}`}
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={item.price}
                                      onChange={(e) => handleUpdateItem(item.id, 'price', e.target.value)}
                                      className="block w-full bg-slate-50 border border-slate-200 rounded pl-1.5 pr-4 py-1 text-right font-mono font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <span className="absolute inset-y-0 right-1.5 flex items-center text-[10px] text-slate-400 font-sans">€</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                                  {(item.price * item.quantity).toFixed(2)}€
                                </td>
                                <td className="py-3 pr-1 text-center">
                                  <button
                                    id={`btn-remove-item-${item.id}`}
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-all cursor-pointer"
                                    title="Quitar línea"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {activeItems.length === 0 && (
                              <tr>
                                <td colSpan={5} className="py-10 text-center text-slate-400 italic font-medium">
                                  Presupuesto vacío. Selecciona servicios de arriba o de la guía de diagnóstico.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* DISCOUNT, IVA & FINALS BLOCK */}
                      <div className="border-t border-slate-100 pt-4 space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Discount setup */}
                          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Descuento del Presupuesto</label>
                            <div className="flex items-center gap-2">
                              <select
                                id="discount-type-select"
                                value={discountType}
                                onChange={(e) => setDiscountType(e.target.value as any)}
                                className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs focus:outline-none"
                              >
                                <option value="percent">Porcentaje (%)</option>
                                <option value="amount">Cantidad Fija (€)</option>
                              </select>
                              
                              <div className="relative flex-1">
                                <input
                                  id="discount-value-input"
                                  type="number"
                                  min="0"
                                  value={discountType === 'percent' ? discountPercent : discountAmount}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    if (discountType === 'percent') {
                                      setDiscountPercent(Math.min(100, val));
                                    } else {
                                      setDiscountAmount(val);
                                    }
                                  }}
                                  className="block w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-right font-medium text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                                <span className="absolute inset-y-0 right-2.5 flex items-center text-slate-400 font-bold font-mono">
                                  {discountType === 'percent' ? '%' : '€'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* VAT (IVA) setup */}
                          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">I.V.A. Aplicable</label>
                            <div className="grid grid-cols-3 gap-1">
                              {[
                                { val: 21, lbl: '21% Gral' },
                                { val: 10, lbl: '10% Red.' },
                                { val: 0, lbl: '0% Exento' }
                              ].map(rate => (
                                <button
                                  id={`iva-rate-btn-${rate.val}`}
                                  key={rate.val}
                                  type="button"
                                  onClick={() => setIvaPercent(rate.val as any)}
                                  className={`py-2 text-center rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                                    ivaPercent === rate.val
                                      ? 'bg-blue-600 border-blue-600 text-white font-bold'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  {rate.lbl}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Extra Specific Budget Conditions */}
                        <div>
                          <label htmlFor="budget-specific-notes" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notas Específicas / Plazos del Trabajo (Opcional)</label>
                          <textarea
                            id="budget-specific-notes"
                            value={budgetNotes}
                            onChange={(e) => setBudgetNotes(e.target.value)}
                            rows={2}
                            className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                            placeholder="Ej. Se requiere cortar la corriente general durante 1 hora. Plazo estimado de trabajo: 4 horas."
                          />
                        </div>

                        {/* Live active totals summary box */}
                        <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100/40 space-y-2">
                          <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                            <span>Suma Subtotal:</span>
                            <span className="font-mono">{subtotal.toFixed(2)}€</span>
                          </div>

                          {discAmount > 0 && (
                            <div className="flex justify-between items-center text-[11px] text-rose-600 font-semibold">
                              <span>Descuento aplicado:</span>
                              <span className="font-mono">-{discAmount.toFixed(2)}€</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                            <span>Base Imponible:</span>
                            <span className="font-mono">{baseImponible.toFixed(2)}€</span>
                          </div>

                          <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium border-b border-dashed border-slate-200/60 pb-2">
                            <span>IVA ({ivaPercent}%):</span>
                            <span className="font-mono">{ivaAmount.toFixed(2)}€</span>
                          </div>

                          <div className="flex justify-between items-center pt-1">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">TOTAL ESTIMADO:</span>
                            <span className="text-lg font-mono font-extrabold text-blue-600">{total.toFixed(2)}€</span>
                          </div>
                        </div>
                      </div>

                      {/* Main action triggers */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          id="btn-action-clear-form"
                          onClick={() => { if(confirm('¿Seguro de que quieres limpiar todo el presupuesto? Se borrará lo escrito.')) handleClearForm(); }}
                          className="px-4 py-2 text-slate-400 hover:text-slate-600 text-xs font-bold transition-all cursor-pointer"
                        >
                          Limpiar Formulario
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            id="btn-action-quick-preview"
                            disabled={activeItems.length === 0}
                            onClick={() => setIsPreviewing(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Vista Previa
                          </button>

                          <button
                            id="btn-action-save-budget"
                            disabled={activeItems.length === 0}
                            onClick={() => handleSaveBudget('pendiente')}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            {editingId ? 'Actualizar Presupuesto' : 'Guardar en Historial'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HISTORIAL DE PRESUPUESTOS Y METRICAS */}
            {currentTab === 'historial' && (
              <div className="space-y-6 md:space-y-8 animate-fade-in no-print">
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                    Historial de Presupuestos
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Inspecciona, filtra y gestiona los presupuestos archivados. Haz clic en Editar para cargar los datos en el editor general.
                  </p>
                </div>

                <BudgetHistoryComponent
                  budgets={budgets}
                  onLoadBudget={handleLoadBudget}
                  onDeleteBudget={handleDeleteBudget}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            )}

            {/* TAB 3: CONFIGURACIÓN DE TARIFAS Y DATOS */}
            {currentTab === 'configuracion' && (
              <div className="space-y-6 md:space-y-8 animate-fade-in no-print">
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                    Ajustes de Instalador
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Administra tus precios fijos por defecto y la información comercial de cabecera de tus facturas.
                  </p>
                </div>

                <CompanyConfigComponent
                  config={companyConfig}
                  onSaveConfig={handleSaveCompanyConfig}
                  presetServices={presetServices}
                  onSavePresets={handleSavePresets}
                  onResetPresets={handleResetPresets}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER SECTION - Hidden in print */}
      <footer className="bg-slate-900 text-slate-500 py-6 border-t border-slate-800 text-center text-xs mt-12 no-print shrink-0">
        <div className="max-w-7xl mx-auto px-6 space-y-1">
          <p className="font-medium text-slate-400">AVERIAS DE AIRES ACONDICIONADOS — Herramienta Profesional de Presupuestos</p>
          <p>© {new Date().getFullYear()} — Diseñado de forma limpia, robusta y local para Técnicos y Montadores de Climatización.</p>
        </div>
      </footer>
    </div>
  );
}
