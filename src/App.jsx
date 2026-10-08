import { useMemo, useEffect, useState } from 'react'
import { BrowserRouter, Link, NavLink, Routes, Route, useParams } from 'react-router-dom'
import {
  Alert,
  AppBar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import {
  Add,
  Assessment,
  Book,
  Category,
  Dashboard,
  Delete,
  Edit,
  Group,
  LibraryBooks,
  Menu,
  People,
  ReportProblem,
  Search,
  TrendingUp,
  Warning,
  CheckCircle,
  AccessTime,
  LocalLibrary,
  AssignmentReturn,
  Inventory2,
} from '@mui/icons-material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const STORAGE_KEY = 'school-library-management-v1'

const menuItems = [
  { label: 'Dashboard', path: '/', icon: <Dashboard /> },
  { label: 'Books', path: '/books', icon: <Book /> },
  { label: 'Categories', path: '/categories', icon: <Category /> },
  { label: 'Students', path: '/students', icon: <People /> },
  { label: 'Borrowed Books', path: '/borrowed-books', icon: <LibraryBooks /> },
  { label: 'Returned Books', path: '/returned-books', icon: <AssignmentReturn /> },
  { label: 'Reports', path: '/reports', icon: <Assessment /> },
]

const categoryNames = [
  'Mathematics',
  'Science',
  'Technology',
  'Literature',
  'History',
  'Geography',
  'Languages',
  'Business',
  'Fiction',
  'Reference',
]

const studentNames = [
  'Alicia Morgan', 'Daniel Reed', 'Maya Patel', 'Noah Brooks', 'Sophie Lewis', 'Kevin Nguyen', 'Elena Ross', 'Isaac Davis', 'Grace Turner', 'Ryan Foster',
  'Olivia White', 'James Hall', 'Emma Carter', 'Liam Price', 'Aria Young', 'Benjamin Hill', 'Chloe Allen', 'Ethan Scott', 'Scarlett Adams', 'Lucas King',
  'Harper Baker', 'Mason Green', 'Grace Nelson', 'Henry Torres', 'Layla Rivera', 'Jacob Flores', 'Nora Murphy', 'Jack Mitchell', 'Zoe Wright', 'Gabriel Ward',
]

const titles = [
  'Algebra Essentials', 'Modern Biology', 'Digital Systems', 'Poetry Anthology', 'World Civilizations', 'Earth Science', 'English Grammar', 'Business Fundamentals', 'Mystery Stories', 'Research Handbook',
  'Calculus Workbook', 'Chemistry Lab Guide', 'Web Development Basics', 'Shakespeare Collection', 'African History', 'Climate Studies', 'Spanish for Beginners', 'Marketing Principles', 'Adventure Fiction', 'Library Reference Manual',
  'Geometry Practice', 'Physics Fundamentals', 'AI Concepts', 'Literary Criticism', 'Ancient Cultures', 'Maps and Regions', 'French Vocabulary', 'Accounting Essentials', 'Science Fiction', 'Study Skills Guide',
  'Statistics for Teens', 'Botany Notes', 'Robotics Design', 'Modern Poetry', 'The Industrial Age', 'Global Geography', 'German Basics', 'Financial Literacy', 'Short Stories', 'Academic Research',
]

const authors = ['Sarah Johnson', 'Michael Bell', 'Emily Chen', 'David King', 'Ava Parker', 'Peter Hill', 'Nina Ross', 'Oliver Smith', 'Hannah Young', 'Leo Moore']
const publishers = ['North School Press', 'Global Learning House', 'Vision Education', 'Academic Books Ltd', 'School Heritage Press']

const pad = (value) => String(value).padStart(2, '0')
const toIsoDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const addDays = (baseDate, days) => {
  const next = new Date(baseDate)
  next.setDate(next.getDate() + days)
  return next
}
const diffInDays = (start, end) => Math.ceil((end - start) / (1000 * 60 * 60 * 24))

const getBookStatus = (book) => {
  if (book.availableCopies === 0) return 'Borrowed Out'
  if (book.availableCopies < Math.ceil(book.totalCopies / 3)) return 'Low Stock'
  return 'Available'
}

const getBorrowStatus = (borrow) => {
  const today = new Date()
  const due = new Date(borrow.dueDate)
  const daysLeft = diffInDays(today, due)

  if (today > due) return 'Overdue'
  if (daysLeft <= 3) return 'Due Soon'
  return 'Borrowed'
}

const buildInitialData = () => {
  const categories = categoryNames.map((name, index) => ({
    id: `CAT-${index + 1}`,
    name,
    description: `${name} resources for learners and readers.`,
    status: 'Active',
  }))

  const books = titles.map((title, index) => {
    const category = categories[index % categories.length]
    const totalCopies = 4 + (index % 4)
    const availableCopies = Math.max(1, totalCopies - (index % 3 === 0 ? 2 : 1))

    return {
      id: `BK-${index + 1}`,
      isbn: `978-${1000 + index}-${(index * 13) % 10000}`,
      title,
      author: authors[index % authors.length],
      category: category.name,
      publisher: publishers[index % publishers.length],
      publicationYear: 2014 + (index % 11),
      totalCopies,
      availableCopies,
      shelf: `A-${(index % 8) + 1}-${(index % 6) + 1}`,
      description: `${title} focuses on practical learning and classroom application for school students.`,
      createdAt: toIsoDate(addDays(new Date(), -(index + 2))),
    }
  })

  const studentLevels = ['L6', 'L7', 'L8', 'L9']

  const students = studentNames.map((name, index) => ({
    id: `ST-${index + 1}`,
    registrationNumber: `${2023 + (index % 3)}RP${String(34891 + index * 137).padStart(5, '0')}`,
    fullName: name,
    className: studentLevels[index % studentLevels.length],
    gender: index % 2 === 0 ? 'Female' : 'Male',
    phone: `+250 7${String((index + 8) % 10)}${String((index * 17 + 11) % 10)}${String((index * 23 + 5) % 10)}${String((index * 31 + 7) % 10)}${String((index * 41 + 3) % 10)}${String((index * 47 + 9) % 10)}${String((index * 53 + 2) % 10)}`,
    email: name.toLowerCase().replace(/\s+/g, '.') + '@students.school.rw',
    status: 'Active',
  }))

  const borrowings = Array.from({ length: 20 }, (_, index) => {
    const book = books[index % books.length]
    const student = students[index % students.length]
    const borrowDate = addDays(new Date(), -(index + 5))
    const dueDate = addDays(borrowDate, 10 + (index % 6))
    const overdueAdjusted = index % 5 === 0 ? addDays(new Date(), -(2 + (index % 4))) : dueDate

    return {
      id: `BR-${index + 1}`,
      bookId: book.id,
      studentId: student.id,
      borrowDate: toIsoDate(borrowDate),
      dueDate: toIsoDate(overdueAdjusted),
      status: 'Borrowed',
    }
  })

  borrowings.forEach((record, index) => {
    if (index % 5 === 0) {
      record.dueDate = toIsoDate(addDays(new Date(), -(2 + (index % 4))))
    }
  })

  const booksWithBorrowedCopies = books.map((book) => ({
    ...book,
    availableCopies: Math.max(0, book.totalCopies - borrowings.filter((record) => record.bookId === book.id).length),
  }))

  const returnedRecords = Array.from({ length: 15 }, (_, index) => {
    const borrow = borrowings[(index + 3) % borrowings.length]
    const book = booksWithBorrowedCopies.find((item) => item.id === borrow.bookId)
    const student = students.find((item) => item.id === borrow.studentId)
    const borrowDate = new Date(borrow.borrowDate)
    const dueDate = new Date(borrow.dueDate)
    const returnDate = addDays(dueDate, index % 4 === 0 ? 3 : 1)

    const lateDays = Math.max(0, diffInDays(dueDate, returnDate))

    return {
      id: `RT-${index + 1}`,
      borrowId: borrow.id,
      bookId: borrow.bookId,
      studentId: borrow.studentId,
      bookTitle: book.title,
      studentName: student.fullName,
      borrowDate: borrow.borrowDate,
      dueDate: borrow.dueDate,
      returnDate: toIsoDate(returnDate),
      daysBorrowed: diffInDays(borrowDate, returnDate),
      lateDays,
      status: lateDays > 0 ? 'Late' : 'On Time',
    }
  })

  return { categories, books: booksWithBorrowedCopies, students, borrowings, returnedRecords }
}

const loadStorageState = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    const initial = buildInitialData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }

  try {
    return JSON.parse(saved)
  } catch {
    const initial = buildInitialData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
}

