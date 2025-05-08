import Navbar from "./Navbar";

const Layout = ({children}) =>{
    
    return <div className="min-h-screen bg-gray-100">
        <Navbar/>
        <main className="w-full px-4 py-6">
            {children}
        </main>
    </div>
};

export default Layout;