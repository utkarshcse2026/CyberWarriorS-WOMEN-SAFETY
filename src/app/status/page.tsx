"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { storage, db } from '../../lib/firebase';
import { collection, getDocs } from "firebase/firestore";

const ComplaintProgressTracker = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const complaintStatuses = [
    { label: "Complaint Raised", progress: 0 },
    { label: "Complaint Acknowledged", progress: 33 },
    { label: "Action Under Progress", progress: 66 },
    { label: "Issue Resolved", progress: 100 },
  ];

  const fetchComplaints = async () => {
    try {
      const complaintsCollection = collection(db, "complaints");
      const complaintSnapshot = await getDocs(complaintsCollection);
      const complaintsList = complaintSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComplaints(complaintsList);
      console.log("Fetched complaints:", complaintsList); // Debug log
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to fetch complaints. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const getProgress = (status) => {
    const statusIndex = complaintStatuses.findIndex(s => s.label === status);
    return statusIndex !== -1 ? complaintStatuses[statusIndex] : complaintStatuses[0];
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Complaint Progress Tracker</h1>

      {loading ? (
        <div className="text-center">Loading complaints...</div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-semibold mb-4">All Complaints</h2>
            {complaints.length === 0 ? (
              <p>No complaints found.</p>
            ) : (
              <ul className="space-y-2">
                {complaints.map((complaint) => (
                  <li
                    key={complaint.id}
                    className="p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 transition duration-200"
                    onClick={() => handleComplaintClick(complaint)}
                  >
                    <div className="font-medium">{complaint.title}</div>
                    <div className="text-sm text-gray-600">Status: {complaint.status}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="w-full md:w-2/3">
            {selectedComplaint ? (
              <div className="border border-gray-300 rounded p-4">
                <h2 className="text-xl font-semibold mb-4">
                  Complaint Details: {selectedComplaint.title}
                </h2>
                <div className="space-y-3">
                  <p><strong>ID:</strong> {selectedComplaint.id}</p>
                  <p><strong>Description:</strong> {selectedComplaint.description}</p>
                  <p><strong>Status:</strong> {selectedComplaint.status}</p>
                  <p><strong>Date Filed:</strong> {selectedComplaint.dateFiled}</p>
                  <div className="mt-4">
                    <strong>Progress:</strong>
                    <Progress 
                      value={getProgress(selectedComplaint.status).progress} 
                      className="mt-2"
                    />
                  </div>
                </div>
                <button
                  className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                  onClick={() => setSelectedComplaint(null)}
                >
                  Close Details
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Select a complaint to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintProgressTracker;