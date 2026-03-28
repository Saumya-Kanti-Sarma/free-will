"use client";

import { useEffect, useState } from "react";
import { supabase } from "../libs/supabase";

export default function Home() {
  const [number, setNumber] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 🔔 Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // 📊 Fetch total count
  const fetchCount = async () => {
    const { count } = await supabase
      .from("guesses")
      .select("*", { count: "exact", head: true });

    setCount(count || 0);
  };

  useEffect(() => {
    fetchCount();
  }, []);

  // suubmit handler
  const handleSubmit = async () => {
    if (!number) return;

    // ⚡ UX layer
    if (localStorage.getItem("submitted")) {
      showToast("Nice try but one brain = one vote", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        body: JSON.stringify({ number: Number(number) }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error, "error");
      } else {
        localStorage.setItem("submitted", "true");
        setNumber("");
        await fetchCount();
        showToast("Submitted successfully 🎉", "success");
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    }

    setLoading(false);
  };


  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gray-50">
      <h1 className="text-3xl font-bold">Random Number Experiment</h1>

      <p className="text-gray-600">
        Enter a random number (1–100)
      </p>

      <input
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        className="border px-4 py-2 rounded w-64"
        placeholder="Enter number"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      <div className="mt-4 text-lg">
        Total responses:{" "}
        <span className="font-bold">
          {count !== null ? count : "Loading..."}
        </span>
      </div>

      {/* WHY BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-6 text-sm text-blue-600 "
      >
        but why??
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl max-w-md text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-3"> Why this exists?</h2>

            <p className="text-gray-700">
              I'm trying to find out whether humans are actually <b>random</b> and <b>Free Will </b>exists or not...
              <br /><br />
              The plan is to collect as many as possible random guesses of numbers from <b>HUMANS</b> and plot them to see if they form a uniformly distributed or normal distribution graph... :)
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
              Got it
            </button>
          </div>
        </div>
      )}
      {/* 🔔 TOAST */}
      {toast && (
        <div
          onClick={() => setToast(null)}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in cursor-pointer"
        >
          <div
            className={`px-4 py-3 rounded-lg shadow-lg text-white min-w-62.5
            ${toast.type === "success"
                ? "bg-green-600"
                : "bg-red-600"
              }`}
          >
            <b> {toast.message}</b>
          </div>
        </div>
      )}
    </main>
  );
}