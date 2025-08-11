import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import FormInput from './FormInput';
import { addClient, addImplementationPartner, addPrimeVendor, addSubVendor, addRecruiter } from '../lib/database';

interface FormData {
  name: string;
  website: string;
  linkedin: string;
}

interface HierarchyLevel {
  data: FormData;
  children: HierarchyLevel[];
}

const ClientForm: React.FC = () => {
  const [clientData, setClientData] = useState<FormData>({
    name: '',
    website: '',
    linkedin: ''
  });

  const [implementationPartners, setImplementationPartners] = useState<HierarchyLevel[]>([
    { data: { name: '', website: '', linkedin: '' }, children: [] }
  ]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateClientData = (field: keyof FormData, value: string) => {
    setClientData(prev => ({ ...prev, [field]: value }));
  };

  const updatePartnerData = (index: number, field: keyof FormData, value: string) => {
    setImplementationPartners(prev => prev.map((partner, i) => 
      i === index 
        ? { ...partner, data: { ...partner.data, [field]: value } }
        : partner
    ));
  };

  const addImplementationPartnerField = () => {
    setImplementationPartners(prev => [
      ...prev,
      { data: { name: '', website: '', linkedin: '' }, children: [] }
    ]);
  };

  const removeImplementationPartner = (index: number) => {
    setImplementationPartners(prev => prev.filter((_, i) => i !== index));
  };

  const addPrimeVendorField = (partnerIndex: number) => {
    setImplementationPartners(prev => prev.map((partner, i) => 
      i === partnerIndex 
        ? { 
            ...partner, 
            children: [
              ...partner.children,
              { data: { name: '', website: '', linkedin: '' }, children: [] }
            ]
          }
        : partner
    ));
  };

  const updatePrimeVendorData = (partnerIndex: number, vendorIndex: number, field: keyof FormData, value: string) => {
    setImplementationPartners(prev => prev.map((partner, i) => 
      i === partnerIndex 
        ? {
            ...partner,
            children: partner.children.map((vendor, j) => 
              j === vendorIndex 
                ? { ...vendor, data: { ...vendor.data, [field]: value } }
                : vendor
            )
          }
        : partner
    ));
  };

  const removePrimeVendor = (partnerIndex: number, vendorIndex: number) => {
    setImplementationPartners(prev => prev.map((partner, i) => 
      i === partnerIndex 
        ? { ...partner, children: partner.children.filter((_, j) => j !== vendorIndex) }
        : partner
    ));
  };

  const addSubVendorField = (partnerIndex: number, vendorIndex: number) => {
    setImplementationPartners(prev => prev.map((partner, i) => 
      i === partnerIndex 
        ? {
            ...partner,
            children: partner.children.map((vendor, j) => 
              j === vendorIndex 
                ? {
                    ...vendor,
                    children: [
                      ...vendor.children,
                      { data: { name: '', website: '', linkedin: '' }, children: [] }
                    ]
                  }
                : vendor
            )
          }
        : partner
    ));
  };

  const updateSubVendorData = (partnerIndex: number, vendorIndex: number, subIndex: number, field: keyof FormData, value: string) => {
    setImplementationPartners(prev => prev.map((partner, i) => 
      i === partnerIndex 
        ? {
            ...partner,
            children: partner.children.map((vendor, j) => 
              j === vendorIndex 
                ? {
                    ...vendor,
                    children: vendor.children.map((sub, k) => 
                      k === subIndex 
                        ? { ...sub, data: { ...sub.data, [field]: value } }
                        : sub
                    )
                  }
                : vendor
            )
          }
        : partner
    ));
  };

  const removeSubVendor = (partnerIndex: number, vendorIndex: number, subIndex: number) => {
    setImplementationPartners(prev => prev.map((partner, i) => 
      i === partnerIndex 
        ? {
            ...partner,
            children: partner.children.map((vendor, j) => 
              j === vendorIndex 
                ? { ...vendor, children: vendor.children.filter((_, k) => k !== subIndex) }
                : vendor
            )
          }
        : partner
    ));
  };

  const addRecruiterField = (partnerIndex: number, vendorIndex: number, subIndex: number) => {
    setImplementationPartners(prev => prev.map((partner, i) => 
      i === partnerIndex 
        ? {
            ...partner,
            children: partner.children.map((vendor, j) => 
              j === vendorIndex 
                ? {
                    ...vendor,
                    children: vendor.children.map((sub, k) => 
                      k === subIndex 
                        ? {
                            ...sub,
                            children: [
                              ...sub.children,
                              { data: { name: '', website: '', linkedin: '' }, children: [] }
                            ]
                          }
                        : sub
                    )
                  }
                : vendor
            )
          }
        : partner
    ));
  };

  const updateRecruiterData = (partnerIndex: number, vendorIndex: number, subIndex: number, recruiterIndex: number, field: keyof FormData, value: string) => {
    setImplementationPartners(prev => prev.map((partner, i) => 
      i === partnerIndex 
        ? {
            ...partner,
            children: partner.children.map((vendor, j) => 
              j === vendorIndex 
                ? {
                    ...vendor,
                    children: vendor.children.map((sub, k) => 
                      k === subIndex 
                        ? {
                            ...sub,
                            children: sub.children.map((recruiter, l) => 
                              l === recruiterIndex 
                                ? { ...recruiter, data: { ...recruiter.data, [field]: value } }
                                : recruiter
                            )
                          }
                        : sub
                    )
                  }
                : vendor
            )
          }
        : partner
    ));
  };

  const removeRecruiter = (partnerIndex: number, vendorIndex: number, subIndex: number, recruiterIndex: number) => {
    setImplementationPartners(prev => prev.map((partner, i) => 
      i === partnerIndex 
        ? {
            ...partner,
            children: partner.children.map((vendor, j) => 
              j === vendorIndex 
                ? {
                    ...vendor,
                    children: vendor.children.map((sub, k) => 
                      k === subIndex 
                        ? { ...sub, children: sub.children.filter((_, l) => l !== recruiterIndex) }
                        : sub
                    )
                  }
                : vendor
            )
          }
        : partner
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Add client
      const client = await addClient(clientData);
      
      // Add implementation partners and their hierarchy
      for (const partner of implementationPartners) {
        if (partner.data.name.trim()) {
          const implementationPartner = await addImplementationPartner({
            ...partner.data,
            client_id: client.id
          });
          
          // Add prime vendors
          for (const vendor of partner.children) {
            if (vendor.data.name.trim()) {
              const primeVendor = await addPrimeVendor({
                ...vendor.data,
                implementation_partner_id: implementationPartner.id
              });
              
              // Add sub vendors
              for (const sub of vendor.children) {
                if (sub.data.name.trim()) {
                  const subVendor = await addSubVendor({
                    ...sub.data,
                    prime_vendor_id: primeVendor.id
                  });
                  
                  // Add recruiters
                  for (const recruiter of sub.children) {
                    if (recruiter.data.name.trim()) {
                      await addRecruiter({
                        ...recruiter.data,
                        sub_vendor_id: subVendor.id
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Reset form
        setClientData({ name: '', website: '', linkedin: '' });
        setImplementationPartners([{ data: { name: '', website: '', linkedin: '' }, children: [] }]);
      }, 2000);
      
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-green-100 border border-green-400 text-green-700 px-8 py-4 rounded-lg">
          <h3 className="font-semibold">Success!</h3>
          <p>Client hierarchy has been saved successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Client Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Client Name"
            value={clientData.name}
            onChange={(value) => updateClientData('name', value)}
            placeholder="e.g., Walmart"
            required
          />
          <FormInput
            label="Website"
            value={clientData.website}
            onChange={(value) => updateClientData('website', value)}
            placeholder="https://..."
          />
          <FormInput
            label="LinkedIn"
            value={clientData.linkedin}
            onChange={(value) => updateClientData('linkedin', value)}
            placeholder="https://linkedin.com/company/..."
          />
        </div>
      </div>

      {/* Implementation Partners Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Implementation Partners</h2>
          <button
            type="button"
            onClick={addImplementationPartnerField}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Partner</span>
          </button>
        </div>

        {implementationPartners.map((partner, partnerIndex) => (
          <div key={partnerIndex} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-800">Implementation Partner {partnerIndex + 1}</h3>
              {implementationPartners.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImplementationPartner(partnerIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormInput
                label="Partner Name"
                value={partner.data.name}
                onChange={(value) => updatePartnerData(partnerIndex, 'name', value)}
                placeholder="e.g., TCS, TechM"
              />
              <FormInput
                label="Website"
                value={partner.data.website}
                onChange={(value) => updatePartnerData(partnerIndex, 'website', value)}
                placeholder="https://..."
              />
              <FormInput
                label="LinkedIn"
                value={partner.data.linkedin}
                onChange={(value) => updatePartnerData(partnerIndex, 'linkedin', value)}
                placeholder="https://linkedin.com/company/..."
              />
            </div>

            {/* Prime Vendors */}
            <div className="ml-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Prime Vendors</h4>
                <button
                  type="button"
                  onClick={() => addPrimeVendorField(partnerIndex)}
                  className="flex items-center space-x-1 px-2 py-1 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors text-sm"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Prime Vendor</span>
                </button>
              </div>

              {partner.children.map((vendor, vendorIndex) => (
                <div key={vendorIndex} className="mb-4 p-3 bg-white rounded border">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium text-gray-600">Prime Vendor {vendorIndex + 1}</h5>
                    <button
                      type="button"
                      onClick={() => removePrimeVendor(partnerIndex, vendorIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <FormInput
                      label="Vendor Name"
                      value={vendor.data.name}
                      onChange={(value) => updatePrimeVendorData(partnerIndex, vendorIndex, 'name', value)}
                      placeholder="e.g., APEX"
                    />
                    <FormInput
                      label="Website"
                      value={vendor.data.website}
                      onChange={(value) => updatePrimeVendorData(partnerIndex, vendorIndex, 'website', value)}
                      placeholder="https://..."
                    />
                    <FormInput
                      label="LinkedIn"
                      value={vendor.data.linkedin}
                      onChange={(value) => updatePrimeVendorData(partnerIndex, vendorIndex, 'linkedin', value)}
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>

                  {/* Sub Vendors */}
                  <div className="ml-3">
                    <div className="flex justify-between items-center mb-2">
                      <h6 className="font-medium text-gray-600 text-sm">Sub Vendors</h6>
                      <button
                        type="button"
                        onClick={() => addSubVendorField(partnerIndex, vendorIndex)}
                        className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors text-xs"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Sub Vendor</span>
                      </button>
                    </div>

                    {vendor.children.map((sub, subIndex) => (
                      <div key={subIndex} className="mb-3 p-2 bg-gray-50 rounded border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Sub Vendor {subIndex + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeSubVendor(partnerIndex, vendorIndex, subIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                          <FormInput
                            label="Sub Vendor Name"
                            value={sub.data.name}
                            onChange={(value) => updateSubVendorData(partnerIndex, vendorIndex, subIndex, 'name', value)}
                            placeholder="Sub vendor name"
                          />
                          <FormInput
                            label="Website"
                            value={sub.data.website}
                            onChange={(value) => updateSubVendorData(partnerIndex, vendorIndex, subIndex, 'website', value)}
                            placeholder="https://..."
                          />
                          <FormInput
                            label="LinkedIn"
                            value={sub.data.linkedin}
                            onChange={(value) => updateSubVendorData(partnerIndex, vendorIndex, subIndex, 'linkedin', value)}
                            placeholder="https://linkedin.com/company/..."
                          />
                        </div>

                        {/* Recruiters */}
                        <div className="ml-2">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-gray-600">Recruiters</span>
                            <button
                              type="button"
                              onClick={() => addRecruiterField(partnerIndex, vendorIndex, subIndex)}
                              className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-xs"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Recruiter</span>
                            </button>
                          </div>

                          {sub.children.map((recruiter, recruiterIndex) => (
                            <div key={recruiterIndex} className="mb-2 p-2 bg-white rounded border">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-600">Recruiter {recruiterIndex + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => removeRecruiter(partnerIndex, vendorIndex, subIndex, recruiterIndex)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <FormInput
                                  label="Recruiter Name"
                                  value={recruiter.data.name}
                                  onChange={(value) => updateRecruiterData(partnerIndex, vendorIndex, subIndex, recruiterIndex, 'name', value)}
                                  placeholder="Recruiter name"
                                />
                                <FormInput
                                  label="Website"
                                  value={recruiter.data.website}
                                  onChange={(value) => updateRecruiterData(partnerIndex, vendorIndex, subIndex, recruiterIndex, 'website', value)}
                                  placeholder="https://..."
                                />
                                <FormInput
                                  label="LinkedIn"
                                  value={recruiter.data.linkedin}
                                  onChange={(value) => updateRecruiterData(partnerIndex, vendorIndex, subIndex, recruiterIndex, 'linkedin', value)}
                                  placeholder="https://linkedin.com/profile/..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !clientData.name.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Save Client Hierarchy'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;