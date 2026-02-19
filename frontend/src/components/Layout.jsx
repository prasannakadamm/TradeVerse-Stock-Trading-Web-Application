import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import TickerTape from "./TickerTape";
import AiAssistant from "./AiAssistant";

const Layout = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    if (isAuthPage) {
        return <Outlet />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors duration-300">
            <TickerTape />

            <div className="flex flex-1 relative">
                {/* Sidebar */}
                <Navbar />

                {/* Main Content Area */}
                <main className="flex-1 ml-[260px] relative overflow-y-auto h-[calc(100vh-40px)] scroll-smooth custom-scrollbar">
                    <div className="animate-fade-in min-h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            <AiAssistant />
        </div>
    );
};

export default Layout;
