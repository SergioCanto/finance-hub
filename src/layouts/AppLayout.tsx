import { Outlet, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Receipt,
    Wallet,
    Landmark,
    Target,
    Tags,
    Building2,
    Menu,
    X,
} from "lucide-react";


export default function AppLayout() {
    const [email, setEmail] =
        useState("");
    useEffect(() => {
        loadUser();
    }, []);
    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);
    async function loadUser() {

        const {
            data: { user },
        } =
            await supabase.auth.getUser();

        setEmail(user?.email || "");
    }
    async function handleLogout() {

        await supabase.auth.signOut();

        window.location.href =
            "/login";
    }
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <div className="
                md:hidden
                flex
                items-center
                justify-between
                p-4
                border-b
                border-zinc-800
                bg-zinc-950/90
                backdrop-blur-md
                sticky
                top-0
                z-50
                ">
                <h1 className="font-bold text-xl">
                    Finance Hub
                </h1>

                <button
                    onClick={() =>
                        setMobileMenuOpen(!mobileMenuOpen)
                    }
                >
                    {mobileMenuOpen
                        ? <X size={24} />
                        : <Menu size={24} />}
                </button>
            </div>
            <aside className="
                hidden
                md:block
                w-64
                border-r
                border-zinc-800
                p-6
                fixed
                h-screen
                ">
                <div className="mb-8">

                    <h1 className="text-2xl font-bold">
                        Finance Hub
                    </h1>

                    <p className="text-xs text-zinc-500 mt-2">
                        {email}
                    </p>

                </div>

                <nav className="space-y-3">
                    <Link
                        to="/"
                        className="flex items-center gap-3 hover:text-blue-400"
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>

                    <Link
                        to="/transactions"
                        className="flex items-center gap-3 hover:text-blue-400"
                    >
                        <Receipt size={18} />
                        Transacciones
                    </Link>
                    <Link
                        to="/budgets"
                        className="flex items-center gap-3 hover:text-blue-400"
                    >
                        <Wallet size={18} />
                        Budget
                    </Link>
                    <Link
                        to="/net-worth"
                        className="flex items-center gap-3 hover:text-blue-400"
                    >
                        <Landmark size={18} />
                        Net Worth
                    </Link>
                    <Link
                        to="/goals"
                        className="flex items-center gap-3 hover:text-blue-400"
                    >
                        <Target size={18} />
                        Metas
                    </Link>
                    <Link
                        to="/categories"
                        className="flex items-center gap-3 hover:text-blue-400"
                    >
                        <Tags size={18} />
                        Categorías
                    </Link>
                    <Link
                        to="/accounts"
                        className="flex items-center gap-3 hover:text-blue-400"
                    >
                        <Building2 size={18} />
                        Cuentas
                    </Link>
                </nav>
                <div className="mt-8">

                    <button
                        onClick={handleLogout}
                        className="
                        mt-4
                        w-full
                        bg-red-600
                        hover:bg-red-500
                        py-2
                        rounded-lg
                        "
                    >
                        Cerrar Sesión
                    </button>

                </div>
            </aside>
            {mobileMenuOpen && (
                <div className="
                    md:hidden
                    fixed
                    top-[73px]
                    left-0
                    right-0
                    z-40
                    bg-zinc-900
                    border-b
                    border-zinc-800
                    p-4
                    shadow-xl
                    ">
                    <nav className="space-y-3">

                        <Link
                            to="/"
                            className="flex items-center gap-3 py-2"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>

                        <Link
                            to="/transactions"
                            className="flex items-center gap-3 py-2"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                        >
                            <Receipt size={18} />
                            Transacciones
                        </Link>

                        <Link
                            to="/budgets"
                            className="flex items-center gap-3 py-2"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                        >
                            <Wallet size={18} />
                            Budget
                        </Link>

                        <Link
                            to="/net-worth"
                            className="flex items-center gap-3 py-2"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                        >
                            <Landmark size={18} />
                            Net Worth
                        </Link>

                        <Link
                            to="/goals"
                            className="flex items-center gap-3 py-2"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                        >
                            <Target size={18} />
                            Metas
                        </Link>

                        <Link
                            to="/categories"
                            className="flex items-center gap-3 py-2"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                        >
                            <Tags size={18} />
                            Categorías
                        </Link>

                        <Link
                            to="/accounts"
                            className="flex items-center gap-3 py-2"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                        >
                            <Building2 size={18} />
                            Cuentas
                        </Link>

                    </nav>
                </div>
            )}
            <main
                className="
                md:ml-64
                p-4
                md:p-8
                "
            >
                <Outlet />
            </main>
        </div>
    );
}