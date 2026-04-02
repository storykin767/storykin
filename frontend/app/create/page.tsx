'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const THEMES = [
  {
    id: 'dinosaur', label: 'Dinosaur Adventure', emoji: '🦕',
    sample: 'A child discovers a magical dinosaur egg in their garden',
    color: 'from-green-50 to-emerald-50'
  },
  {
    id: 'space', label: 'Space Explorer', emoji: '🚀',
    sample: 'A brave astronaut explores unknown planets and meets alien friends',
    color: 'from-blue-50 to-indigo-50'
  },
  {
    id: 'mermaid', label: 'Ocean Magic', emoji: '🧜',
    sample: 'An underwater adventure with magical sea creatures and hidden treasures',
    color: 'from-cyan-50 to-blue-50'
  },
  {
    id: 'forest', label: 'Enchanted Forest', emoji: '🌲',
    sample: 'A magical journey through a forest full of talking animals and fairy folk',
    color: 'from-green-50 to-lime-50'
  },
  {
    id: 'superhero', label: 'Superhero', emoji: '⚡',
    sample: 'A child discovers they have special powers and saves the day',
    color: 'from-yellow-50 to-amber-50'
  },
  {
    id: 'princess', label: 'Magical Kingdom', emoji: '👑',
    sample: 'A royal adventure in a kingdom full of magic, dragons and friendship',
    color: 'from-pink-50 to-rose-50'
  },
];

const HAIR_COLORS = [
  'Blonde', 'Brown', 'Black', 'Red', 'Curly red',
  'Curly brown', 'Straight black', 'Golden blonde'
];

const EYE_COLORS = ['Brown', 'Blue', 'Green', 'Hazel', 'Grey'];

const SKIN_TONES = [
  { id: 'light', label: 'Light', color: '#FDDBB4' },
  { id: 'medium-light', label: 'Medium light', color: '#E8B98A' },
  { id: 'medium', label: 'Medium', color: '#C8845A' },
  { id: 'medium-dark', label: 'Medium dark', color: '#9B6344' },
  { id: 'dark', label: 'Dark', color: '#6B3F2A' },
];

const PRONOUNS = [
  { id: 'she', label: 'She / Her' },
  { id: 'he', label: 'He / Him' },
  { id: 'they', label: 'They / Them' },
];

const MORALS = [
  { id: 'none', label: 'Just a fun adventure' },
  { id: 'bravery', label: 'Being brave' },
  { id: 'kindness', label: 'Kindness to others' },
  { id: 'sharing', label: 'Sharing and giving' },
  { id: 'trying', label: 'Trying new things' },
  { id: 'friendship', label: 'The value of friendship' },
  { id: 'family', label: 'Family and love' },
];

const SIDEKICK_TYPES = [
  'Dog', 'Cat', 'Rabbit', 'Bear (toy)', 'Dragon', 'Unicorn', 'Fox', 'Owl'
];

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [form, setForm] = useState({
    child_name: '',
    age: 4,
    pronouns: 'she',
    hair_color: 'Brown',
    eye_color: 'Brown',
    skin_tone: 'medium-light',
    theme: 'dinosaur',
    moral: 'none',
    sidekick_name: '',
    sidekick_type: 'Dog',
    has_sidekick: false,
  });

  const update = (key: string, value: string | number | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const childName = form.child_name.trim();
  const ctaText = loading
    ? `Creating the book...`
    : childName ? `Create ${childName}'s book` : 'Create the book';

  const handleSubmit = async () => {
    if (!form.child_name.trim()) {
      alert("Please enter the child's name");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        child_name: form.child_name,
        age: form.age,
        pronouns: form.pronouns,
        hair_color: form.hair_color,
        eye_color: form.eye_color,
        skin_tone: form.skin_tone,
        theme: form.theme,
        moral: form.moral,
        sidekick: form.has_sidekick
          ? `${form.sidekick_name || 'a'} the ${form.sidekick_type}`
          : null,
      };
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      router.push(`/loading?jobId=${data.job_id}`);
    } catch (err) {
      router.push('/error-page');
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

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
            <p className="text-xs text-gray-400 mt-2">
              🔒 We only use this name to write the story — we never store your child's personal data.
            </p>
          </div>

          {/* Age + Pronouns */}
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
                Pronouns
              </label>
              <div className="flex gap-2">
                {PRONOUNS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => update('pronouns', p.id)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                      form.pronouns === p.id
                        ? 'border-amber-400 bg-amber-50 text-amber-800'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {p.label.split(' / ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skin tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Skin tone
            </label>
            <div className="flex gap-3">
              {SKIN_TONES.map(tone => (
                <button
                  key={tone.id}
                  onClick={() => update('skin_tone', tone.id)}
                  title={tone.label}
                  className={`w-10 h-10 rounded-full transition-all border-2 ${
                    form.skin_tone === tone.id
                      ? 'border-amber-400 scale-110'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: tone.color }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {SKIN_TONES.find(t => t.id === form.skin_tone)?.label}
            </p>
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

          {/* Sidekick */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Add a sidekick companion?
              </label>
              <button
                onClick={() => update('has_sidekick', !form.has_sidekick)}
                className={`relative w-11 h-6 rounded-full transition-all ${
                  form.has_sidekick ? 'bg-amber-400' : 'bg-gray-200'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  form.has_sidekick ? 'left-6' : 'left-1'
                }`}/>
              </button>
            </div>
            {form.has_sidekick && (
              <div className="grid grid-cols-2 gap-3 mt-3 p-4 bg-amber-50 rounded-xl">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Sidekick's name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Buster"
                    value={form.sidekick_name}
                    onChange={e => update('sidekick_name', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Type of companion
                  </label>
                  <select
                    value={form.sidekick_type}
                    onChange={e => update('sidekick_type', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm text-gray-900 bg-white"
                  >
                    {SIDEKICK_TYPES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Moral */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What should the story be about?
            </label>
            <select
              value={form.moral}
              onChange={e => update('moral', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-900"
            >
              {MORALS.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
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
                  onMouseEnter={() => setHoveredTheme(theme.id)}
                  onMouseLeave={() => setHoveredTheme(null)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.theme === theme.id
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <span className="text-2xl">{theme.emoji}</span>
                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {theme.label}
                  </p>
                  {(hoveredTheme === theme.id || form.theme === theme.id) && (
                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                      {theme.sample}
                    </p>
                  )}
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
            {ctaText}
          </button>

        </div>
      </div>
    </main>
  );
}