// @liventra/types
// Single source of truth for all domain entity types shared across portals.
//
// Usage in any frontend:
//   import type { Property, Unit, ApiResponse } from '@liventra/types';
//
// Install:
//   npm install file:../../liventra/types
//
// After backend schema changes, update this file and re-run npm install
// in each frontend (or run the sync script: npm run types:sync).

// ─── API response envelope ──────────────────────────────────────────────────
// All backend endpoints return this shape.
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Enums ──────────────────────────────────────────────────────────────────

export type StaffRole =
  | 'admin'
  | 'manager'
  | 'accountant'
  | 'leasing_agent'
  | 'maintenance_coordinator'
  | 'viewer';

export type UserType = 'staff' | 'owner' | 'tenant' | 'admin_user' | 'super_admin';

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'waived' | 'scheduled';
export type ContractStatus = 'draft' | 'active' | 'expired' | 'terminated';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type MaintenanceStatus =
  | 'open'
  | 'assigned'
  | 'pending'
  | 'in_progress'
  | 'pending_parts'
  | 'resolved'
  | 'closed';
export type MaintenanceRequestType = 'emergency' | 'standard' | 'preventive' | 'inspection';
export type LifecycleStatus = 'trial' | 'active' | 'overdue' | 'suspended' | 'cancelled';
export type UnitLifecycleStatus = 'vacant' | 'occupied' | 'maintenance' | 'reserved';
export type DisputeStatus = 'open' | 'escalated' | 'resolved' | 'dismissed';
export type PurchaseOrderStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'completed';

// ─── Company ────────────────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  name_ar?: string;
  plan: 'trial' | 'basic' | 'professional' | 'enterprise';
  is_active: boolean;
  lifecycle_status: LifecycleStatus;
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}

// ─── Staff ──────────────────────────────────────────────────────────────────

