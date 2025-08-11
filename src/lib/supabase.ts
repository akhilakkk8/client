import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Client {
  id: string;
  name: string;
  website: string;
  linkedin: string;
  created_at: string;
}

export interface ImplementationPartner {
  id: string;
  name: string;
  website: string;
  linkedin: string;
  client_id: string;
  created_at: string;
}

export interface PrimeVendor {
  id: string;
  name: string;
  website: string;
  linkedin: string;
  implementation_partner_id: string;
  created_at: string;
}

export interface SubVendor {
  id: string;
  name: string;
  website: string;
  linkedin: string;
  prime_vendor_id: string;
  created_at: string;
}

export interface Recruiter {
  id: string;
  name: string;
  website: string;
  linkedin: string;
  sub_vendor_id: string;
  created_at: string;
}

export interface ClientHierarchy {
  client: Client;
  implementationPartners: (ImplementationPartner & {
    primeVendors: (PrimeVendor & {
      subVendors: (SubVendor & {
        recruiters: Recruiter[];
      })[];
    })[];
  })[];
}