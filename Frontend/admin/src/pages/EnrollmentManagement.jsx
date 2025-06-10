import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = 'http://localhost:5000';

const EnrollmentManagement = () => {
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]); // NEW: Store ALL requests for global stats
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Fetch enrollment requests - UPDATED to fix counter issue
  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Always fetch ALL requests for global stats
      const allResponse = await axios.get(`${baseUrl}/api/enrollment/all`);
      const allData = allResponse.data.data || [];
      setAllRequests(allData); // Store all requests for global stats
      
      // Filter data based on current filter
      let filteredData = allData;
      if (filter !== 'all') {
        filteredData = allData.filter(req => req.status === filter);
      }
      
      setRequests(filteredData);
      console.log(`📋 Fetched ${allData.length} total requests, showing ${filteredData.length} ${filter} requests`);
      
    } catch (error) {
      console.error('❌ Error fetching requests:', error);
      alert('Error fetching enrollment requests');
    } finally {
      setLoading(false);
    }
  };

  // Handle approve/reject
  const handleReview = async (requestId, status) => {
    try {
      setProcessing(true);
      
      const reviewData = {
        status: status,
        ...(status === 'rejected' && rejectionReason && { rejectionReason })
      };

      console.log(`🔍 Reviewing request ${requestId} with status: ${status}`);

      const response = await axios.put(
        `${baseUrl}/api/enrollment/${requestId}/review`,
        reviewData
      );

      if (response.data.success) {
        alert(`✅ Request ${status} successfully!`);
        setSelectedRequest(null);
        setRejectionReason('');
        fetchRequests(); // Refresh the list
      }
    } catch (error) {
      console.error('❌ Error reviewing request:', error);
      alert(`❌ Error ${status === 'approved' ? 'approving' : 'rejecting'} request`);
    } finally {
      setProcessing(false);
    }
  };