export interface StaffUser {
  id: string;
  company_id: string;
  full_name: string;
  full_name_ar?: string;
  phone: string;
  email?: string;
  role: StaffRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Property ───────────────────────────────────────────────────────────────

export interface Property {
  id: string;
  company_id: string;
  owner_id?: string;
  name: string;
  name_ar?: string;
  address: string;
  address_ar?: string;
  city?: string;
  district?: string;
  deed_number?: string;
  total_units: number;
  occupied_units?: number;
  maintenance_delegated_to_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Unit ───────────────────────────────────────────────────────────────────

export interface Unit {
  id: string;
  property_id: string;
  company_id: string;
  unit_number: string;
  floor?: number;
  type?: string;
  area_sqm?: number;
  monthly_rent: number;
  annual_rent?: number;
  active_tenant_id?: string;
  lifecycle_status: UnitLifecycleStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // populated by joins
  property?: Pick<Property, 'id' | 'name' | 'name_ar' | 'address'>;
  active_tenant?: Pick<Tenant, 'id' | 'full_name' | 'full_name_ar' | 'phone'>;
}

// ─── Owner ──────────────────────────────────────────────────────────────────

export interface Owner {
  id: string;
  company_id: string;
  full_name: string;
  full_name_ar?: string;
  phone: string;
  email?: string;
  national_id?: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Tenant ─────────────────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  company_id: string;
  full_name: string;
  full_name_ar?: string;
  phone: string;
  email?: string;
  national_id?: string;
  nationality?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Contract ───────────────────────────────────────────────────────────────

export interface Contract {
  id: string;
  company_id: string;
  unit_id: string;
  tenant_id: string;
  owner_id?: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  annual_rent?: number;
  deposit_amount?: number;
  status: ContractStatus;
  ejar_registered: boolean;
  ejar_contract_number?: string;
  payment_day?: number;
  created_at: string;
  updated_at: string;
  // populated by joins
  unit?: Pick<Unit, 'id' | 'unit_number' | 'property_id'> & { property?: Pick<Property, 'id' | 'name' | 'name_ar'> };
  tenant?: Pick<Tenant, 'id' | 'full_name' | 'full_name_ar' | 'phone'>;
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export interface Payment {
  id: string;
  company_id: string;
  contract_id: string;
  tenant_id: string;
  unit_id: string;
  amount: number;
  month: number;
  year: number;
  due_date: string;
  paid_date?: string;
  status: PaymentStatus;
  payment_method?: string;
  reference_number?: string;
  late_fee?: number;
  waive_reason?: string;
  created_at: string;
  updated_at: string;
  // populated by joins
  contract?: Pick<Contract, 'id' | 'monthly_rent'>;
  tenant?: Pick<Tenant, 'id' | 'full_name' | 'full_name_ar' | 'phone'>;
  unit?: Pick<Unit, 'id' | 'unit_number'> & { property?: Pick<Property, 'id' | 'name'> };
}

// ─── Lead ────────────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  company_id?: string;
  full_name?: string;
  phone: string;
  email?: string;
  source?: string;
  status: LeadStatus;
  score?: number;
  notes?: string;
  property_interest?: string;
  budget_min?: number;
  budget_max?: number;
  converted_tenant_id?: string;
  created_at: string;
  updated_at: string;
}

// ─── Maintenance ─────────────────────────────────────────────────────────────

export interface MaintenanceFlow {
  id: string;
  name: string;
  type: MaintenanceRequestType;
  requires_approval: boolean;
  auto_execute: boolean;
  steps: MaintenanceStatus[];
  is_default: boolean;
  is_active: boolean;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceTicket {
  id: string;
  company_id: string;
  unit_id: string;
  tenant_id?: string;
  assigned_to?: string;
  request_type: MaintenanceRequestType;
  flow_id?: string;
  title: string;
  description?: string;
  status: MaintenanceStatus;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_cost?: number;
  actual_cost?: number;
  scheduled_date?: string;
  completed_date?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  // populated by joins
  unit?: Pick<Unit, 'id' | 'unit_number'> & { property?: Pick<Property, 'id' | 'name' | 'name_ar'> };
  tenant?: Pick<Tenant, 'id' | 'full_name' | 'full_name_ar' | 'phone'>;
  flow?: Pick<MaintenanceFlow, 'id' | 'name' | 'type' | 'steps'>;
}

// ─── Purchase Order ──────────────────────────────────────────────────────────

export interface PurchaseOrder {
  id: string;
  company_id: string;
  ticket_id?: string;
  vendor_id?: string;
  title: string;
  description?: string;
  amount: number;
  status: PurchaseOrderStatus;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// ─── Vendor ──────────────────────────────────────────────────────────────────

export interface Vendor {
  id: string;
  company_id: string;
  name: string;
  name_ar?: string;
  phone?: string;
  email?: string;
  specialty?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Supplier Invoice ────────────────────────────────────────────────────────

export interface SupplierInvoice {
  id: string;
  company_id: string;
  vendor_id?: string;
  ticket_id?: string;
  purchase_order_id?: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  invoice_number?: string;
  invoice_date?: string;
  paid_date?: string;
  created_at: string;
  updated_at: string;
}

// ─── Dispute ─────────────────────────────────────────────────────────────────

export interface Dispute {
  id: string;
  company_id: string;
  contract_id: string;
  tenant_id: string;
  unit_id: string;
  type: string;
  description: string;
  status: DisputeStatus;
  resolution_notes?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

// ─── Document ────────────────────────────────────────────────────────────────

export interface Document {
  id: string;
  company_id: string;
  entity_type: 'property' | 'unit' | 'tenant' | 'contract' | 'owner';
  entity_id: string;
  title: string;
  file_url: string;
  file_type?: string;
  created_at: string;
  updated_at: string;
}

// ─── Expense ─────────────────────────────────────────────────────────────────

export interface Expense {
  id: string;
  company_id: string;
  property_id?: string;
  unit_id?: string;
  category: string;
  description?: string;
  amount: number;
  date: string;
  created_at: string;
  updated_at: string;
}

// ─── Meter Reading ───────────────────────────────────────────────────────────

export interface MeterReading {
  id: string;
  company_id: string;
  unit_id: string;
  tenant_id?: string;
  meter_type: 'electricity' | 'water' | 'gas';
  reading: number;
  reading_date: string;
  previous_reading?: number;
  consumption?: number;
  created_at: string;
  updated_at: string;
}

// ─── Inspection ──────────────────────────────────────────────────────────────

export interface Inspection {
  id: string;
  company_id: string;
  unit_id: string;
  type: 'move_in' | 'move_out' | 'periodic' | 'maintenance';
  scheduled_date?: string;
  completed_date?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

// ─── Auth token payload ──────────────────────────────────────────────────────

export interface JwtPayload {
  type: UserType;
  id: string;
  company_id: string | null;
  role: StaffRole | 'owner' | 'tenant' | 'admin_user' | 'super_admin';
  phone?: string;
  email?: string;
  exp: number;
  iat: number;
}

// ─── Common utility types ────────────────────────────────────────────────────

export type UUID = string;
export type ISODateString = string;
