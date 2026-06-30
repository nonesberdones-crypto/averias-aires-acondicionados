/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CompanyConfig {
  name: string;
  nif: string;
  phone: string;
  email: string;
  address: string;
  notes: string; // Standard warranty / payment conditions
}

export interface ClientInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  machineType: 'split' | 'multi-split' | 'conductos' | 'cassette' | 'suelo-techo' | 'otro';
  machineBrand: string;
  machineModel: string;
  frigories: string; // e.g., 3000 frig/h (or kW)
}

export interface PresetService {
  id: string;
  category: 'instalacion' | 'limpieza' | 'reparacion' | 'mano_obra';
  concept: string;
  description: string;
  defaultPrice: number;
}

export interface BudgetItem {
  id: string;
  concept: string;
  description: string;
  price: number;
  quantity: number;
  category: 'instalacion' | 'limpieza' | 'reparacion' | 'mano_obra' | 'personalizado';
}

export type BudgetStatus = 'pendiente' | 'aceptado' | 'rechazado' | 'facturado';

export interface Budget {
  id: string;
  budgetNumber: string;
  date: string;
  dueDate: string;
  client: ClientInfo;
  items: BudgetItem[];
  discountPercent: number;
  discountAmount: number;
  ivaPercent: 0 | 10 | 21;
  status: BudgetStatus;
  notes: string;
}

export interface DiagnosticIssue {
  id: string;
  symptom: string;
  icon: string; // Lucide icon name
  description: string;
  checks: string[];
  recommendedSolutions: {
    concept: string;
    description: string;
    price: number;
    category: 'instalacion' | 'limpieza' | 'reparacion' | 'mano_obra';
  }[];
}
