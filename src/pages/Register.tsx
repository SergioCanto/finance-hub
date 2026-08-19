import { useState } from "react";
import { supabase } from "../lib/supabase";
import {
    Link,
} from "react-router-dom";

export default function Register() {


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    async function handleRegister() {

        const result =
            await supabase.auth.signUp({
                email,
                password,
            });

        console.log(result);

        const { error } = result;

        if (error) {
            alert(
                JSON.stringify(
                    error,
                    null,
                    2
                )
            );
            return;
        }

        alert("Cuenta creada correctamente");
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
                bg-zinc-900
                p-8
                rounded-xl
                w-[400px]
                "
            >
                <h1
                    className="
                    text-2xl
                    font-bold
                    mb-6
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
                        bg-zinc-800
                        p-3
                        rounded-lg
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
                        bg-zinc-800
                        p-3
                        rounded-lg
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