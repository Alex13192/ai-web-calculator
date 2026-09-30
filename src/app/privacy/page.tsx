export default function PrivacyPolicy() {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-8 md:p-16 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-slate-400 mb-4">Last updated: September 30, 2026</p>
        
        <section className="space-y-4 text-slate-300 leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-6">1. Information We Collect</h2>
          <p>Our tool operates entirely client-side in your browser. We do not store, log, or transmit any personal inputs, calculations, or API keys to our servers.</p>
          
          <h2 className="text-xl font-semibold text-white mt-6">2. Cookies and Advertising (Google AdSense)</h2>
          <p>We use Google AdSense to display advertisements. Google, as a third-party vendor, uses cookies to serve ads on our site. Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</p>
          <p>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-cyan-400 underline" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</p>
          
          <h2 className="text-xl font-semibold text-white mt-6">3. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please feel free to reach out via our domain support.</p>
        </section>
        
        <div className="mt-10">
          <a href="/" className="text-cyan-400 hover:underline">&larr; Back to Calculator</a>
        </div>
      </main>
    );
  }