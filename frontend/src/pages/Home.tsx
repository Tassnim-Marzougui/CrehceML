import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-blue-100 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/60 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-200/50 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-pink-200/50 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-yellow-200/50 rounded-full blur-2xl"></div>
        <div className="absolute top-1/4 left-5 text-6xl opacity-20 rotate-12">☁️</div>
        <div className="absolute bottom-1/3 right-5 text-7xl opacity-20 -rotate-12">☁️</div>
        <div className="absolute top-2/3 left-1/4 text-4xl opacity-10">🐻</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-10">🧸</div>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 bg-white/70 backdrop-blur-sm border-b border-pink-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce">🐣</span>
          <span className="font-bold text-lg text-gray-800">Nursery ML</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-pink-600 transition"
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 text-sm bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white rounded-full transition shadow-md"
          >
            S'inscrire
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center relative z-10">
        <div className="text-7xl mb-6 animate-bounce">🐻‍❄️</div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          Nursery ML
        </h1>
        <p className="text-xl text-gray-600 mb-3">
          Système intelligent de prédiction d'admission en crèche
        </p>
        <p className="text-gray-500 text-sm mb-10 max-w-xl mx-auto bg-white/30 p-3 rounded-2xl backdrop-blur-sm">
          Basé sur le modèle XGBoost entraîné sur le dataset UCI Nursery.
          Aide les modérateurs à prendre des décisions d'admission objectives et rapides.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white font-semibold rounded-full text-sm transition transform hover:scale-105 shadow-lg"
          >
            Créer un compte crèche →
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-700 font-semibold rounded-full text-sm transition border border-pink-200 shadow-lg"
          >
            Se connecter
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-5xl mx-auto px-6 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-gray-800 mb-2">Prédiction ML</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Modèle XGBoost avec F1-Score de 100% entraîné sur 12 960 demandes réelles.
              Résultat instantané avec score de confiance.
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-800 mb-2">Dashboard complet</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Visualisez la distribution des admissions, le taux d'acceptation
              et les statistiques de votre crèche en temps réel.
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/40">
            <div className="text-3xl mb-3">📁</div>
            <h3 className="font-semibold text-gray-800 mb-2">Traitement par lot</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Uploadez un fichier CSV avec plusieurs demandes et téléchargez
              les résultats en quelques secondes.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40">
          <h2 className="text-center text-lg font-semibold text-gray-700 mb-6">
            Performance du modèle ML
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-green-500">100%</p>
              <p className="text-xs text-gray-500 mt-1">Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-500">100%</p>
              <p className="text-xs text-gray-500 mt-1">F1-Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-500">12 960</p>
              <p className="text-xs text-gray-500 mt-1">Instances d'entraînement</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-500">5</p>
              <p className="text-xs text-gray-500 mt-1">Classes de décision</p>
            </div>
          </div>
        </div>

        {/* CLASSES */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Recommandé', color: '#22c55e', cls: 'recommend' },
            { label: 'Très recommandé', color: '#4ade80', cls: 'very_recom' },
            { label: 'Prioritaire', color: '#f59e0b', cls: 'priority' },
            { label: 'Priorité spéciale', color: '#38bdf8', cls: 'spec_prior' },
            { label: 'Non recommandé', color: '#ef4444', cls: 'not_recom' },
          ].map((item) => (
            <div
              key={item.cls}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 text-center shadow-lg border border-white/40"
            >
              <p className="text-xs font-semibold" style={{ color: item.color }}>
                {item.label}
              </p>
              <p className="text-xs text-gray-500 mt-1 font-mono">{item.cls}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-pink-200 bg-white/30 backdrop-blur-sm py-6 text-center text-gray-500 text-xs">
        <p>🍼 Nursery ML — Python for Data Science 2 — XGBoost + FastAPI + React</p>
        <p className="mt-1">🧸 Des prédictions aussi douces qu'un câlin</p>
      </footer>
    </div>
  );
}