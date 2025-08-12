"use client";

import Link from 'next/link';
import { useState } from 'react';
import UploadDropzone from '../imports/upload-dropzone';

const steps = [
  'Välj artist',
  'Koppla YouTube',
  'Ladda upp statements',
  'Kontrakt (kort)',
  'Map ISRC ↔ ISWC',
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Onboarding</h1>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {steps.map((label, idx) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full grid place-items-center border ${idx <= step ? 'bg-black text-white border-black' : 'bg-white text-gray-600'}`}>{idx+1}</div>
            <span>{label}</span>
            {idx < steps.length - 1 && <span className="mx-2">→</span>}
          </div>
        ))}
      </div>

      {step === 0 && <StepArtist onNext={() => setStep(1)} />}
      {step === 1 && <StepYouTube onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && <StepUploads onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <StepContracts onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <StepMap onNext={() => {}} onBack={() => setStep(3)} />}

      {step === 4 && (
        <div className="pt-6">
          <Link href="/dashboard" className="inline-block rounded bg-black text-white px-4 py-2">Gå till Dashboard</Link>
        </div>
      )}
    </main>
  );
}

function StepArtist({ onNext }: { onNext: () => void }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium">Steg 1: Välj artist</h2>
      <p className="text-gray-600">Sök via Spotify eller lägg till manuellt.</p>
      <div className="flex gap-3">
        <button className="rounded bg-black text-white px-4 py-2">Sök Spotify</button>
        <button className="rounded border px-4 py-2">Lägg till manuellt</button>
      </div>
      <div>
        <button onClick={onNext} className="rounded bg-black text-white px-4 py-2">Fortsätt</button>
      </div>
    </section>
  );
}

function StepYouTube({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium">Steg 2: Koppla YouTube</h2>
      <p className="text-gray-600">Koppla ditt YouTube-konto för att hämta Analytics.</p>
      <button className="rounded bg-red-600 text-white px-4 py-2">Koppla Google</button>
      <div className="flex gap-3">
        <button onClick={onBack} className="rounded border px-4 py-2">Tillbaka</button>
        <button onClick={onNext} className="rounded bg-black text-white px-4 py-2">Fortsätt</button>
      </div>
    </section>
  );
}

function StepUploads({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium">Steg 3: Ladda upp statements</h2>
      <div className=""><UploadDropzone /></div>
      <div className="flex gap-3">
        <button onClick={onBack} className="rounded border px-4 py-2">Tillbaka</button>
        <button onClick={onNext} className="rounded bg-black text-white px-4 py-2">Importera och fortsätt</button>
      </div>
    </section>
  );
}

function StepContracts({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium">Steg 4: Kontrakt (kort)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h3 className="font-medium">Master</h3>
          <div className="text-sm text-gray-600">Avgifter, advances, kostnadspool.</div>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-medium">Publishing</h3>
          <div className="text-sm text-gray-600">Splits och admin fee.</div>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-medium">Närstående</h3>
          <div className="text-sm text-gray-600">Featured / non-featured %-split.</div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="rounded border px-4 py-2">Tillbaka</button>
        <button onClick={onNext} className="rounded bg-black text-white px-4 py-2">Fortsätt</button>
      </div>
    </section>
  );
}

function StepMap({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium">Steg 5: Map ISRC ↔ ISWC</h2>
      <div className="border rounded p-4 text-gray-600">Tabell med auto-suggests kommer här.</div>
      <div className="flex gap-3">
        <button onClick={onBack} className="rounded border px-4 py-2">Tillbaka</button>
        <button onClick={onNext} className="rounded bg-black text-white px-4 py-2">Gå vidare</button>
      </div>
    </section>
  );
}