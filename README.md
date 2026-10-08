# School Library Management System

A modern React-based school library management app built with Vite, Material UI, React Router, and Recharts. The application includes dashboard analytics, book management, categories, student records, borrowing and return workflows, overdue alerts, and a reports section powered by mock data stored in localStorage.

## Technologies Used

- React.js
- Vite
- JavaScript ES6+
- React Router
- Material UI (MUI)
- Recharts
- HTML5/CSS3
- Browser localStorage

## Features

- Dashboard with summary cards and charts
- Book CRUD and filtering
- Dynamic book detail pages
- Category management with counts
- Student management forms
- Borrowed and returned book tracking
- Overdue detection and warnings
- Reports dashboard with CSV export and print option
- Responsive layout with drawer navigation
- Mock data initialized automatically in localStorage

## Mock Data

The app creates mock data on first launch, including:

- 40 books
- 10 categories
- 30 students
- 20 active borrowing records
- 15 returned records
- 8 overdue records

## Installation

1. Navigate to the project folder.
2. Install dependencies:

   npm install

## Run the Application

npm run dev

Then open the local Vite URL shown in the terminal.

## Production Build

npm run build

## Notes

- Data persists in the browser using localStorage.
- Refreshing the page keeps the current app state.
- The application is designed for a school library staff workflow and works on desktop, tablet, and mobile screens.

## Future Improvements

- Add authentication and role-based access
- Integrate a real backend and database
- Add barcode scanning support
- Improve PDF report generation
- Add advanced analytics and filters
