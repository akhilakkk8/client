import React from 'react';
import { X, ExternalLink, Linkedin } from 'lucide-react';

interface DetailModalProps {
  data: any;
  type: string;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ data, type, onClose }) => {
  const getTitle = (type: string) => {
    switch (type) {
      case 'client': return 'Client Details';
      case 'implementation_partner': return 'Implementation Partner Details';
      case 'prime_vendor': return 'Prime Vendor Details';
      case 'sub_vendor': return 'Sub Vendor Details';
      case 'recruiter': return 'Recruiter Details';
      default: return 'Details';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{getTitle(type)}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-gray-900">{data.name}</p>
          </div>

          {data.website && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <a
                href={data.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="truncate">{data.website}</span>
              </a>
            </div>
          )}

          {data.linkedin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span className="truncate">{data.linkedin}</span>
              </a>
            </div>
          )}

          {data.created_at && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
              <p className="text-gray-600">
                {new Date(data.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;