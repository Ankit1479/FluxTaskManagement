import React, { useState } from 'react';
import { Task } from '../types/Task';
import { Clock, User, AlertTriangle, CheckCircle2, MessageSquare, Edit3 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onAddRemarks: (taskId: string, remarks: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onAddRemarks }) => {
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarks, setRemarks] = useState(task.remarks || '');

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
    }
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    onStatusChange(task.id, newStatus);
    if (newStatus === 'completed') {
      setShowRemarksModal(true);
    }
  };

  const handleSubmitRemarks = () => {
    onAddRemarks(task.id, remarks);
    setShowRemarksModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>{task.assignedTo}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{task.createdAt.toLocaleDateString('en-GB')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
              className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(task.status)}`}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {task.status === 'completed' && (
            <button
              onClick={() => setShowRemarksModal(true)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
            >
              <MessageSquare size={16} />
              {task.remarks ? 'View Remarks' : 'Add Remarks'}
            </button>
          )}
        </div>

        {task.remarks && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Completion Remarks:</strong> {task.remarks}
            </p>
          </div>
        )}
      </div>

      {/* Remarks Modal */}
      {showRemarksModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Task Completion Remarks</h3>
            <p className="text-sm text-gray-600 mb-4">Add remarks about how this task was completed:</p>
            
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Describe how the task was completed, any challenges faced, or additional notes..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmitRemarks}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Remarks
              </button>
              <button
                onClick={() => setShowRemarksModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
