import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHistory, 
  FaLeaf, 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaEye
} from 'react-icons/fa';
import { cropAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CropHistory = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await cropAPI.getHistory(currentPage);
      const history = Array.isArray(response?.data)
        ? response.data
        : response?.data?.analyses || [];

      setAnalyses(history);
      setTotalPages(response?.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.cropType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.detectedDisease?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'healthy') return matchesSearch && analysis.detectedDisease === 'Healthy';
    if (filter === 'diseased') return matchesSearch && analysis.detectedDisease !== 'Healthy';
    
    return matchesSearch;
  });

  const getStatusColor = (disease) => {
    return disease === 'Healthy' ? 'green' : 'red';
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
          <FaHistory className="mr-4 text-primary-600" />
          Crop Analysis History
        </h1>
        <p className="text-xl text-gray-600">
          Track and review all your past crop disease analyses
        </p>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by crop type or disease..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field py-2"
            >
              <option value="all">All Analyses</option>
              <option value="healthy">Healthy Only</option>
              <option value="diseased">Diseased Only</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* History List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-xl shadow-md"
        >
          <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No analyses found</h3>
          <p className="text-gray-500">
            Start by analyzing your first crop disease
          </p>
          <Link to="/crop/detect" className="btn-primary inline-flex items-center mt-4">
            <FaLeaf className="mr-2" />
            Analyze Crop
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredAnalyses.map((analysis, index) => (
            <motion.div
              key={analysis._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-48 h-48">
                  <img
                    src={analysis.imageUrl}
                    alt={analysis.cropType}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold capitalize mb-1">
                        {analysis.cropType}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold
                      ${analysis.detectedDisease === 'Healthy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}`}
                    >
                      {analysis.detectedDisease === 'Healthy' ? (
                        <>Healthy</>
                      ) : (
                        <>
                          <FaExclamationTriangle className="mr-1" />
                          {analysis.detectedDisease}
                        </>
                      )}
                    </span>
                  </div>

                  {analysis.detectedDisease !== 'Healthy' && (
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-600 mr-2">Severity:</span>
                        <div className="flex-1 max-w-xs h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              analysis.severity === 'Low' ? 'w-1/3 bg-yellow-500' :
                              analysis.severity === 'Medium' ? 'w-2/3 bg-orange-500' :
                              'w-full bg-red-500'
                            }`}
                          />
                        </div>
                        <span className="ml-2 text-sm font-medium">{analysis.severity}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 line-clamp-2 flex-1 mr-4">
                      {analysis.recommendation?.treatment || 'No treatment data'}
                    </p>
                    <Link
                      to={`/crop/${analysis._id}`}
                      className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <FaEye className="mr-1" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CropHistory;
