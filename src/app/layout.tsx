import './globals.css'
import Footer from '@/components/footer'
import { ThemeProvider } from '../components/theme-provider'
import ConditionalNavbar from '@/components/conditional-navbar'

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
                    <ConditionalNavbar />
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