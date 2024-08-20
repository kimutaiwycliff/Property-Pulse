import '@/assets/styles/globals.css'
import Navbar from '@/components/Navbar';

export const metadata = {
    title: 'Property Pulse',
    description: 'Find the best rental properties in your area',
    keywords: 'rental, property, management',
}
const MainLayout = ({ children }) => {
    return ( 
        <html>
            <body>
                <Navbar />
                <main>
                    {children}
                </main>
            </body>
        </html>
     );
}
 
export default MainLayout;