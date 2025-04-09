# GradeGenie

## About GradeGenie

GradeGenie, developed by **Team-ALTF4**, is a comprehensive full-stack application designed to streamline and enhance the grading process for educators and academic institutions. It serves as a robust platform to simplify grading workflows, track academic performance effectively, and provide valuable insights through an intuitive interface. The primary goal is to reduce the manual burden on educators while offering powerful tools for assessment and analysis.

## Core Features

This application boasts a range of features tailored to the needs of modern education. **Automated assignment grading** forms the core functionality, significantly speeding up the evaluation process. To provide deeper insights, GradeGenie includes **visualized performance metrics**, allowing educators to easily track student and class progress over time. Security is paramount, with **secure authentication and data management** protocols in place to protect sensitive information. The platform also facilitates **seamless assignment creation and submission handling**, making the entire lifecycle of an assignment manageable within the application. Finally, **exportable grading results** ensure that data can be easily extracted for reporting or record-keeping purposes.

## Technology Stack

GradeGenie leverages a modern and efficient technology stack to deliver a responsive and reliable experience. The **frontend** is built using **React.js** with **TypeScript**, powered by **Vite** for an optimized development workflow and fast performance. The **backend** logic is handled by **Node.js** and the **Express.js** framework, providing a robust API foundation. For data persistence, **MongoDB** serves as the database solution, offering flexibility and scalability. The entire application is deployed on **Vercel**, ensuring high availability and seamless updates.

## Project Structure

The repository is organized into distinct client and server directories for clarity and separation of concerns. Below is an overview of the project's layout:

```
team-altf4-gradegenie/
├── LICENSE
├── README.md
├── Client/                 # Frontend React Application
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig*.json
│   ├── vercel.json
│   ├── vite.config.ts
│   ├── .gitignore
│   ├── public/            # Static assets
│   └── src/               # Frontend source code
│       ├── App.tsx, App.css, main.tsx, vite-env.d.ts # Core setup
│       ├── assets/        # Images, fonts, etc.
│       ├── Components/    # Reusable UI components
│       │   ├── AssignmentCard.tsx
│       │   ├── Assignments.tsx
│       │   ├── CreateAssignment.tsx
│       │   ├── Dashboard.tsx
│       │   ├── ExportButton.tsx
│       │   ├── FinalAssignment.tsx
│       │   ├── GeneratorModal.tsx
│       │   ├── Input.tsx
│       │   ├── Results.tsx
│       │   ├── Sidebar.tsx
│       │   ├── SidebarItem.tsx
│       │   └── Submissions.tsx
│       ├── Context API/   # Global state management
│       │   └── StateContext.tsx
│       ├── Pages/         # Route-specific page components
│       │   ├── ErrorRoute.tsx
│       │   ├── Home.tsx
│       │   ├── LandingPage.tsx
│       │   ├── Login.tsx
│       │   ├── Signup.tsx
│       │   └── SubmitHandler.tsx
│       └── utils/         # Utility functions
│           └── utils.tsx
├── Server/                # Backend Node.js/Express Application
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.tsbuildinfo
│   ├── vercel.json
│   ├── .env.example       # Environment variable template
│   ├── .gitignore
│   └── src/               # Backend source code
│       ├── index.ts       # Server entry point
│       ├── Config/        # Configuration files (e.g., DB connection)
│       │   └── config.ts
│       ├── Middleware/    # Express middleware
│       │   └── middleware.ts
│       ├── Schema/        # Database schemas (e.g., Mongoose models)
│       │   └── db.ts
│       └── Utils/         # Backend utility functions
│           └── utils.ts
```

## Getting Started: Installation and Setup

To get GradeGenie running on your local machine for development or testing, follow these steps:

**1. Clone the Repository:**
First, obtain a local copy of the project by cloning the GitHub repository. Open your terminal and run:
```bash
git clone https://github.com/Team-ALTF4/GradeGenie.git
cd team-altf4-gradegenie
```

**2. Install Dependencies:**
The project consists of separate client and server applications, each with its own dependencies. Navigate into each directory and install the required packages using npm:
```bash
# Install client dependencies
cd Client
npm install

# Go back to the root and install server dependencies
cd ../Server
npm install
```

**3. Start the Application:**
You'll need to run the client (React/Vite) and server (Node.js/Express) processes concurrently. Open two separate terminal windows or tabs:

In the first terminal, start the client development server:
```bash
# Navigate to the Client directory if not already there
cd ../Client  # Adjust path if needed from Server dir
npm run dev
```

In the second terminal, start the backend server:
```bash
# Navigate to the Server directory if not already there
cd ../Server # Adjust path if needed from Client dir
npm run dev
```
Once both processes are running, you should be able to access the GradeGenie application in your web browser, typically at `http://localhost:5173` (or whichever port Vite assigns). The server will handle API requests, usually running on a different port specified in its configuration (e.g., 3000 or 8080). Remember to set up your `.env` file in the `Server/` directory based on `.env.example` for database connections and other configurations.

## License Information

This project is distributed under the **MIT License**. This permissive license allows for broad use and modification of the software. Please consult the `LICENSE` file in the repository root for full details regarding permissions and limitations.

## Contributing to GradeGenie

We enthusiastically welcome contributions from the community to help enhance GradeGenie! If you have ideas for improvements, bug fixes, or new features, please feel free to fork the repository and submit a pull request with your changes. For reporting issues, suggesting enhancements, or asking questions, please utilize the **GitHub Issues** section of this repository. We appreciate your input in making GradeGenie better.

## Contact and Support

For any questions, support inquiries, or feedback regarding GradeGenie, the primary channel for communication is the **GitHub Issues page** associated with this repository. Please check existing issues before creating a new one.

---

[**View GitHub Repository**](https://github.com/Team-ALTF4/GradeGenie)
