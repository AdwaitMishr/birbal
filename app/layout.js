import { Cinzel } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Birbal",
  description: "Your intelligent AI assistant",
  icons: {
    icon: "/logo.svg" 
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cinzel.variable} font-sans antialiased`}
      > <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
        {children}
      </ThemeProvider>
        
      </body>
    </html>
  );
}
