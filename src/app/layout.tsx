import Navbar from '@/components/navbar'
import './globals.css'
import Footer from '@/components/footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <title>Lift Log | Fitness and Gym Progress</title>
            </head>
            <body>
                <header>
                    <Navbar />
                </header>
                {children}
                <footer>
                    <Footer />
                </footer>
            </body>
        </html>
    )
}