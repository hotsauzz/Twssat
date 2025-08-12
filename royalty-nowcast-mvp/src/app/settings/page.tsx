export default function SettingsPage() {
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Inställningar</h1>
      <div className="grid gap-4">
        <div className="border rounded p-4">
          <h2 className="font-medium">Lagg-per-källa</h2>
          <div className="text-sm text-gray-600">Standard: youtube/spotify/apple 60d, stim/sami 120d.</div>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-medium">Valuta</h2>
          <div className="text-sm text-gray-600">BASE_CURRENCY = SEK</div>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-medium">Policy-notiser</h2>
          <div className="text-sm text-gray-600">GDPR, RLS, OAuth tokens krypteras.</div>
        </div>
      </div>
    </main>
  );
}