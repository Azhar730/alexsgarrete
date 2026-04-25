import Link from "next/link";

function Navbar() {
    return ( <>
        <div className="flex items-center justify-between bg-blue-400 max-w-full mx-auto p-4">
            <h1 className="px-4 py-2 text-2xl font-bold">Alexsgarrette</h1>
            <div className="flex items-center gap-4">
                <Link href={'/onboarding'}>Onboarding</Link>
                <Link href={'/login'}>Login</Link>
                <Link href={'/signup'}>Signup</Link>
            </div>
        </div>
    </> );
}

export default Navbar;