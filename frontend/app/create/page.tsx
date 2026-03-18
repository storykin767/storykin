'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const THEMES = [
  { id: 'dinosaur', label: 'Dinosaur Adventure', emoji: '🦕' },
  { id: 'space', label: 'Space Explorer', emoji: '🚀' },
  { id: 'mermaid', label: 'Ocean Magic', emoji: '🧜' },
  { id: 'forest', label: 'Enchanted Forest', emoji: '🌲' },
  { id: 'superhero', label: 'Superhero', emoji: '⚡' },
  { id: 'princess', label: 'Magical Kingdom', emoji: '👑' },
];

const HAIR_COLORS = [
  'Blonde', 'Brown', 'Black', 'Red', 'Curly red',
  'Curly brown', 'Straight black', 'Golden blonde'
];

const EYE_COLORS = ['Brown', 'Blue', 'Green', 'Hazel', 'Grey'];

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    child_name: '',
    age: 4,
    gender: 'girl',
    hair_color: 'Brown',
    eye_color: 'Brown',
    theme: 'dinosaur',
  });

  const update = (key: string, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.child_name.trim()) {
      alert("Please enter the child's name");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      router.push(`/loading?jobId=${data.job_id}`);
    } catch (err) {
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create your book
          </h1>
          <p className="text-gray-500">
            Tell us about the child — we'll write their story
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

          {/* Child name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Child's name
            </label>
            <input
              type="text"
              placeholder="e.g. Ava"
              value={form.child_name}
              onChange={e => update('child_name', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-900 text-lg"
            />
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <select
                value={form.age}
                onChange={e => update('age', parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-900"
              >
                {[2,3,4,5,6,7,8].map(a => (
                  <option key={a} value={a}>{a} years old</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={e => update('gender', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-900"
              >
                <option value="girl">Girl</option>
                <option value="boy">Boy</option>
                <option value="child">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Hair + Eye color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hair colour
              </label>
              <select
                value={form.hair_color}
                onChange={e => update('hair_color', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-900"
              >
                {HAIR_COLORS.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eye colour
              </label>
              <select
                value={form.eye_color}
                onChange={e => update('eye_color', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-900"
              >
                {EYE_COLORS.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Theme selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose a theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => update('theme', theme.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.theme === theme.id
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className="text-2xl">{theme.emoji}</span>
                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {theme.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-200 text-white font-bold text-lg rounded-xl transition-all"
          >
            {loading ? 'Starting...' : `Write ${form.child_name || "the"} story`}
          </button>

        </div>
      </div>
    </main>
  );
}