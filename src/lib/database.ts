import { supabase } from './supabase';
import type { Client, ImplementationPartner, PrimeVendor, SubVendor, Recruiter, ClientHierarchy } from './supabase';

export const addClient = async (client: Omit<Client, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const addImplementationPartner = async (partner: Omit<ImplementationPartner, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('implementation_partners')
    .insert([partner])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const addPrimeVendor = async (vendor: Omit<PrimeVendor, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('prime_vendors')
    .insert([vendor])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const addSubVendor = async (vendor: Omit<SubVendor, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('sub_vendors')
    .insert([vendor])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const addRecruiter = async (recruiter: Omit<Recruiter, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('recruiters')
    .insert([recruiter])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getAllClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const searchClients = async (searchTerm: string): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .ilike('name', `%${searchTerm}%`)
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const getClientHierarchy = async (clientId: string): Promise<ClientHierarchy | null> => {
  // Get client
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();
  
  if (clientError) throw clientError;
  if (!client) return null;

  // Get implementation partners
  const { data: implementationPartners, error: partnersError } = await supabase
    .from('implementation_partners')
    .select('*')
    .eq('client_id', clientId);
  
  if (partnersError) throw partnersError;

  // For each implementation partner, get their hierarchy
  const partnersWithHierarchy = await Promise.all(
    (implementationPartners || []).map(async (partner) => {
      // Get prime vendors
      const { data: primeVendors, error: primeError } = await supabase
        .from('prime_vendors')
        .select('*')
        .eq('implementation_partner_id', partner.id);
      
      if (primeError) throw primeError;

      // For each prime vendor, get sub vendors
      const vendorsWithSubs = await Promise.all(
        (primeVendors || []).map(async (primeVendor) => {
          // Get sub vendors
          const { data: subVendors, error: subError } = await supabase
            .from('sub_vendors')
            .select('*')
            .eq('prime_vendor_id', primeVendor.id);
          
          if (subError) throw subError;

          // For each sub vendor, get recruiters
          const subsWithRecruiters = await Promise.all(
            (subVendors || []).map(async (subVendor) => {
              const { data: recruiters, error: recruiterError } = await supabase
                .from('recruiters')
                .select('*')
                .eq('sub_vendor_id', subVendor.id);
              
              if (recruiterError) throw recruiterError;

              return {
                ...subVendor,
                recruiters: recruiters || []
              };
            })
          );

          return {
            ...primeVendor,
            subVendors: subsWithRecruiters
          };
        })
      );

      return {
        ...partner,
        primeVendors: vendorsWithSubs
      };
    })
  );

  return {
    client,
    implementationPartners: partnersWithHierarchy
  };
};