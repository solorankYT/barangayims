import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                backgroundImage: "url('https://plus.unsplash.com/premium_photo-1722704537052-04209596bf4e?q=80&w=2071&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
                paddingTop: "1.5rem",
            }}
        >
            <div>
                <Link href="/">
                    <img
                    src="https://upload.wikimedia.org/wikipedia/en/e/e8/Barangay_League_Logo.png"
                    alt="Barangay Logo"
                    style={{ width: 100, height: 100, marginRight: 10 }}
                    />
                </Link>
            </div>

            <div className="mt-6 overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md lg:w-full rounded-lg">
                {children}
            </div>
        </div>
    );
}
