import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { searchClients, getClientHierarchy } from '../lib/database';
import type { Client, ClientHierarchy } from '../lib/supabase';
import FlowChart from './FlowChart';
import DetailModal from './DetailModal';

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientHierarchy | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [modalType, setModalType] = useState<string>('');

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length > 0) {
        try {
          const results = await searchClients(searchTerm);
          setSearchResults(results);
          setShowDropdown(true);
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleClientSelect = async (client: Client) => {
    setLoading(true);
    setShowDropdown(false);
    setSearchTerm(client.name);

    try {
      const hierarchy = await getClientHierarchy(client.id);
      setSelectedClient(hierarchy);
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (data: any, type: string) => {
    setModalData(data);
    setModalType(type);
  };

  const closeModal = () => {
    setModalData(null);
    setModalType('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Clients</h1>
        
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for clients (e.g., Walmart)..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {showDropdown && (
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleClientSelect(client)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{client.name}</div>
                  {client.website && (
                    <div className="text-sm text-gray-500 truncate">{client.website}</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {showDropdown && searchResults.length === 0 && searchTerm.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
              <div className="text-gray-500 text-center">No clients found matching "{searchTerm}"</div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading hierarchy...</span>
        </div>
      )}

      {/* Flow Chart */}
      {selectedClient && !loading && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {selectedClient.client.name} - Organization Hierarchy
          </h2>
          <FlowChart hierarchy={selectedClient} onNodeClick={handleNodeClick} />
        </div>
      )}

      {/* Detail Modal */}
      {modalData && (
        <DetailModal
          data={modalData}
          type={modalType}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SearchPage;