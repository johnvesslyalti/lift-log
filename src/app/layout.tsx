import Navbar from '@/components/navbar'
import './globals.css'
import Footer from '@/components/footer'
import { ThemeProvider } from '../components/theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <title>Lift Log | Fitness and Gym Progress</title>
            </head>
            <body>
                <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                >
                <header>
                    <Navbar />
                </header>
                {children}
                <footer>
                    <Footer />
                </footer>
                </ThemeProvider>
            </body>
        </html>
    )
}