function StatCard({ title, value, icon, tone = 'primary', detail }) {
  return (
    <Card className="summary-card" elevation={0}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" className="stat-label">{title}</Typography>
            <Typography className="stat-value">{value}</Typography>
            <Typography className="stat-delta">{detail}</Typography>
          </Box>
          <Box sx={{ bgcolor: `${tone}.light`, color: `${tone}.main`, borderRadius: '12px', p: 1.2 }}>
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

function StatusChip({ label, color = 'default' }) {
  const palette = {
    success: { color: 'success', bg: 'rgba(34,197,94,0.12)' },
    warning: { color: 'warning', bg: 'rgba(245,158,11,0.12)' },
    error: { color: 'error', bg: 'rgba(239,68,68,0.12)' },
    info: { color: 'info', bg: 'rgba(59,130,246,0.12)' },
    default: { color: 'default', bg: 'rgba(100,116,139,0.12)' },
  }

  const tone = palette[color] || palette.default

  return (
    <Chip
      label={label}
      size="small"
      className="status-chip"
      sx={{ bgcolor: tone.bg, color: tone.color === 'default' ? '#475569' : undefined }}
      color={tone.color}
    />
  )
}

function DashboardPage({ data }) {
  const books = data.books || []
  const students = data.students || []
  const categories = data.categories || []
  const borrowings = data.borrowings || []
  const returnedRecords = data.returnedRecords || []

  const summary = useMemo(() => {
    const totalBooks = books.length
    const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0)
    const borrowedBooks = borrowings.length
    const overdueBooks = borrowings.filter((record) => getBorrowStatus(record) === 'Overdue').length
    const totalStudents = students.length
    const totalCategories = categories.length
    const totalReturned = returnedRecords.length
    const booksBorrowedToday = borrowings.filter((record) => record.borrowDate === toIsoDate(new Date())).length

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      overdueBooks,
      totalStudents,
      totalCategories,
      totalReturned,
      booksBorrowedToday,
    }
  }, [books, students, categories, borrowings, returnedRecords])

  const recentBooks = [...books].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
  const recentBorrowings = [...borrowings].slice(-4).reverse()
  const recentReturns = [...returnedRecords].slice(-4).reverse()
  const mostBorrowed = [...books].sort((a, b) => b.availableCopies - a.availableCopies).slice(0, 5)

  const categoryChartData = categories.map((category) => ({
    name: category.name,
    count: books.filter((book) => book.category === category.name).length,
  }))

  const monthlyBorrowingData = Array.from({ length: 6 }, (_, index) => {
    const month = new Date()
    month.setMonth(month.getMonth() - (5 - index))
    const key = month.toLocaleString('en-US', { month: 'short' })
    const total = borrowings.filter((record) => {
      const date = new Date(record.borrowDate)
      return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear()
    }).length

    return { name: key, borrowCount: total }
  })

  const availabilityData = [
    { name: 'Available', value: summary.availableBooks },
    { name: 'Borrowed', value: summary.borrowedBooks },
  ]

  const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']

  return (
    <Box>
      <Box className="page-header">
        <Box>
          <Typography variant="h4" className="page-title">Library Dashboard</Typography>
          <Typography className="page-subtitle">Overview of books, students, borrowing activity, and overdue items.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} color="primary">Quick Action</Button>
      </Box>

      <Grid container spacing={2} className="summary-grid">
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Books" value={summary.totalBooks} icon={<Book />} tone="primary" detail="Across all shelves" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Available Books" value={summary.availableBooks} icon={<Inventory2 />} tone="success" detail="Ready to issue" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Borrowed Books" value={summary.borrowedBooks} icon={<LibraryBooks />} tone="warning" detail="Current loans" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Overdue Books" value={summary.overdueBooks} icon={<Warning />} tone="error" detail="Needs follow-up" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Students" value={summary.totalStudents} icon={<Group />} tone="info" detail="Registered learners" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Categories" value={summary.totalCategories} icon={<Category />} tone="secondary" detail="Active sections" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Books Returned" value={summary.totalReturned} icon={<AssignmentReturn />} tone="success" detail="Completed returns" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Borrowed Today" value={summary.booksBorrowedToday} icon={<AccessTime />} tone="warning" detail="Last 24 hours" /></Grid>
      </Grid>

      <Box className="chart-grid" mt={2}>
        <Card className="chart-card" elevation={0}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Books by Category</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="chart-card" elevation={0}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Borrowing Activity</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyBorrowingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="borrowCount" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="chart-card" elevation={0}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Book Availability</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={availabilityData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={88} paddingAngle={3}>
                  {availabilityData.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recently Added Books</Typography>
              <Box className="recent-list">
                {recentBooks.map((book) => (
                  <Box key={book.id} className="recent-item">
                    <Box>
                      <Typography fontWeight={600}>{book.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{book.author}</Typography>
                    </Box>
                    <Chip size="small" label={book.category} color="primary" variant="outlined" />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recently Borrowed Books</Typography>
              <Box className="recent-list">
                {recentBorrowings.map((borrow) => {
                  const student = students.find((entry) => entry.id === borrow.studentId)
                  const book = books.find((entry) => entry.id === borrow.bookId)
                  return (
                    <Box key={borrow.id} className="recent-item">
                      <Box>
                        <Typography fontWeight={600}>{book?.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{student?.fullName}</Typography>
                      </Box>
                      <StatusChip label={getBorrowStatus(borrow)} color={getBorrowStatus(borrow) === 'Overdue' ? 'error' : 'info'} />
                    </Box>
                  )
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recently Returned Books</Typography>
              <Box className="recent-list">
                {recentReturns.map((record) => (
                  <Box key={record.id} className="recent-item">
                    <Box>
                      <Typography fontWeight={600}>{record.bookTitle}</Typography>
                      <Typography variant="body2" color="text.secondary">{record.studentName}</Typography>
                    </Box>
                    <StatusChip label={record.status} color={record.status === 'Late' ? 'warning' : 'success'} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Most Borrowed Books</Typography>
              <Box className="recent-list">
                {mostBorrowed.map((book) => (
                  <Box key={book.id} className="recent-item">
                    <Box>
                      <Typography fontWeight={600}>{book.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{book.author}</Typography>
                    </Box>
                    <Chip size="small" label={`${book.availableCopies} left`} color="secondary" />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

function BookForm({ initialValues, onSubmit, onCancel, submitLabel, isSubmitting, categories }) {
  const [formData, setFormData] = useState(initialValues)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData(initialValues)
    setErrors({})
  }, [initialValues])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!formData.isbn.trim()) nextErrors.isbn = 'ISBN is required.'
    if (!formData.title.trim()) nextErrors.title = 'Title is required.'
    if (!formData.author.trim()) nextErrors.author = 'Author is required.'
    if (!formData.category.trim()) nextErrors.category = 'Category is required.'
    if (!formData.publisher.trim()) nextErrors.publisher = 'Publisher is required.'
    if (!formData.publicationYear || Number(formData.publicationYear) < 1900) nextErrors.publicationYear = 'Enter a valid publication year.'
    if (!formData.totalCopies || Number(formData.totalCopies) <= 0) nextErrors.totalCopies = 'Copies must be a positive number.'
    if (!formData.shelf.trim()) nextErrors.shelf = 'Shelf location is required.'
    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({
      ...formData,
      totalCopies: Number(formData.totalCopies),
      publicationYear: Number(formData.publicationYear),
    })
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <Box className="form-grid">
        <TextField label="ISBN" name="isbn" value={formData.isbn} onChange={handleChange} error={Boolean(errors.isbn)} helperText={errors.isbn} required />
        <TextField label="Book Title" name="title" value={formData.title} onChange={handleChange} error={Boolean(errors.title)} helperText={errors.title} required />
        <TextField label="Author" name="author" value={formData.author} onChange={handleChange} error={Boolean(errors.author)} helperText={errors.author} required />
        <FormControl>
          <InputLabel id="book-category-label">Category</InputLabel>
          <Select
            labelId="book-category-label"
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={Boolean(errors.category)}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Publisher" name="publisher" value={formData.publisher} onChange={handleChange} error={Boolean(errors.publisher)} helperText={errors.publisher} required />
        <TextField label="Publication Year" name="publicationYear" type="number" value={formData.publicationYear} onChange={handleChange} error={Boolean(errors.publicationYear)} helperText={errors.publicationYear} required />
        <TextField label="Number of Copies" name="totalCopies" type="number" value={formData.totalCopies} onChange={handleChange} error={Boolean(errors.totalCopies)} helperText={errors.totalCopies} required />
        <TextField label="Shelf / Location" name="shelf" value={formData.shelf} onChange={handleChange} error={Boolean(errors.shelf)} helperText={errors.shelf} required />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={4} sx={{ gridColumn: '1 / -1' }} />
      </Box>

      <DialogActions>
        <Button onClick={onCancel} color="inherit">Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={16} /> : submitLabel}</Button>
      </DialogActions>
    </Box>
  )
}

function BooksPage({ data, setData }) {
  const categories = data.categories || []
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('title')
  const [bookModalOpen, setBookModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const filteredBooks = useMemo(() => {
    const value = search.trim().toLowerCase()
    const list = [...(data.books || [])].filter((book) => {
      const matchesSearch = !value || [book.title, book.author, book.isbn, book.category].some((field) => String(field).toLowerCase().includes(value))
      const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter
      const status = getBookStatus(book)
      const matchesStatus = statusFilter === 'All' || status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })

    list.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'author') return a.author.localeCompare(b.author)
      if (sortBy === 'publicationYear') return Number(b.publicationYear) - Number(a.publicationYear)
      return a.title.localeCompare(b.title)
    })

    return list
  }, [data.books, search, categoryFilter, statusFilter, sortBy])

  const openCreateDialog = () => {
    setSelectedBook({
      isbn: '',
      title: '',
      author: '',
      category: categories[0]?.name || '',
      publisher: '',
      publicationYear: new Date().getFullYear(),
      totalCopies: 1,
      availableCopies: 1,
      shelf: '',
      description: '',
    })
    setBookModalOpen(true)
  }

  const openEditDialog = (book) => {
    setSelectedBook({ ...book })
    setBookModalOpen(true)
  }

  const handleSaveBook = (payload) => {
    setIsSubmitting(true)
    setTimeout(() => {
      const nextBooks = [...(data.books || [])]
      if (selectedBook && selectedBook.id) {
        const index = nextBooks.findIndex((book) => book.id === selectedBook.id)
        nextBooks[index] = { ...nextBooks[index], ...payload, availableCopies: Math.max(0, payload.totalCopies) }
      } else {
        const newBook = {
          id: `BK-${Date.now()}`,
          ...payload,
          availableCopies: payload.totalCopies,
          createdAt: toIsoDate(new Date()),
        }
        nextBooks.push(newBook)
      }

      setData((prev) => ({ ...prev, books: nextBooks }))
      setBookModalOpen(false)
      setSelectedBook(null)
      setSnackbar({ open: true, message: selectedBook && selectedBook.id ? 'Book updated successfully.' : 'Book added successfully.', severity: 'success' })
      setIsSubmitting(false)
    }, 250)
  }

  const handleDeleteBook = (bookId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?')
    if (!confirmDelete) return

    setData((prev) => ({
      ...prev,
      books: prev.books.filter((book) => book.id !== bookId),
    }))
    setSnackbar({ open: true, message: 'Book deleted.', severity: 'info' })
  }

  return (
    <Box>
      <Box className="page-header">
        <Box>
          <Typography variant="h4" className="page-title">Books</Typography>
          <Typography className="page-subtitle">Manage the school library inventory and issue records.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={openCreateDialog}>Add Book</Button>
      </Box>

      <Box className="filter-toolbar">
        <TextField size="small" label="Search books" value={search} onChange={(event) => setSearch(event.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} /> }} />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select value={categoryFilter} label="Category" onChange={(event) => setCategoryFilter(event.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(event) => setStatusFilter(event.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Low Stock">Low Stock</MenuItem>
            <MenuItem value="Borrowed Out">Borrowed Out</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} label="Sort by" onChange={(event) => setSortBy(event.target.value)}>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="publicationYear">Publication Year</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => { setSearch(''); setCategoryFilter('All'); setStatusFilter('All'); setSortBy('title') }}>Clear Filters</Button>
      </Box>

      <Box className="table-container">
        <Table className="data-table">
          <TableHead>
            <TableRow>
              <TableCell>Book ID</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.length ? filteredBooks.map((book) => (
              <TableRow key={book.id} hover>
                <TableCell>{book.id}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>
                  <Link to={`/books/${book.id}`} style={{ color: '#0f172a', fontWeight: 600 }}>{book.title}</Link>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.publicationYear}</TableCell>
                <TableCell>{book.totalCopies}</TableCell>
                <TableCell>{book.availableCopies}</TableCell>
                <TableCell><StatusChip label={getBookStatus(book)} color={getBookStatus(book) === 'Borrowed Out' ? 'error' : getBookStatus(book) === 'Low Stock' ? 'warning' : 'success'} /></TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" color="primary" onClick={() => openEditDialog(book)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteBook(book.id)}><Delete fontSize="small" /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={11}><Box className="empty-state">No books match the current filters.</Box></TableCell></TableRow>}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={bookModalOpen} onClose={() => setBookModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedBook && selectedBook.id ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        <DialogContent>
          <BookForm
            initialValues={selectedBook || {
              isbn: '',
              title: '',
              author: '',
              category: categories[0]?.name || '',
              publisher: '',
              publicationYear: new Date().getFullYear(),
              totalCopies: 1,
              availableCopies: 1,
              shelf: '',
              description: '',
            }}
            categories={categories}
            onSubmit={handleSaveBook}
            onCancel={() => setBookModalOpen(false)}
            submitLabel={selectedBook && selectedBook.id ? 'Save Changes' : 'Add Book'}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}

function CategoriesPage({ data, setData }) {
  const categories = data.categories || []
  const books = data.books || []
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const visibleCategories = useMemo(() => {
    const value = search.trim().toLowerCase()
    return categories.filter((category) => !value || category.name.toLowerCase().includes(value) || category.description.toLowerCase().includes(value))
  }, [categories, search])

  const handleSave = () => {
    if (!selectedCategory || !selectedCategory.name.trim()) return

    setData((prev) => {
      const nextCategories = [...prev.categories]
      if (selectedCategory.id) {
        const index = nextCategories.findIndex((category) => category.id === selectedCategory.id)
        nextCategories[index] = { ...nextCategories[index], ...selectedCategory }
      } else {
        nextCategories.push({ id: `CAT-${Date.now()}`, ...selectedCategory, status: 'Active' })
      }
      return { ...prev, categories: nextCategories }
    })
    setFormOpen(false)
    setSelectedCategory(null)
  }

  const handleDelete = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return
    const hasBooks = books.some((book) => book.category === category.name)
    if (hasBooks) {
      window.alert('This category still has books assigned. Move or remove those books first.')
      return
    }

    setData((prev) => ({ ...prev, categories: prev.categories.filter((entry) => entry.id !== categoryId) }))
  }

  return (
    <Box>
      <Box className="page-header">
        <Box>
          <Typography variant="h4" className="page-title">Categories</Typography>
          <Typography className="page-subtitle">Organize library collections by subject and learning domain.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setSelectedCategory({ name: '', description: '' }); setFormOpen(true) }}>Add Category</Button>
      </Box>

      <Box className="filter-toolbar">
        <TextField size="small" label="Search categories" value={search} onChange={(event) => setSearch(event.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} /> }} />
      </Box>

      <Box className="table-container">
        <Table className="data-table">
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Number of Books</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleCategories.map((category) => (
              <TableRow key={category.id} hover>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{books.filter((book) => book.category === category.name).length}</TableCell>
                <TableCell><StatusChip label={category.status || 'Active'} color="success" /></TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" color="primary" onClick={() => { setSelectedCategory(category); setFormOpen(true) }}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(category.id)}><Delete fontSize="small" /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedCategory && selectedCategory.id ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField label="Category name" value={selectedCategory?.name || ''} onChange={(event) => setSelectedCategory((prev) => ({ ...prev, name: event.target.value }))} />
          <TextField label="Description" value={selectedCategory?.description || ''} onChange={(event) => setSelectedCategory((prev) => ({ ...prev, description: event.target.value }))} multiline rows={4} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{selectedCategory && selectedCategory.id ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function StudentsPage({ data, setData }) {
  const students = data.students || []
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const visibleStudents = useMemo(() => {
    const value = search.trim().toLowerCase()
    return students.filter((student) => {
      const matchesSearch = !value || `${student.fullName} ${student.registrationNumber} ${student.email}`.toLowerCase().includes(value)
      const matchesClass = classFilter === 'All' || student.className === classFilter
      return matchesSearch && matchesClass
    })
  }, [students, search, classFilter])

  const classes = [...new Set(students.map((student) => student.className))]

  const handleSave = () => {
    if (!selectedStudent || !selectedStudent.fullName.trim() || !selectedStudent.registrationNumber.trim()) return

    setData((prev) => {
      const nextStudents = [...prev.students]
      if (selectedStudent.id) {
        const index = nextStudents.findIndex((student) => student.id === selectedStudent.id)
        nextStudents[index] = { ...nextStudents[index], ...selectedStudent }
      } else {
        nextStudents.push({ id: `ST-${Date.now()}`, status: 'Active', ...selectedStudent })
      }
      return { ...prev, students: nextStudents }
    })
    setFormOpen(false)
    setSelectedStudent(null)
  }

  const handleDelete = (studentId) => {
    setData((prev) => ({ ...prev, students: prev.students.filter((student) => student.id !== studentId) }))
  }

  return (
    <Box>
      <Box className="page-header">
        <Box>
          <Typography variant="h4" className="page-title">Students</Typography>
          <Typography className="page-subtitle">Track learners, registrations, and active borrowing activity by level.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setSelectedStudent({ registrationNumber: '', fullName: '', className: 'L7', gender: 'Female', phone: '', email: '', status: 'Active' }); setFormOpen(true) }}>Add Student</Button>
      </Box>

      <Box className="filter-toolbar">
        <TextField size="small" label="Search students" value={search} onChange={(event) => setSearch(event.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} /> }} />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Level</InputLabel>
          <Select value={classFilter} label="Level" onChange={(event) => setClassFilter(event.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {classes.map((className) => <MenuItem key={className} value={className}>{className}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Box className="table-container">
        <Table className="data-table">
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Registration</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Phone / Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleStudents.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.registrationNumber}</TableCell>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>{student.className}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.phone}<br />{student.email}</TableCell>
                <TableCell><StatusChip label={student.status || 'Active'} color="success" /></TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" color="primary" onClick={() => { setSelectedStudent(student); setFormOpen(true) }}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(student.id)}><Delete fontSize="small" /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedStudent && selectedStudent.id ? 'Edit Student' : 'Add Student'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField label="Registration Number" value={selectedStudent?.registrationNumber || ''} onChange={(event) => setSelectedStudent((prev) => ({ ...prev, registrationNumber: event.target.value }))} />
          <TextField label="Full Name" value={selectedStudent?.fullName || ''} onChange={(event) => setSelectedStudent((prev) => ({ ...prev, fullName: event.target.value }))} />
          <TextField label="Level" value={selectedStudent?.className || ''} onChange={(event) => setSelectedStudent((prev) => ({ ...prev, className: event.target.value }))} />
          <TextField label="Gender" value={selectedStudent?.gender || ''} onChange={(event) => setSelectedStudent((prev) => ({ ...prev, gender: event.target.value }))} />
          <TextField label="Phone" value={selectedStudent?.phone || ''} onChange={(event) => setSelectedStudent((prev) => ({ ...prev, phone: event.target.value }))} />
          <TextField label="Email" type="email" value={selectedStudent?.email || ''} onChange={(event) => setSelectedStudent((prev) => ({ ...prev, email: event.target.value }))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function BorrowedBooksPage({ data, setData }) {
  const [showOnlyOverdue, setShowOnlyOverdue] = useState(false)
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false)
  const [selectedBorrow, setSelectedBorrow] = useState({ bookId: '', studentId: '', borrowDate: toIsoDate(new Date()), dueDate: toIsoDate(addDays(new Date(), 14)) })

  const borrowings = data.borrowings || []
  const students = data.students || []
  const books = data.books || []

  const visibleBorrowings = borrowings.filter((record) => {
    const overdue = getBorrowStatus(record) === 'Overdue'
    return !showOnlyOverdue || overdue
  })

  const handleBorrow = () => {
    if (!selectedBorrow.bookId || !selectedBorrow.studentId) return
    const selectedBook = books.find((book) => book.id === selectedBorrow.bookId)
    const selectedStudent = students.find((student) => student.id === selectedBorrow.studentId)

    if (!selectedBook || !selectedStudent) return
    if (selectedBook.availableCopies <= 0) {
      window.alert('No copies available for this book. Please choose another title.')
      return
    }

    setData((prev) => {
      const updatedBooks = prev.books.map((book) => {
        if (book.id === selectedBook.id) {
          return { ...book, availableCopies: Math.max(0, book.availableCopies - 1) }
        }
        return book
      })
      const nextBorrowing = {
        id: `BR-${Date.now()}`,
        bookId: selectedBook.id,
        studentId: selectedStudent.id,
        borrowDate: selectedBorrow.borrowDate,
        dueDate: selectedBorrow.dueDate,
        status: 'Borrowed',
      }
      return { ...prev, books: updatedBooks, borrowings: [...prev.borrowings, nextBorrowing] }
    })
    setBorrowDialogOpen(false)
    setSelectedBorrow({ bookId: '', studentId: '', borrowDate: toIsoDate(new Date()), dueDate: toIsoDate(addDays(new Date(), 14)) })
  }

  const handleReturnBook = (borrowId) => {
    const borrowRecord = data.borrowings.find((record) => record.id === borrowId)
    if (!borrowRecord) return
    const confirm = window.confirm('Confirm that this borrowed book has been returned?')
    if (!confirm) return

    const book = data.books.find((entry) => entry.id === borrowRecord.bookId)
    const student = data.students.find((entry) => entry.id === borrowRecord.studentId)
    const returnDate = new Date()
    const dueDate = new Date(borrowRecord.dueDate)
    const lateDays = Math.max(0, diffInDays(dueDate, returnDate))

    setData((prev) => ({
      ...prev,
      books: prev.books.map((entry) => entry.id === borrowRecord.bookId ? { ...entry, availableCopies: entry.availableCopies + 1 } : entry),
      borrowings: prev.borrowings.filter((record) => record.id !== borrowId),
      returnedRecords: [
        ...prev.returnedRecords,
        {
          id: `RT-${Date.now()}`,
          borrowId: borrowRecord.id,
          bookId: borrowRecord.bookId,
          studentId: borrowRecord.studentId,
          bookTitle: book.title,
          studentName: student.fullName,
          borrowDate: borrowRecord.borrowDate,
          dueDate: borrowRecord.dueDate,
          returnDate: toIsoDate(returnDate),
          daysBorrowed: diffInDays(new Date(borrowRecord.borrowDate), returnDate),
          lateDays,
          status: lateDays > 0 ? 'Late' : 'On Time',
        },
      ],
    }))
  }

  return (
    <Box>
      <Box className="page-header">
        <Box>
          <Typography variant="h4" className="page-title">Borrowed Books</Typography>
          <Typography className="page-subtitle">Track active loans, due dates, and overdue follow-up actions.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setBorrowDialogOpen(true)}>Borrow Book</Button>
      </Box>

      <Box className="filter-toolbar">
        <Button variant={showOnlyOverdue ? 'contained' : 'outlined'} onClick={() => setShowOnlyOverdue((prev) => !prev)}>Show Overdue Only</Button>
      </Box>

      <Box className="table-container">
        <Table className="data-table">
          <TableHead>
            <TableRow>
              <TableCell>Borrowing ID</TableCell>
              <TableCell>Book</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Days Remaining</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleBorrowings.map((record) => {
              const book = books.find((entry) => entry.id === record.bookId)
              const student = students.find((entry) => entry.id === record.studentId)
              const status = getBorrowStatus(record)
              const daysRemaining = diffInDays(new Date(), new Date(record.dueDate))

              return (
                <TableRow key={record.id} hover>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{book?.title}</TableCell>
                  <TableCell>{student?.fullName}</TableCell>
                  <TableCell>{record.borrowDate}</TableCell>
                  <TableCell>{record.dueDate}</TableCell>
                  <TableCell>{daysRemaining}</TableCell>
                  <TableCell><StatusChip label={status} color={status === 'Overdue' ? 'error' : status === 'Due Soon' ? 'warning' : 'info'} /></TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="success" onClick={() => handleReturnBook(record.id)}>Return</Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={borrowDialogOpen} onClose={() => setBorrowDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Borrow Book</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Student</InputLabel>
            <Select value={selectedBorrow.studentId} label="Student" onChange={(event) => setSelectedBorrow((prev) => ({ ...prev, studentId: event.target.value }))}>
              {students.map((student) => <MenuItem key={student.id} value={student.id}>{student.fullName}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Book</InputLabel>
            <Select value={selectedBorrow.bookId} label="Book" onChange={(event) => setSelectedBorrow((prev) => ({ ...prev, bookId: event.target.value }))}>
              {books.map((book) => <MenuItem key={book.id} value={book.id} disabled={book.availableCopies <= 0}>{book.title} ({book.availableCopies} available)</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Borrow Date" type="date" value={selectedBorrow.borrowDate} onChange={(event) => setSelectedBorrow((prev) => ({ ...prev, borrowDate: event.target.value }))} InputLabelProps={{ shrink: true }} />
          <TextField label="Due Date" type="date" value={selectedBorrow.dueDate} onChange={(event) => setSelectedBorrow((prev) => ({ ...prev, dueDate: event.target.value }))} InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBorrowDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBorrow}>Save Borrow Record</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function ReturnedBooksPage({ data }) {
  const records = data.returnedRecords || []

  return (
    <Box>
      <Box className="page-header">
        <Box>
          <Typography variant="h4" className="page-title">Returned Books</Typography>
          <Typography className="page-subtitle">Review completed return transactions and repayment status.</Typography>
        </Box>
      </Box>

      <Box className="table-container">
        <Table className="data-table">
          <TableHead>
            <TableRow>
              <TableCell>Return ID</TableCell>
              <TableCell>Book</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Days Borrowed</TableCell>
              <TableCell>Late Days</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.bookTitle}</TableCell>
                <TableCell>{record.studentName}</TableCell>
                <TableCell>{record.borrowDate}</TableCell>
                <TableCell>{record.dueDate}</TableCell>
                <TableCell>{record.returnDate}</TableCell>
                <TableCell>{record.daysBorrowed}</TableCell>
                <TableCell>{record.lateDays}</TableCell>
                <TableCell><StatusChip label={record.status} color={record.status === 'Late' ? 'warning' : 'success'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}

function ReportsPage({ data }) {
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [studentFilter, setStudentFilter] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [bookFilter, setBookFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filteredBorrowings = useMemo(() => {
    return (data.borrowings || []).filter((record) => {
      const student = data.students.find((entry) => entry.id === record.studentId)
      const book = data.books.find((entry) => entry.id === record.bookId)
      const bookMatches = bookFilter === 'All' || record.bookId === bookFilter
      const categoryMatches = categoryFilter === 'All' || book?.category === categoryFilter
      const studentMatches = studentFilter === 'All' || record.studentId === studentFilter
      const classMatches = classFilter === 'All' || student?.className === classFilter
      const statusMatches = statusFilter === 'All' || getBorrowStatus(record) === statusFilter
      const matchesStart = !startDate || record.borrowDate >= startDate
      const matchesEnd = !endDate || record.borrowDate <= endDate
      return bookMatches && categoryMatches && studentMatches && classMatches && statusMatches && matchesStart && matchesEnd
    })
  }, [data, categoryFilter, studentFilter, classFilter, bookFilter, statusFilter, startDate, endDate])

  const exportCsv = () => {
    const rows = filteredBorrowings.map((record) => {
      const student = data.students.find((entry) => entry.id === record.studentId)
      const book = data.books.find((entry) => entry.id === record.bookId)
      return [record.id, book?.title, student?.fullName, record.borrowDate, record.dueDate, getBorrowStatus(record)].join(',')
    })

    const csv = ['Borrowing ID,Book,Student,Borrow Date,Due Date,Status', ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'library-report.csv'
    link.click()
  }

  const categoryData = (data.categories || []).map((category) => ({
    name: category.name,
    count: (data.books || []).filter((book) => book.category === category.name).length,
  }))

  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const month = new Date(); month.setMonth(month.getMonth() - (5 - index))
    const key = month.toLocaleString('en-US', { month: 'short' })
    const count = filteredBorrowings.filter((record) => {
      const date = new Date(record.borrowDate)
      return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear()
    }).length
    return { name: key, count }
  })

  const overdueReport = filteredBorrowings.filter((record) => getBorrowStatus(record) === 'Overdue')

  return (
    <Box>
      <Box className="page-header">
        <Box>
          <Typography variant="h4" className="page-title">Reports</Typography>
          <Typography className="page-subtitle">Track inventory performance, borrowing trends, and overdue activity.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={exportCsv}>Export CSV</Button>
          <Button variant="outlined" onClick={() => window.print()}>Print Report</Button>
        </Stack>
      </Box>

      <Box className="filter-toolbar">
        <TextField size="small" type="date" label="Start Date" value={startDate} onChange={(event) => setStartDate(event.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField size="small" type="date" label="End Date" value={endDate} onChange={(event) => setEndDate(event.target.value)} InputLabelProps={{ shrink: true }} />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Category</InputLabel>
          <Select value={categoryFilter} label="Category" onChange={(event) => setCategoryFilter(event.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {(data.categories || []).map((category) => <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Student</InputLabel>
          <Select value={studentFilter} label="Student" onChange={(event) => setStudentFilter(event.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {(data.students || []).map((student) => <MenuItem key={student.id} value={student.id}>{student.fullName}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Level</InputLabel>
          <Select value={classFilter} label="Level" onChange={(event) => setClassFilter(event.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {[...new Set((data.students || []).map((student) => student.className))].map((className) => <MenuItem key={className} value={className}>{className}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Book</InputLabel>
          <Select value={bookFilter} label="Book" onChange={(event) => setBookFilter(event.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {(data.books || []).map((book) => <MenuItem key={book.id} value={book.id}>{book.title}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(event) => setStatusFilter(event.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Borrowed">Borrowed</MenuItem>
            <MenuItem value="Due Soon">Due Soon</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box className="chart-grid">
        <Card className="chart-card" elevation={0}>
          <CardContent>
            <Typography variant="h6">Book Inventory Report</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="chart-card" elevation={0}>
          <CardContent>
            <Typography variant="h6">Borrowing Report</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line dataKey="count" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      <Box mt={2}>
        <Alert severity="warning">{overdueReport.length} overdue records require follow-up from the librarian.</Alert>
      </Box>
    </Box>
  )
}

function BookDetailPage({ data }) {
  const { bookId } = useParams()
  const book = (data.books || []).find((entry) => entry.id === bookId)
  const [tab, setTab] = useState(0)

  if (!book) {
    return <Alert severity="error">Book not found.</Alert>
  }

  const borrowingHistory = (data.borrowings || []).filter((record) => record.bookId === bookId)
  const currentBorrowers = borrowingHistory.filter((record) => getBorrowStatus(record) !== 'Overdue' || true)

  return (
    <Box>
      <Box className="page-header">
        <Box>
          <Typography variant="h4" className="page-title">{book.title}</Typography>
          <Typography className="page-subtitle">Book details, borrowing activity, and current borrower information.</Typography>
        </Box>
        <Link to="/books"><Button variant="outlined">Back to Books</Button></Link>
      </Box>

      <Card elevation={0}>
        <CardContent>
          <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}>
            <Tab label="Overview" />
            <Tab label="Borrowing History" />
            <Tab label="Current Borrowers" />
          </Tabs>

          {tab === 0 && (
            <Box sx={{ mt: 3 }} className="detail-grid">
              <Box className="detail-box"><Typography variant="subtitle2" color="text.secondary">ISBN</Typography><Typography>{book.isbn}</Typography></Box>
              <Box className="detail-box"><Typography variant="subtitle2" color="text.secondary">Author</Typography><Typography>{book.author}</Typography></Box>
              <Box className="detail-box"><Typography variant="subtitle2" color="text.secondary">Category</Typography><Typography>{book.category}</Typography></Box>
              <Box className="detail-box"><Typography variant="subtitle2" color="text.secondary">Publisher</Typography><Typography>{book.publisher}</Typography></Box>
              <Box className="detail-box"><Typography variant="subtitle2" color="text.secondary">Publication Year</Typography><Typography>{book.publicationYear}</Typography></Box>
              <Box className="detail-box"><Typography variant="subtitle2" color="text.secondary">Total Copies</Typography><Typography>{book.totalCopies}</Typography></Box>
              <Box className="detail-box"><Typography variant="subtitle2" color="text.secondary">Available Copies</Typography><Typography>{book.availableCopies}</Typography></Box>
              <Box className="detail-box"><Typography variant="subtitle2" color="text.secondary">Shelf Location</Typography><Typography>{book.shelf}</Typography></Box>
              <Box className="detail-box"><Typography variant="subtitle2" color="text.secondary">Book Status</Typography><StatusChip label={getBookStatus(book)} color={getBookStatus(book) === 'Borrowed Out' ? 'error' : getBookStatus(book) === 'Low Stock' ? 'warning' : 'success'} /></Box>
              <Box className="detail-box" sx={{ gridColumn: '1 / -1' }}><Typography variant="subtitle2" color="text.secondary">Description</Typography><Typography>{book.description}</Typography></Box>
            </Box>
          )}

          {tab === 1 && (
            <Box mt={3} className="table-container">
              <Table className="data-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Borrow ID</TableCell>
                    <TableCell>Borrow Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {borrowingHistory.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>{record.id}</TableCell>
                      <TableCell>{record.borrowDate}</TableCell>
                      <TableCell>{record.dueDate}</TableCell>
                      <TableCell><StatusChip label={getBorrowStatus(record)} color={getBorrowStatus(record) === 'Overdue' ? 'error' : getBorrowStatus(record) === 'Due Soon' ? 'warning' : 'info'} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {tab === 2 && (
            <Box mt={3} className="table-container">
              <Table className="data-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentBorrowers.map((record) => {
                    const student = (data.students || []).find((entry) => entry.id === record.studentId)
                    return (
                      <TableRow key={record.id} hover>
                        <TableCell>{student?.fullName}</TableCell>
                        <TableCell>{student?.phone}<br />{student?.email}</TableCell>
                        <TableCell>{student?.className}</TableCell>
                        <TableCell><StatusChip label={getBorrowStatus(record)} color={getBorrowStatus(record) === 'Overdue' ? 'error' : 'info'} /></TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

function AppShell({ data, setData }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width:900px)')

  const drawer = (
    <Box>
      <Box className="drawer-logo">
        <LocalLibrary color="primary" />
        <Typography variant="h6">School Library</Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end={item.path === '/'}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </NavLink>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(90deg,#0f172a,#1d4ed8)' }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>Library Management</Typography>
          <Badge badgeContent={(data.borrowings || []).filter((item) => getBorrowStatus(item) === 'Overdue').length} color="error">
            <Warning color="inherit" />
          </Badge>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: 260 } }}>
          {drawer}
        </Drawer>
      ) : (
        <Drawer variant="permanent" sx={{ width: 260, flexShrink: 0, '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box', borderRight: '1px solid rgba(148,163,184,0.2)' } }}>
          {drawer}
        </Drawer>
      )}

      <Box component="main" className="app-main" sx={{ flexGrow: 1, pl: isMobile ? 0 : 0, mt: 8, ml: isMobile ? 0 : '260px' }}>
        <Routes>
          <Route path="/" element={<DashboardPage data={data} />} />
          <Route path="/books" element={<BooksPage data={data} setData={setData} />} />
          <Route path="/books/:bookId" element={<BookDetailPage data={data} />} />
          <Route path="/categories" element={<CategoriesPage data={data} setData={setData} />} />
          <Route path="/students" element={<StudentsPage data={data} setData={setData} />} />
          <Route path="/borrowed-books" element={<BorrowedBooksPage data={data} setData={setData} />} />
          <Route path="/returned-books" element={<ReturnedBooksPage data={data} />} />
          <Route path="/reports" element={<ReportsPage data={data} />} />
        </Routes>
      </Box>
    </Box>
  )
}

function App() {
  const [data, setData] = useState(() => loadStorageState())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  return (
    <BrowserRouter>
      <AppShell data={data} setData={setData} />
    </BrowserRouter>
  )
}

export default App
