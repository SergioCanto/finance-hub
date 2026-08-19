import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    async function handleLogin() {

        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            alert(error.message);
            return;
        }

        navigate("/");
    }

    return (
        <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-zinc-950
        ">

            <div className="
            bg-zinc-900
            p-8
            rounded-xl
            w-[400px]
            ">

                <h1 className="
                text-2xl
                font-bold
                mb-6
                ">
                    Finance Hub
                </h1>

                <div className="space-y-4">

                    <input
                        type="email"
                        placeholder="Correo"
                        className="
                        w-full
                        bg-zinc-700
                        border
                        border-zinc-600
                        text-white
                        placeholder:text-zinc-400
                        p-3
                        rounded-lg
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        transition
                        "
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="
                        w-full
                        bg-zinc-700
                        border
                        border-zinc-600
                        text-white
                        placeholder:text-zinc-400
                        p-3
                        rounded-lg
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        transition
                        "
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <button
                        onClick={handleLogin}
                        className="
                        w-full
                        bg-blue-600
                        py-3
                        rounded-lg
                        "
                    >
                        Iniciar Sesión
                    </button>
                    <div className="text-center mt-4">

                        <p className="text-zinc-400 text-sm">
                            ¿No tienes cuenta?
                        </p>

                        <Link
                            to="/register"
                            className="
                            text-blue-400
                            hover:text-blue-300
                            text-sm
                            "
                        >
                            Crear cuenta
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}