# Teacher Management System

A modern, full-featured Next.js application for comprehensive teacher management with advanced features including payment processing, progress tracking, and dynamic data visualization.

## ✨ Features

### 🏫 Teacher Management
- **Comprehensive Teacher Profiles**: Complete teacher information including personal, professional, banking, and emergency contact details
- **Dynamic Teacher Listing**: View teachers in both card and table layouts with search and filtering capabilities
- **Add New Teachers**: Multi-tab form with validation for all teacher details including profile picture upload
- **Edit Teacher Information**: Full editing capabilities with pre-populated forms
- **Delete Teachers**: Confirmation dialogs for safe teacher removal
- **Teacher Details Page**: Detailed view with all teacher information and progress charts

### 💰 Payment Processing
- **Dynamic Payment System**: Bank transfer and UPI payment options with teacher-specific details
- **Payment Status Tracking**: Real-time status display (Paid, Pending, Overdue)
- **Copy-to-Clipboard**: Easy copying of payment details
- **Payment Validation**: Form validation with real-time feedback
- **Responsive Payment UI**: Mobile-first design with collapsible payment methods

### 📊 Data Visualization
- **Teaching Progress Charts**: Multiple chart types including line, bar, area, and pie charts
- **Performance Metrics**: Student count, course completion, satisfaction ratings, and attendance tracking
- **Interactive Charts**: Responsive charts with tooltips and animations
- **Real-time Data**: Dynamic chart updates based on teacher performance

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Form Validation**: Comprehensive validation with real-time feedback
- **Loading States**: Smooth loading indicators throughout the application
- **Custom Scrollbars**: Themed scrollbars for better visual consistency
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### 🔧 Technical Features
- **Global State Management**: Context-based state management for real-time updates
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Form Handling**: React Hook Form with Zod validation schemas
- **Modern UI Components**: Shadcn/ui components with custom styling
- **Dynamic Routing**: Next.js App Router with dynamic pages and layouts

## 🛠 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization
- **State Management**: React Context API
- **Icons**: Lucide React
- **Development**: ESLint, Prettier

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ANUPAM-RO/Teacher-Management.git
cd teacher-management-app
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Run the development server:
```bash
yarn dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
teacher-management-app/
├── app/                          # Next.js App Router pages
│   ├── teachers/                 # Teacher management pages
│   │   ├── page.tsx             # Teachers listing page
│   │   ├── add/                 # Add teacher page
│   │   └── [id]/                # Dynamic teacher pages
│   │       ├── page.tsx         # Teacher details
│   │       ├── edit/            # Edit teacher page
│   │       └── payment/         # Payment processing page
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── features/teacher/        # Teacher-specific components
│   │   ├── TeacherCard.tsx      # Teacher card component
│   │   ├── TeacherTable.tsx     # Teacher table component
│   │   ├── TeacherForm.tsx      # Reusable teacher form
│   │   ├── TeachingProgressChart.tsx # Progress charts
│   │   └── DeleteConfirmationDialog.tsx # Delete confirmation
│   ├── ui/                      # Shadcn/ui components
│   └── ModeToggle.tsx           # Theme toggle
├── lib/                         # Utility libraries
│   ├── types.ts                 # TypeScript type definitions
│   ├── mockData.ts              # Sample teacher data
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## 🎯 Key Features in Detail

### Teacher Form System
- **Multi-tab Interface**: Organized sections for Basic Info, Professional Details, Banking Info, and Emergency Contacts
- **Image Upload**: Profile picture upload with preview and validation
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Visual feedback during form submission

### Payment Processing
- **Dynamic Payment Details**: Teacher-specific bank and UPI information
- **Status Management**: Automatic calculation of payment status based on dates
- **Responsive Design**: Mobile-optimized payment interface
- **Copy Functionality**: One-click copying of payment details

### Progress Tracking
- **Multiple Chart Types**: Line, bar, area, and pie charts for different metrics
- **Performance Indicators**: Student count, course completion, satisfaction, attendance
- **Interactive Elements**: Hover tooltips and responsive design
- **Real-time Updates**: Dynamic chart rendering based on data

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: Collapsible navigation, stacked layouts, touch-friendly interfaces
- **Tablet**: Optimized layouts with improved spacing
- **Desktop**: Multi-column layouts, hover effects, enhanced navigation

## 🔒 Data Management

- **Global State**: Context-based state management for consistent data across pages
- **Mock Data**: Comprehensive sample data for demonstration
- **Type Safety**: Full TypeScript implementation with strict typing
- **Form Persistence**: Data persistence during navigation

## 🎨 Customization

The application supports extensive customization:
- **Theme System**: Dark/light mode with custom color schemes
- **Component Styling**: Tailwind CSS classes for easy styling modifications
- **Chart Customization**: Configurable chart colors, sizes, and animations
- **Form Validation**: Customizable validation rules and error messages

## 🚀 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide React](https://lucide.dev/)
