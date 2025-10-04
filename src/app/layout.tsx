import './globals.css'
import { ThemeProvider } from '../components/theme-provider'
import ConditionalSidebar from '@/components/conditional-sidebar'

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
                <ConditionalSidebar>
                    {children}
                </ConditionalSidebar>
                </ThemeProvider>
            </body>
        </html>
    )
}