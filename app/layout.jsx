import '@/assets/styles/globals.css'

export const metadata = {
    title: 'Property Pulse',
    description: 'Find the best rental properties in your area',
    keywords: 'rental, property, management',
}
const MainLayout = ({ children }) => {
    return ( 
        <html>
            <body>
                <main>
                    {children}
                </main>
            </body>
        </html>
     );
}
 
export default MainLayout;