import React from 'react';
import ClientForm from '../components/ClientForm';

const AddPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add Client Details</h1>
        <p className="text-gray-600 mt-2">
          Create a complete client hierarchy including implementation partners, vendors, and recruiters.
        </p>
      </div>
      <ClientForm />
    </div>
  );
};

export default AddPage;