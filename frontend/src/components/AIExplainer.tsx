import { useState } from 'react'

interface Props {
  prediction: string
  confidence: number
  probabilities: Record<string, number>
  formData: Record<string, string>
}

const CLASS_LABELS: Record<string, string> = {
  recommend:  'Recommandé',
  very_recom: 'Très recommandé',
  priority:   'Prioritaire',
  spec_prior: 'Priorité spéciale',
  not_recom:  'Non recommandé',
}

// Analyse intelligente basée sur les données réelles
function generateExplanation(prediction: string, formData: Record<string, string>, confidence: number): string {
  const factors: string[] = []
  const positifs: string[] = []
  const negatifs: string[] = []

  // Analyse santé
  if (formData.health === 'recommended') positifs.push('état de santé favorable')
  if (formData.health === 'priority') negatifs.push('priorité médicale requise')
  if (formData.health === 'not_recom') negatifs.push('état de santé préoccupant')

  // Analyse logement
  if (formData.housing === 'convenient') positifs.push('conditions de logement convenables')
  if (formData.housing === 'less_conv') factors.push('logement peu convenable')
  if (formData.housing === 'critical') negatifs.push('conditions de logement critiques')

  // Analyse finances
  if (formData.finance === 'convenient') positifs.push('situation financière stable')
  if (formData.finance === 'inconv') negatifs.push('difficultés financières')

  // Analyse sociale
  if (formData.social === 'nonprob') positifs.push('environnement social sain')
  if (formData.social === 'slightly_prob') factors.push('légères difficultés sociales')
  if (formData.social === 'problematic') negatifs.push('situation sociale problématique')

  // Analyse garderie
  if (formData.has_nurs === 'very_crit' || formData.has_nurs === 'critical') negatifs.push('garderie actuelle inadaptée')
  if (formData.has_nurs === 'proper') positifs.push('garderie actuelle de qualité')

  // Analyse structure familiale
  if (formData.form === 'foster') factors.push("famille d'accueil")
  if (formData.form === 'incomplete') factors.push('famille incomplète')
  if (formData.form === 'complete') positifs.push('structure familiale complète')

  // Analyse nombre enfants
  if (formData.children === 'more') negatifs.push('charge familiale importante (3+ enfants)')

  // Génération du texte selon la prédiction
  const conf = (confidence * 100).toFixed(0)

  if (prediction === 'not_recom') {
    return `📋 **Analyse de la décision — Non recommandé (${conf}% de confiance)**\n\n` +
      `🔴 Facteurs défavorables détectés :\n${negatifs.map(n => `• ${n}`).join('\n') || '• Combinaison de facteurs défavorables'}\n\n` +
      `${factors.length > 0 ? `⚠️ Facteurs à surveiller :\n${factors.map(f => `• ${f}`).join('\n')}\n\n` : ''}` +
      `💡 Recommandation : Cette demande ne remplit pas les critères d'admission prioritaires. Il est conseillé d'orienter la famille vers des services d'aide sociale adaptés.`
  }

  if (prediction === 'recommend' || prediction === 'very_recom') {
    return `📋 **Analyse de la décision — ${CLASS_LABELS[prediction]} (${conf}% de confiance)**\n\n` +
      `🟢 Facteurs favorables :\n${positifs.map(p => `• ${p}`).join('\n') || '• Profil globalement favorable'}\n\n` +
      `${negatifs.length > 0 ? `⚠️ Points d'attention :\n${negatifs.map(n => `• ${n}`).join('\n')}\n\n` : ''}` +
      `💡 Recommandation : Ce dossier présente un profil favorable à l'admission. ${prediction === 'very_recom' ? "La famille réunit toutes les conditions optimales." : "L'admission est recommandée sous réserve des places disponibles."}`
  }

  if (prediction === 'priority') {
    return `📋 **Analyse de la décision — Prioritaire (${conf}% de confiance)**\n\n` +
      `🟠 Cette demande a été classée prioritaire en raison de :\n` +
      `${negatifs.map(n => `• ${n}`).join('\n') || '• Situation nécessitant une attention particulière'}\n\n` +
      `${positifs.length > 0 ? `✅ Points positifs :\n${positifs.map(p => `• ${p}`).join('\n')}\n\n` : ''}` +
      `💡 Recommandation : Ce dossier mérite un traitement prioritaire. Une place devrait être réservée en urgence si la capacité le permet.`
  }

  if (prediction === 'spec_prior') {
    return `📋 **Analyse de la décision — Priorité Spéciale (${conf}% de confiance)**\n\n` +
      `🔵 Situation exceptionnelle détectée :\n` +
      `${[...negatifs, ...factors].map(f => `• ${f}`).join('\n') || '• Combinaison de facteurs exceptionnels'}\n\n` +
      `💡 Recommandation : Ce cas nécessite une intervention immédiate. La direction de la crèche devrait examiner ce dossier en priorité absolue et envisager des solutions d'urgence.`
  }

  return `📋 Analyse effectuée avec ${conf}% de confiance. Le modèle XGBoost a analysé les 8 critères et retourné la décision : ${CLASS_LABELS[prediction]}.`
}

export default function AIExplainer({ prediction, confidence, formData }: Props) {
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading]         = useState(false)
  const [open, setOpen]               = useState(false)

  const getExplanation = () => {
    setLoading(true)
    setOpen(true)
    setExplanation('')

    // Simulation d'un délai de réflexion IA (1.5 secondes)
    setTimeout(() => {
      const text = generateExplanation(prediction, formData, confidence)
      setExplanation(text)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="mt-4">
      <button
        onClick={getExplanation}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-2xl py-2.5 text-sm transition disabled:opacity-50 shadow-md"
      >
        {loading ? '⏳ Analyse IA en cours...' : '🧠 Expliquer cette décision par IA'}
      </button>

      {open && (
        <div className="mt-3 bg-purple-50 border border-purple-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-500 text-lg">🧠</span>
            <span className="text-purple-700 font-semibold text-sm">Analyse IA — Assistant Nursery ML</span>
          </div>
          {loading ? (
            <div className="space-y-2">
              <div className="h-3 bg-purple-200 rounded animate-pulse w-full" />
              <div className="h-3 bg-purple-200 rounded animate-pulse w-4/5" />
              <div className="h-3 bg-purple-200 rounded animate-pulse w-3/5" />
              <div className="h-3 bg-purple-200 rounded animate-pulse w-4/5" />
            </div>
          ) : (
            <div className="text-gray-700 text-sm leading-relaxed space-y-1">
              {explanation.split('\n').map((line, i) => (
                <p key={i} className={line.startsWith('📋') ? 'font-bold text-purple-700 mb-2' : ''}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}