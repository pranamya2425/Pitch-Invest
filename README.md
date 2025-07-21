# Pitch & Invest Platform

This repository contains the design and implementation for the "Pitch & Invest Platform" project, a full-stack web application designed to connect innovative entrepreneurs with potential investors.

## Project Overview

The Pitch & Invest Platform provides a dedicated space for entrepreneurs to showcase their business ideas and for investors to discover promising startups. It features a robust authentication system with distinct roles for entrepreneurs, investors, and administrators, ensuring a tailored experience for each user type. The platform focuses on intuitive pitch management, efficient investor discovery, and secure data handling.

## Features

-   **Multi-Role Authentication**: Secure login and registration for Entrepreneurs, Investors, and Admins.
-   **Pitch Management**: Entrepreneurs can create, edit, and track their business pitches, including funding goals and descriptions.
-   **Investor Discovery**: Investors can browse, search, and filter pitches by category, funding range, and keywords.
-   **Interest Tracking**: Investors can express and remove interest in pitches, notifying entrepreneurs.
-   **Admin Dashboard**: Comprehensive tools for managing users and pitches across the platform.
-   **Responsive Design**: A clean, modern, and mobile-friendly user interface built with Tailwind CSS.
-   **Secure Data Handling**: JWT-based authentication, password hashing, and secure API routes.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone <your-repository-url> # Replace with your actual repository URL
    cd pitch-invest-platform
2. **Install dependencies**:

```shellscript
npm install
# or
yarn install
```


3. **Environment Setup**:
Create a `.env.local` file in the root directory of the project and add your MongoDB URI and a JWT secret:

```plaintext
MONGODB_URI=mongodb+srv://pranamya2425:Moni2425@cluster0.mongodb.net/PitchInvest?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-at-least-32-characters
NODE_ENV=development
```


4. **Initialize Database**:
Run the database initialization script to create necessary collections, indexes, and populate sample data:

```shellscript
npm run init-db
```


5. **Run the development server**:

```shellscript
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.




## Live Demo

You can try out the platform with these demo accounts after initializing the database:
- https://pitch-invest.vercel.app/
- **Entrepreneur**: `entrepreneur@example.com` / `password123`
- **Investor**: `investor@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`


## Technologies Used

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT, bcryptjs


## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests
