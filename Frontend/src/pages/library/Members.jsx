import React from 'react'
import { useApp } from '../../context/AppContext'
import DataTable from '../../components/common/DataTable'
import { Plus } from 'lucide-react'

export default function Members() {
  const { students } = useApp()

  const columns = [
    { key: 'name', label: 'Member Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'class', label: 'Class', sortable: true },
    {
      key: 'status',
      label: 'Membership Status',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {value}
        </span>
      ),
    },
  ]

  const actions = [
    { label: 'View', onClick: (row) => console.log('View', row) },
    { label: 'Edit', onClick: (row) => console.log('Edit', row) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Library Members</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage library memberships</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Total Members</p>
          <p className="text-3xl font-bold text-black dark:text-white mt-2">{students.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Active Members</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{students.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Books Issued</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={students}
        searchFields={['name', 'email', 'class']}
        title="Library Members"
        actions={actions}
      />
    </div>
  )
}
