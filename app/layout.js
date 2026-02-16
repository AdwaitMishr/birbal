import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { Libre_Baskerville } from 'next/font/google'

const baskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'], // It doesn't need many weights, 400 is already thick
  variable: '--font-baskerville',
})
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
        className={`${baskerville.variable} font-sans antialiased`}>
          <QueryProvider>
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
            <Toaster/>
        {children}
      </ThemeProvider>
      </QueryProvider>
      </body>
    </html>
  );
}
