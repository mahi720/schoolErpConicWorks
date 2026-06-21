import React from 'react'
import DataTable from '../../components/common/DataTable'
import { Plus } from 'lucide-react'

export default function Categories() {
  const categories = [
    { id: 1, name: 'Mathematics', description: 'Mathematics textbooks and reference books', count: 12 },
    { id: 2, name: 'English', description: 'English literature and grammar books', count: 8 },
    { id: 3, name: 'Science', description: 'Physics, Chemistry, Biology books', count: 15 },
    { id: 4, name: 'Social Studies', description: 'History, Geography, Civics books', count: 6 },
    { id: 5, name: 'Computer Science', description: 'Programming and IT books', count: 10 },
    { id: 6, name: 'Reference', description: 'Dictionaries, encyclopedias, guides', count: 20 },
  ]

  const columns = [
    { key: 'name', label: 'Category Name', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'count', label: 'Number of Books', sortable: true },
  ]

  const actions = [
    { label: 'Edit', onClick: (row) => console.log('Edit', row) },
    { label: 'Delete', variant: 'danger', onClick: (row) => console.log('Delete', row) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Book Categories</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage library book categories</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        searchFields={['name', 'description']}
        title="Categories"
        actions={actions}
      />
    </div>
  )
}
