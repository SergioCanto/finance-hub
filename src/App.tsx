import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import type { Session } from "@supabase/supabase-js";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AppLayout from "./layouts/AppLayout";
import Budgets from "./pages/Budgets";
import NetWorth from "./pages/NetWorth";
import Goals from "./pages/Goals";
import Categories from "./pages/Categories";
import Accounts from "./pages/Accounts";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    supabase.auth
      .getSession()
      .then(({ data }) => {

        setSession(
          data.session
        );

        setLoading(false);

      });

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);
  if (loading) {
    return (
      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-zinc-950
      text-white
    ">
        Cargando...
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>

        {/* Públicas */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Privadas */}

        <Route
          element={
            <ProtectedRoute
              session={session}
            >
              <AppLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/transactions"
            element={<Transactions />}
          />

          <Route
            path="/budgets"
            element={<Budgets />}
          />

          <Route
            path="/net-worth"
            element={<NetWorth />}
          />

          <Route
            path="/goals"
            element={<Goals />}
          />

          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/accounts"
            element={<Accounts />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;