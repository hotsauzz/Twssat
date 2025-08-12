import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Royalty Nowcast MVP</h1>
      <p className="text-gray-600">Kom igång genom att påbörja onboarding.</p>
      <Link href="/onboarding" className="inline-block rounded bg-black text-white px-4 py-2">
        Starta Onboarding
      </Link>
    </main>
  );
}