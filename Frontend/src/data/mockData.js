export const mockData = {
  students: [
    { id: 1, name: 'Rajesh Kumar', rollNo: 101, class: '10-A', email: 'rajesh@school.com', phone: '9876543210', status: 'active', joinDate: '2023-06-15' },
    { id: 2, name: 'Priya Singh', rollNo: 102, class: '10-A', email: 'priya@school.com', phone: '9876543211', status: 'active', joinDate: '2023-06-15' },
    { id: 3, name: 'Amit Patel', rollNo: 103, class: '10-A', email: 'amit@school.com', phone: '9876543212', status: 'active', joinDate: '2023-06-15' },
    { id: 4, name: 'Ananya Sharma', rollNo: 104, class: '10-B', email: 'ananya@school.com', phone: '9876543213', status: 'active', joinDate: '2023-06-15' },
    { id: 5, name: 'Vikram Das', rollNo: 105, class: '10-B', email: 'vikram@school.com', phone: '9876543214', status: 'inactive', joinDate: '2022-06-15' },
    { id: 6, name: 'Sneha Gupta', rollNo: 106, class: '9-A', email: 'sneha@school.com', phone: '9876543215', status: 'active', joinDate: '2024-06-15' },
  ],
  teachers: [
    { id: 1, name: 'Dr. Ramesh Nair', email: 'ramesh.nair@school.com', phone: '9876543220', subject: 'Mathematics', qualification: 'B.Tech', joinDate: '2015-08-01' },
    { id: 2, name: 'Mrs. Deepa Verma', email: 'deepa.verma@school.com', phone: '9876543221', subject: 'English', qualification: 'M.A', joinDate: '2016-08-01' },
    { id: 3, name: 'Mr. Suraj Patel', email: 'suraj.patel@school.com', phone: '9876543222', subject: 'Science', qualification: 'B.Sc', joinDate: '2017-08-01' },
    { id: 4, name: 'Ms. Kavya Sharma', email: 'kavya.sharma@school.com', phone: '9876543223', subject: 'History', qualification: 'M.A', joinDate: '2018-08-01' },
  ],
  classes: [
    { id: 1, name: '10-A', section: 'A', strength: 45, classTeacher: 'Dr. Ramesh Nair' },
    // { id: 2, name: '10-B', section: 'B', strength: 48, classTeacher: 'Mrs. Deepa Verma' },
    // { id: 3, name: '9-A', section: 'A', strength: 42, classTeacher: 'Mr. Suraj Patel' },
    // { id: 4, name: '9-B', section: 'B', strength: 46, classTeacher: 'Ms. Kavya Sharma' },
    {
      id: 1,
      name: "Class 10",
      stream: "Science",
      section: "A,B",
      classTeacher: "Rahul Sir",
      timing: "08:00 - 02:00",
      status: "active"
    },

    {
      id: 2,
      name: "Class 12",
      stream: "Commerce",
      section: "A,C",
      classTeacher: "Priya Ma'am",
      timing: "09:00 - 03:00",
      status: "active"
    }
  ],
  exams: [
    { id: 1, name: 'Mid Term Exam', startDate: '2024-09-15', endDate: '2024-09-28', status: 'completed' },
    { id: 2, name: 'Pre-Board Exam', startDate: '2024-11-01', endDate: '2024-11-15', status: 'in-progress' },
    { id: 3, name: 'Final Board Exam', startDate: '2025-02-15', endDate: '2025-03-30', status: 'scheduled' },
    { id: 4, name: 'Unit Test 1', startDate: '2024-08-10', endDate: '2024-08-15', status: 'completed' },
  ],
  books: [
    { id: 1, title: 'Mathematics for Class 10', author: 'R.D. Sharma', isbn: '978-8193223456', category: 'Mathematics', status: 'available', quantity: 12 },
    { id: 2, title: 'English Literature', author: 'Beehive', isbn: '978-8193223457', category: 'English', status: 'available', quantity: 8 },
    { id: 3, title: 'Science Fundamentals', author: 'NCERT', isbn: '978-8193223458', category: 'Science', status: 'available', quantity: 15 },
    { id: 4, title: 'History of India', author: 'Bipan Chandra', isbn: '978-8193223459', category: 'History', status: 'available', quantity: 6 },
    { id: 5, title: 'Computer Science', author: 'Sumita Arora', isbn: '978-8193223460', category: 'Computer Science', status: 'available', quantity: 10 },
  ],
  attendance: [
    { id: 1, studentId: 1, date: '2024-09-20', status: 'present', remarks: '' },
    { id: 2, studentId: 2, date: '2024-09-20', status: 'present', remarks: '' },
    { id: 3, studentId: 3, date: '2024-09-20', status: 'absent', remarks: 'Medical leave' },
    { id: 4, studentId: 1, date: '2024-09-21', status: 'present', remarks: '' },
    { id: 5, studentId: 4, date: '2024-09-21', status: 'late', remarks: 'Reached 15 minutes late' },
  ],
  fees: [
    { id: 1, studentId: 1, month: 'September', amount: 5000, status: 'paid', dueDate: '2024-09-15', paidDate: '2024-09-10' },
    { id: 2, studentId: 2, month: 'September', amount: 5000, status: 'pending', dueDate: '2024-09-15', paidDate: null },
    { id: 3, studentId: 3, month: 'September', amount: 5000, status: 'paid', dueDate: '2024-09-15', paidDate: '2024-09-14' },
    { id: 4, studentId: 1, month: 'October', amount: 5000, status: 'paid', dueDate: '2024-10-15', paidDate: '2024-10-12' },
  ],
  notifications: [
    { id: 1, message: 'New assignment posted in Mathematics', type: 'info', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, message: 'Fee payment reminder for September', type: 'warning', timestamp: new Date(Date.now() - 7200000) },
    { id: 3, message: 'Mid-term exam results declared', type: 'success', timestamp: new Date(Date.now() - 86400000) },
  ],
  sessions: [
    { id: 1, name: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31', status: 'active' },
    { id: 2, name: '2023-2024', startDate: '2023-04-01', endDate: '2024-03-31', status: 'closed' },
  ],
  subjects: [
    { id: 1, name: 'Mathematics', code: 'MATH', class: '10-A' },
    { id: 2, name: 'English', code: 'ENG', class: '10-A' },
    { id: 3, name: 'Science', code: 'SCI', class: '10-A' },
    { id: 4, name: 'Social Studies', code: 'SS', class: '10-A' },
  ],
}
