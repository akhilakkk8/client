/*
  # Client Hierarchy Database Schema

  1. New Tables
    - `clients` - Main client companies (e.g., Walmart)
      - `id` (uuid, primary key)
      - `name` (text, company name)
      - `website` (text, optional website URL)
      - `linkedin` (text, optional LinkedIn profile)
      - `created_at` (timestamp)
    
    - `implementation_partners` - Partners working with clients (e.g., TCS, TechM)
      - `id` (uuid, primary key)
      - `name` (text, partner name)
      - `website` (text, optional website URL)  
      - `linkedin` (text, optional LinkedIn profile)
      - `client_id` (uuid, foreign key to clients)
      - `created_at` (timestamp)
    
    - `prime_vendors` - Primary vendors under implementation partners
      - `id` (uuid, primary key)
      - `name` (text, vendor name)
      - `website` (text, optional website URL)
      - `linkedin` (text, optional LinkedIn profile)
      - `implementation_partner_id` (uuid, foreign key to implementation_partners)
      - `created_at` (timestamp)
    
    - `sub_vendors` - Sub vendors under prime vendors
      - `id` (uuid, primary key)
      - `name` (text, vendor name)
      - `website` (text, optional website URL)
      - `linkedin` (text, optional LinkedIn profile)
      - `prime_vendor_id` (uuid, foreign key to prime_vendors)
      - `created_at` (timestamp)
    
    - `recruiters` - Recruiters under sub vendors
      - `id` (uuid, primary key)
      - `name` (text, recruiter name)
      - `website` (text, optional website URL)
      - `linkedin` (text, optional LinkedIn profile)
      - `sub_vendor_id` (uuid, foreign key to sub_vendors)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read/write access (no authentication required)
*/

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text DEFAULT '',
  linkedin text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Implementation Partners table  
CREATE TABLE IF NOT EXISTS implementation_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text DEFAULT '',
  linkedin text DEFAULT '',
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Prime Vendors table
CREATE TABLE IF NOT EXISTS prime_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text DEFAULT '',
  linkedin text DEFAULT '',
  implementation_partner_id uuid REFERENCES implementation_partners(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Sub Vendors table
CREATE TABLE IF NOT EXISTS sub_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text DEFAULT '',
  linkedin text DEFAULT '',
  prime_vendor_id uuid REFERENCES prime_vendors(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Recruiters table
CREATE TABLE IF NOT EXISTS recruiters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text DEFAULT '',
  linkedin text DEFAULT '',
  sub_vendor_id uuid REFERENCES sub_vendors(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE implementation_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE prime_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Public read access for clients"
  ON clients FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public insert access for clients"
  ON clients FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public update access for clients"
  ON clients FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Public read access for implementation_partners"
  ON implementation_partners FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public insert access for implementation_partners"
  ON implementation_partners FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public update access for implementation_partners"
  ON implementation_partners FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Public read access for prime_vendors"
  ON prime_vendors FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public insert access for prime_vendors"
  ON prime_vendors FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public update access for prime_vendors"
  ON prime_vendors FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Public read access for sub_vendors"
  ON sub_vendors FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public insert access for sub_vendors"
  ON sub_vendors FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public update access for sub_vendors"
  ON sub_vendors FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Public read access for recruiters"
  ON recruiters FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public insert access for recruiters"
  ON recruiters FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public update access for recruiters"
  ON recruiters FOR UPDATE
  TO anon
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_implementation_partners_client_id ON implementation_partners(client_id);
CREATE INDEX IF NOT EXISTS idx_prime_vendors_implementation_partner_id ON prime_vendors(implementation_partner_id);
CREATE INDEX IF NOT EXISTS idx_sub_vendors_prime_vendor_id ON sub_vendors(prime_vendor_id);
CREATE INDEX IF NOT EXISTS idx_recruiters_sub_vendor_id ON recruiters(sub_vendor_id);