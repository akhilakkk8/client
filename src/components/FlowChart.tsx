import React, { useState } from 'react';
import { Building2, Users, Briefcase, UserCheck, User, ChevronRight, ChevronDown } from 'lucide-react';
import type { ClientHierarchy } from '../lib/supabase';

interface FlowChartProps {
  hierarchy: ClientHierarchy;
  onNodeClick: (data: any, type: string) => void;
}

const FlowChart: React.FC<FlowChartProps> = ({ hierarchy, onNodeClick }) => {
  // State to track which nodes are expanded
  const [expandedPartners, setExpandedPartners] = useState<string[]>([]);
  const [expandedVendors, setExpandedVendors] = useState<string[]>([]);
  const [expandedSubVendors, setExpandedSubVendors] = useState<string[]>([]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'client': return Building2;
      case 'implementation_partner': return Users;
      case 'prime_vendor': return Briefcase;
      case 'sub_vendor': return UserCheck;
      case 'recruiter': return User;
      default: return Building2;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'client': return 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200';
      case 'implementation_partner': return 'bg-teal-100 text-teal-700 border-teal-300 hover:bg-teal-200';
      case 'prime_vendor': return 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200';
      case 'sub_vendor': return 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200';
      case 'recruiter': return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200';
    }
  };

  const togglePartner = (id: string) => {
    setExpandedPartners(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleVendor = (id: string) => {
    setExpandedVendors(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const toggleSubVendor = (id: string) => {
    setExpandedSubVendors(prev => 
      prev.includes(id) ? prev.filter(sv => sv !== id) : [...prev, id]
    );
  };

  const NodeComponent = ({ 
    data, 
    type, 
    hasChildren = false,
    isExpanded = false,
    onToggle = () => {}
  }: { 
    data: any; 
    type: string; 
    hasChildren?: boolean;
    isExpanded?: boolean;
    onToggle?: () => void;
  }) => {
    const Icon = getIcon(type);
    
    return (
      <div className="flex items-center">
        <button
          onClick={() => onNodeClick(data, type)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors cursor-pointer ${getColorClass(type)}`}
        >
          <Icon className="h-4 w-4" />
          <span className="font-medium">{data.name}</span>
        </button>
        
        {hasChildren && (
          <button 
            onClick={onToggle}
            className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            {isExpanded ? 
              <ChevronDown className="h-4 w-4 text-gray-600" /> : 
              <ChevronRight className="h-4 w-4 text-gray-600" />
            }
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max p-6">
        <div className="flex">
          {/* Client */}
          <div className="flex flex-col items-center">
            <NodeComponent 
              data={hierarchy.client} 
              type="client" 
              hasChildren={hierarchy.implementationPartners.length > 0}
              isExpanded={true} // Client is always expanded
            />
          </div>

          {/* Connection Line */}
          {hierarchy.implementationPartners.length > 0 && (
            <div className="flex items-center mx-2">
              <div className="h-px w-8 bg-gray-300"></div>
            </div>
          )}

          {/* Implementation Partners */}
          <div className="flex flex-col space-y-4">
            {hierarchy.implementationPartners.map((partner) => (
              <div key={partner.id} className="flex">
                <div className="flex flex-col">
                  <NodeComponent 
                    data={partner} 
                    type="implementation_partner" 
                    hasChildren={partner.primeVendors.length > 0}
                    isExpanded={expandedPartners.includes(partner.id)}
                    onToggle={() => togglePartner(partner.id)}
                  />
                </div>

                {/* Prime Vendors (only show if expanded) */}
                {expandedPartners.includes(partner.id) && partner.primeVendors.length > 0 && (
                  <>
                    <div className="flex items-center mx-2">
                      <div className="h-px w-8 bg-gray-300"></div>
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                      {partner.primeVendors.map((vendor) => (
                        <div key={vendor.id} className="flex">
                          <div className="flex flex-col">
                            <NodeComponent 
                              data={vendor} 
                              type="prime_vendor" 
                              hasChildren={vendor.subVendors.length > 0}
                              isExpanded={expandedVendors.includes(vendor.id)}
                              onToggle={() => toggleVendor(vendor.id)}
                            />
                          </div>

                          {/* Sub Vendors (only show if expanded) */}
                          {expandedVendors.includes(vendor.id) && vendor.subVendors.length > 0 && (
                            <>
                              <div className="flex items-center mx-2">
                                <div className="h-px w-8 bg-gray-300"></div>
                              </div>
                              
                              <div className="flex flex-col space-y-4">
                                {vendor.subVendors.map((subVendor) => (
                                  <div key={subVendor.id} className="flex">
                                    <div className="flex flex-col">
                                      <NodeComponent 
                                        data={subVendor} 
                                        type="sub_vendor" 
                                        hasChildren={subVendor.recruiters.length > 0}
                                        isExpanded={expandedSubVendors.includes(subVendor.id)}
                                        onToggle={() => toggleSubVendor(subVendor.id)}
                                      />
                                    </div>

                                    {/* Recruiters (only show if expanded) */}
                                    {expandedSubVendors.includes(subVendor.id) && subVendor.recruiters.length > 0 && (
                                      <>
                                        <div className="flex items-center mx-2">
                                          <div className="h-px w-8 bg-gray-300"></div>
                                        </div>
                                        
                                        <div className="flex flex-col space-y-2">
                                          {subVendor.recruiters.map((recruiter) => (
                                            <NodeComponent 
                                              key={recruiter.id} 
                                              data={recruiter} 
                                              type="recruiter" 
                                            />
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowChart;