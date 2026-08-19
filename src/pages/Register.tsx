import { useState } from "react";
import { supabase } from "../lib/supabase";
import {
    Link,
    useNavigate,
} from "react-router-dom";

export default function Register() {

    const navigate =
        useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    async function handleRegister() {

        const { error } =
            await supabase.auth.signUp({
                email,
                password,
            });

        if (error) {
            alert(error.message);
            return;
        }

        alert(
            "Cuenta creada correctamente"
        );

        navigate("/login");
    }

    return (
        <div
            className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-zinc-950
            "
        >
            <div
                className="
                bg-zinc-900/95
                border
                border-zinc-800
                shadow-xl
                p-8
                rounded-xl
                w-[400px]
                "
            >
                <h1
                    className="
                    text-4xl
                    font-extrabold
                    mb-8
                    bg-gradient-to-r
                    from-blue-400
                    to-green-400
                    bg-clip-text
                    text-transparent
                    "
                >
                    Crear Cuenta
                </h1>

                <div className="space-y-4">

                    <input
                        type="email"
                        placeholder="Correo"
                        value={email}
                        className="
                        w-full
                        bg-white
                        text-black
                        placeholder:text-zinc-500
                        border
                        border-zinc-300
                        p-3
                        rounded-lg
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        transition
                        "
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        className="
                        w-full
                        bg-white
                        text-black
                        placeholder:text-zinc-500
                        border
                        border-zinc-300
                        p-3
                        rounded-lg
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        transition
                        "
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <button
                        onClick={handleRegister}
                        className="
                        w-full
                        bg-green-600
                        py-3
                        rounded-lg
                        "
                    >
                        Crear Cuenta
                    </button>

                    <div className="text-center">

                        <p className="text-zinc-400 text-sm">
                            ¿Ya tienes cuenta?
                        </p>

                        <Link
                            to="/login"
                            className="
                            text-blue-400
                            hover:text-blue-300
                            text-sm
                            "
                        >
                            Iniciar sesión
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}