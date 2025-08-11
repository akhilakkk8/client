import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Building2, Users } from 'lucide-react';
import { getAllClients } from '../lib/database';
import type { Client } from '../lib/supabase';

const HomePage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getAllClients();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-8 rounded-lg">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">ClientHub</h1>
          <p className="text-xl mb-6">
            Manage your client hierarchies with implementation partners, vendors, and recruiters all in one place.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/add"
              className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Client</span>
            </Link>
            <Link
              to="/search"
              className="flex items-center space-x-2 bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              <p className="text-gray-600">Total Clients</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-teal-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {clients.length > 0 ? 'Active' : 'Ready'}
              </p>
              <p className="text-gray-600">System Status</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <Search className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">Instant</p>
              <p className="text-gray-600">Search Results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Clients */}
      {clients.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Clients</h2>
          <div className="space-y-3">
            {clients.slice(0, 5).map((client) => (
              <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900">{client.name}</h3>
                    {client.website && (
                      <p className="text-sm text-gray-500 truncate max-w-xs">{client.website}</p>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(client.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          {clients.length > 5 && (
            <div className="mt-4 text-center">
              <Link
                to="/search"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                View all clients ({clients.length})
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && clients.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-md border border-gray-200 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first client and their hierarchy.
          </p>
          <Link
            to="/add"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Your First Client</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;