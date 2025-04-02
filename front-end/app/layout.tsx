

// import type React from "react"
// import "@/app/globals.css"
// import { Inter } from "next/font/google"

// import { ThemeProvider } from "@/components/theme-provider"
// import { DashboardLayout } from "@/components/dashboard-layout"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "HR & Payroll Dashboard",
//   description: "Integrated HR and Payroll Management System",
//     generator: 'v0.dev'
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
//           <DashboardLayout>{children}</DashboardLayout>
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }



// import './globals.css'


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "@/components/dashboard-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HR & Payroll Dashboard",
  description: "Integrated HR and Payroll Management System",
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <DashboardLayout>{children}</DashboardLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
