# 💖💖💖 WeRent Group A - Frontend 💖💖💖

A Next.js-based e-commerce rental platform frontend application. This project provides a user interface for browsing products, viewing product details, and submitting reviews.

**Tagline:** "We Rent, We Return, We Repeat"

## Live Demo https://a-we-rent-fe.vercel.app

## Features

- **Product Detail Page**: View detailed product information including images, descriptions, and pricing
- **Dynamic Review System**: 
  - Display total review count dynamically from backend API
  - Submit product reviews with reviewer name and review text
  - Review modal with form validation
  - Success toast notification when review is submitted
- **Toast Notifications**: Custom-built toast UI for user feedback
- **Responsive Design**: Modern UI built with Tailwind CSS
- **API Integration**: Seamless integration with backend API through Next.js API routes
- **Real-time Updates**: Review count updates automatically after submitting a review

## Tech Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4

## Project Structure

```
group-a-fe/
├── app/
│   ├── api/
│   │   └── products/
│   │       └── [id]/
│   │           └── route.ts          # API route for product operations
│   ├── component/
│   │   └── ReviewModals.tsx          # Review submission modal component
│   ├── product/
│   │   └── page.tsx                  # Product detail page
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout with font configuration
│   └── page.tsx                      # Homepage
├── public/
│   └── image/                        # Static images
├── .env.local                        # Environment variables (create this)
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies and scripts
└── tsconfig.json                     # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MuhammadIrfanDzaky/group-a-fe.git
cd group-a-fe
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:
```env
BACKEND_URL="Put the Backend URL here"
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Backend API Integration

The frontend communicates with the backend API through Next.js API routes:

- **GET** `${BACKEND_URL}/api/products/${id}` - Fetch product details
- **POST** `${BACKEND_URL}/api/products/${id}/review` - Submit a review

## Pages

### Homepage (`/`)
Simple landing page with a link to the product page.

### Product Page (`/product?id={productId}`)
- Displays product information
- Shows product image, title, and rating
- Displays dynamic review count
- Shows size rating distribution
- Individual review display
- Sticky bottom bar with rent fee and "ADD" button
- Click on "REVIEWS" to open review submission modal

**Query Parameters**:
- `id`: Product ID (defaults to '1' if not provided)

## Components

### ReviewModal
A modal component for submitting product reviews.

**Props**:
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Callback to close the modal
- `productId`: string - Product ID for review submission
- `onSuccess?`: () => void - Optional callback after successful submission

**Features**:
- Form validation
- Error handling
- Success toast notification on successful submission
- Auto-refresh product data after submission

## Key Features Implementation

### Dynamic Review Count
The count updates automatically after submitting a new review.

### Review Submission Flow
1. User clicks on "REVIEWS" count
2. Modal opens with form
3. User enters name and review text
4. Form submits to `/api/products/${productId}`
5. API route forwards to backend
6. On success, success toast notification appears at the top of the screen
7. Toast displays "Review submitted successfully!" message with check icon
8. Modal closes after 2 seconds (allowing user to see the toast)
9. Product data refreshes automatically
10. Review count updates automatically

### Toast Notification System
- **Custom Implementation**: Built without external libraries using pure React and CSS
- **Features**:
  - Smooth slide-down animation on appearance
  - Auto-dismisses after 3 seconds
  - Manual close button (X icon)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Data Flow

```
User Action → Frontend Component → Next.js API Route → Backend API → Response → UI Update
```

Example:
1. User submits review → `ReviewModal` component
2. POST to `/api/products/${id}` → Next.js API route
3. Forward to `${BACKEND_URL}/api/products/${id}/review` → Backend
4. Response → Update product data
5. Refresh UI with new review count

## Error Handling

- API errors are caught and displayed to users
- Loading states prevent multiple submissions
- Form validation ensures required fields are filled
- Network errors are handled gracefully

## Dependencies

### Production
- `next`: 16.0.3
- `react`: 19.2.0
- `react-dom`: 19.2.0
- `react-icons`: ^5.5.0

### Development
- `typescript`: ^5
- `tailwindcss`: ^4
- `eslint`: ^9
- `eslint-config-next`: 16.0.3

Make sure to set the `BACKEND_URL` environment variable in your deployment platform.

## Team

Group A - WeRent Project
Made with struggle
💖😍😊❤️‍🔥

---

