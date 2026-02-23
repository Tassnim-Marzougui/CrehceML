import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  crecheNom: string
  totalPredictions: number
  distribution: Record<string, number>
}

const CLASS_LABELS: Record<string, string> = {
  not_recom:  'Non recommandé',
  recommend:  'Recommandé',
  very_recom: 'Très recommandé',
  priority:   'Prioritaire',
  spec_prior: 'Priorité spéciale',
}

function generateResponse(input: string, crecheNom: string, totalPredictions: number, distribution: Record<string, number>): string {
  const q = input.toLowerCase()

  // Stats
  if (q.includes('stat') || q.includes('analyse') || q.includes('chiffre') || q.includes('nombre')) {
    const total = totalPredictions
    if (total === 0) return `📊 La crèche "${crecheNom}" n'a pas encore de prédictions enregistrées. Commencez par utiliser le formulaire de prédiction !`
    const dominant = Object.entries(distribution).sort(([,a],[,b]) => (b as number) - (a as number))[0]
    const pct = dominant ? Math.round((dominant[1] as number) / total * 100) : 0
    return `📊 **Statistiques de "${crecheNom}"**\n\n• Total prédictions : ${total}\n• Décision dominante : ${CLASS_LABELS[dominant?.[0]] || dominant?.[0]} (${pct}%)\n${Object.entries(distribution).map(([k,v]) => `• ${CLASS_LABELS[k] || k} : ${v}`).join('\n')}\n\n💡 ${pct > 60 ? `La majorité des demandes sont "${CLASS_LABELS[dominant?.[0]]}" — votre crèche a un profil de demandes ${dominant?.[0] === 'not_recom' ? 'difficiles' : 'favorables'}.` : 'La distribution est variée, ce qui reflète une diversité de profils de demandeurs.'}`
  }

  // Conseils admission
  if (q.includes('conseil') || q.includes('admission') || q.includes('améliorer') || q.includes('astuce')) {
    return `💡 **Conseils pour les admissions**\n\n1. **Priorisez** les dossiers "Priorité spéciale" et "Prioritaire" en premier\n2. **Vérifiez** l'état de santé — c'est le facteur le plus influent du modèle\n3. **Utilisez le batch** pour traiter plusieurs dossiers d'un coup en début d'année\n4. **Documentez** les refus avec la raison ML pour plus de transparence\n5. **Réévaluez** les dossiers "Non recommandé" après 3 mois si la situation change`
  }

  // Classes ML
  if (q.includes('classe') || q.includes('catégorie') || q.includes('signifie') || q.includes('expliquer') || q.includes('différence')) {
    return `📚 **Les 5 classes du modèle ML**\n\n🟢 **Recommandé** : Profil standard favorable\n⭐ **Très recommandé** : Profil optimal, toutes conditions réunies\n🟠 **Prioritaire** : Situation nécessitant attention particulière\n🔵 **Priorité spéciale** : Cas exceptionnel, intervention urgente\n❌ **Non recommandé** : Critères d'admission insuffisants\n\n💡 Le modèle XGBoost analyse 8 critères simultanément avec 100% de précision.`
  }

  // Capacité / places
  if (q.includes('place') || q.includes('capacité') || q.includes('plein') || q.includes('disponible')) {
    return `🏡 Pour gérer les places disponibles :\n\n• Comparez le nombre de dossiers "Recommandé" et "Très recommandé" avec votre capacité\n• Les dossiers "Prioritaire" doivent être traités en premier\n• Utilisez la prédiction batch pour anticiper la demande\n\n💡 Conseil : si vous avez plus de demandes que de places, priorisez dans cet ordre : Priorité spéciale → Prioritaire → Très recommandé → Recommandé`
  }

  // Modèle ML
  if (q.includes('modèle') || q.includes('xgboost') || q.includes('ml') || q.includes('intelligence') || q.includes('ia') || q.includes('algorithme')) {
    return `🤖 **Le modèle ML de votre système**\n\n• **Algorithme** : XGBoost (eXtreme Gradient Boosting)\n• **Accuracy** : 100%\n• **F1-Score** : 100%\n• **Entraîné sur** : 12 960 dossiers réels (dataset UCI Nursery)\n• **Critères analysés** : 8 (parents, garderie, famille, enfants, logement, finances, social, santé)\n\n💡 XGBoost est l'un des algorithmes les plus performants pour ce type de classification.`
  }

  // Bonjour / salut
  if (q.includes('bonjour') || q.includes('salut') || q.includes('hello') || q.includes('bonsoir')) {
    return `Bonjour ! 😊 Je suis votre assistant IA pour la crèche "${crecheNom}". Je peux vous aider avec :\n\n• 📊 Analyser vos statistiques\n• 💡 Donner des conseils d'admission\n• 📚 Expliquer les décisions du modèle ML\n• 🏡 Gérer les places disponibles\n\nQue puis-je faire pour vous ?`
  }

  // Merci
  if (q.includes('merci') || q.includes('super') || q.includes('parfait') || q.includes('bravo')) {
    return `De rien ! 😊 N'hésitez pas si vous avez d'autres questions sur la gestion des admissions.`
  }

  // Réponse par défaut
  return `Je suis votre assistant pour la crèche "${crecheNom}". Voici ce que je peux analyser pour vous :\n\n• 📊 **"Analyser mes stats"** → vue détaillée de vos prédictions\n• 💡 **"Conseils admission"** → meilleures pratiques\n• 📚 **"Expliquer les classes"** → comprendre les décisions ML\n• 🤖 **"Expliquer le modèle"** → détails techniques XGBoost\n\nPosez votre question !`
}

export default function AIChatbot({ crecheNom, totalPredictions, distribution }: Props) {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Bonjour ! Je suis votre assistant IA pour la crèche "${crecheNom}". Je peux vous aider à analyser vos admissions, interpréter les décisions ML et vous donner des conseils. Comment puis-je vous aider ? 😊`
    }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    // Simulation délai de réponse (800ms)
    setTimeout(() => {
      const response = generateResponse(input, crecheNom, totalPredictions, distribution)
      setMessages([...newMessages, { role: 'assistant', content: response }])
      setLoading(false)
    }, 800)
  }

  return (
    <>
      {/* BOUTON FLOTTANT */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-xl flex items-center justify-center text-2xl transition transform hover:scale-110 z-50"
      >
        {open ? '✕' : '🧠'}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-[420px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border border-pink-100 overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-xl">🧠</div>
            <div>
              <p className="text-white font-bold text-sm">Assistant IA</p>
              <p className="text-purple-100 text-xs">Nursery ML Intelligence</p>
            </div>
            <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs mr-1 mt-1 flex-shrink-0">🧠</div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-700 rounded-bl-sm border border-gray-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs mr-1 flex-shrink-0">🧠</div>
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* SUGGESTIONS */}
          {messages.length === 1 && (
            <div className="px-3 py-2 bg-gray-50 flex flex-wrap gap-1 border-t border-gray-100">
              {['Analyser mes stats', 'Conseils admission', 'Expliquer les classes'].map(s => (
                <button key={s} onClick={() => setInput(s)}
                  className="text-xs bg-white hover:bg-purple-50 text-purple-600 border border-purple-200 px-3 py-1 rounded-full transition shadow-sm">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* INPUT */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Votre question..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50 transition hover:scale-110 flex-shrink-0">
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}