const handleSendMail = async (requestId, email, name) => {
  try {
    setProcessing(true);
    
    console.log(`🚀 ===== SENDING CREDENTIALS =====`);
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${name}`);
    console.log(`🆔 Request ID: ${requestId}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);

    const response = await axios.post(
      `${baseUrl}/api/enrollment/${requestId}/send-credentials`,
      {
        email: email,
        name: name
      }
    );

    console.log(`📤 API Response:`, response.data);

    if (response.data.success) {
      console.log(`✅ SUCCESS! Credentials sent to ${email}`);
      console.log(`🔑 Generated Password: ${response.data.data.password}`);
      console.log(`🎓 University ID: ${response.data.data.uni_id}`);
      console.log(`👨‍🎓 Role: ${response.data.data.role}`);
      console.log(`📧 Full Data:`, response.data.data);
      
      alert(`✅ Login credentials sent successfully to ${email}!\n\n` +
            `🔑 Password: ${response.data.data.password}\n` +
            `🆔 University ID: ${response.data.data.uni_id}\n` +
            `👨‍🎓 Role: ${response.data.data.role}`);
    } else {
      console.log(`❌ FAILED! Server returned:`, response.data);
      alert(`❌ Failed to send credentials: ${response.data.message}`);
    }

  } catch (error) {
    console.log(`💥 ===== ERROR DETAILS =====`);
    console.error('❌ Error sending credentials:', error);
    console.log(`📧 Email: ${email}`);
    console.log(`🕐 Time: ${new Date().toLocaleString()}`);
    
    if (error.response) {
      console.log(`🔴 Status: ${error.response.status}`);
      console.log(`📄 Response:`, error.response.data);
    } else if (error.request) {
      console.log(`🌐 Network Error:`, error.request);
    } else {
      console.log(`⚠️ Error Message:`, error.message);
    }
    
    alert(`❌ Error sending credentials to ${email}\n\nCheck browser console for details.`);
  } finally {
    setProcessing(false);
    console.log(`🏁 Process completed for ${email}`);
    console.log(`================================\n`);
  }
};
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // NEW: Calculate global stats from ALL requests
  const getGlobalStats = () => {
    return {
      pending: allRequests.filter(r => r.status === 'pending').length,
      approved: allRequests.filter(r => r.status === 'approved').length,
      rejected: allRequests.filter(r => r.status === 'rejected').length,
      total: allRequests.length
    };
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const globalStats = getGlobalStats(); // Get global stats

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📋 Enrollment Management</h1>
        <button 
          onClick={fetchRequests}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Overview - FIXED: Now shows global counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-700">⏳ Pending</h3>
          <p className="text-2xl font-bold text-yellow-800">
            {globalStats.pending}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-700">✅ Approved</h3>
          <p className="text-2xl font-bold text-green-800">
            {globalStats.approved}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-700">❌ Rejected</h3>
          <p className="text-2xl font-bold text-red-800">
            {globalStats.rejected}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-700">📊 Total</h3>
          <p className="text-2xl font-bold text-blue-800">{globalStats.total}</p>
        </div>
      </div>

      {/* Filter Buttons - ENHANCED: Shows global counts in badges */}
      <div className="flex flex-wrap gap-3">
        {['pending', 'approved', 'rejected', 'all'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              filter === filterType
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            {filterType === 'pending' && globalStats.pending > 0 && (
              <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                {globalStats.pending}
              </span>
            )}
            {filterType === 'approved' && globalStats.approved > 0 && (
              <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {globalStats.approved}
              </span>
            )}
            {filterType === 'rejected' && globalStats.rejected > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {globalStats.rejected}
              </span>
            )}
            {filterType === 'all' && globalStats.total > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {globalStats.total}
              </span>
            )}
          </button>
        ))}
      </div>


      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading enrollment requests...</p>
        </div>
      )}

      {/* Requests Grid */}
      {!loading && requests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div key={request._id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* ID Card Image */}
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={request.idCardImage}
                  alt={`${request.name}'s ID Card`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(request.idCardImage, '_blank')}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(request.status)}`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Request Details */}
              <div className="p-5">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {request.name}
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-24">ID:</span>
                    <span className="text-gray-600 font-mono">{request.registrationNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-24">Email:</span>
                    <span className="text-gray-600 truncate" title={request.email}>
                      {request.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-24">Role:</span>
                    <span className={`capitalize px-2 py-1 rounded text-xs font-medium ${
                      request.role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {request.role}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-700 w-24">Date:</span>
                    <span className="text-gray-600">{formatDate(request.submittedAt)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {request.status === 'pending' && (
                  <div className="mt-5 flex space-x-3">
                    <button
                      onClick={() => handleReview(request._id, 'approved')}
                      disabled={processing}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => setSelectedRequest(request)}
                      disabled={processing}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}

{/* Show approval info */}
{request.status === 'approved' && (
  <div className="mt-4 space-y-3">
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-sm text-green-800">
        <strong>✅ Approved</strong> {request.reviewedAt && `on ${formatDate(request.reviewedAt)}`}
      </p>
    </div>
    
    {/* Send Mail Button */}
    <button
      onClick={() => handleSendMail(request._id, request.email, request.name)}
      disabled={processing}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
    >
      📧 Send Login Credentials
    </button>
  </div>
)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No requests found */}
      {!loading && requests.length === 0 && (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">📭</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            No {filter === 'all' ? '' : filter} requests found
          </h3>
          <p className="text-gray-600 text-lg">
            {filter === 'pending' 
              ? 'All enrollment requests have been reviewed.'
              : 'No enrollment requests match your current filter.'
            }
          </p>
        </div>
      )}

      {/* Rejection Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Reject Request - {selectedRequest.name}
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Reason for rejection (optional):
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="4"
                placeholder="Enter reason for rejection..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleReview(selectedRequest._id, 'rejected')}
                disabled={processing}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {processing ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setRejectionReason('');
                }}
                disabled={processing}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentManagement;