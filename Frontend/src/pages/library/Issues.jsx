import React from 'react'
import DataTable from '../../components/common/DataTable'
import { Plus } from 'lucide-react'

export default function Issues() {
  const issues = [
    { id: 1, studentName: 'Rajesh Kumar', bookTitle: 'Mathematics for Class 10', issueDate: '2024-09-15', dueDate: '2024-10-15', status: 'issued' },
    { id: 2, studentName: 'Priya Singh', bookTitle: 'English Literature', issueDate: '2024-09-10', dueDate: '2024-10-10', status: 'returned' },
    { id: 3, studentName: 'Amit Patel', bookTitle: 'Science Fundamentals', issueDate: '2024-09-12', dueDate: '2024-10-12', status: 'issued' },
    { id: 4, studentName: 'Ananya Sharma', bookTitle: 'History of India', issueDate: '2024-09-08', dueDate: '2024-10-08', status: 'overdue' },
  ]

  const columns = [
    { key: 'studentName', label: 'Student Name', sortable: true },
    { key: 'bookTitle', label: 'Book Title', sortable: true },
    { key: 'issueDate', label: 'Issue Date', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'issued' ? 'bg-blue-100 text-blue-700' :
          value === 'returned' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }`}>
          {value}
        </span>
      ),
    },
  ]

  const actions = [
    { label: 'Return', onClick: (row) => console.log('Return', row) },
    { label: 'Renew', onClick: (row) => console.log('Renew', row) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Book Issues</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage book issuance and returns</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          Issue Book
        </button>
      </div>

      <DataTable
        columns={columns}
        data={issues}
        searchFields={['studentName', 'bookTitle']}
        title="Book Issues & Returns"
        actions={actions}
      />
    </div>
  )
}
