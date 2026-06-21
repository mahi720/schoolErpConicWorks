import React from 'react'
import { useApp } from '../../context/AppContext'
import DataTable from '../../components/common/DataTable'
import { Plus } from 'lucide-react'

export default function Teachers() {
  const { teachers } = useApp()

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'qualification', label: 'Qualification', sortable: true },
  ]

  const actions = [
    { label: 'Edit', onClick: (row) => console.log('Edit', row) },
    { label: 'Delete', variant: 'danger', onClick: (row) => console.log('Delete', row) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Teachers</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage school teachers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          Add Teacher
        </button>
      </div>

      <DataTable
        columns={columns}
        data={teachers}
        searchFields={['name', 'email', 'subject']}
        title="Teachers"
        actions={actions}
      />
    </div>
  )
}
