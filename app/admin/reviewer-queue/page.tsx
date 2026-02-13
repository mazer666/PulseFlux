'use client';

import { useMemo, useState } from 'react';

type QueueStatus = 'reviewed' | 'approved' | 'draft' | 'deprecated';
type QueueAction = 'approve' | 'request_edit' | 'reject' | 'deprecate' | 'escalate';

type QueueItem = {
  entryId: string;
  language: 'de' | 'en' | 'fr' | 'es';
  word: string;
  clueText: string;
  autoFlags: string[];
  scoreSummary: { readability: number; similarity: number; ambiguity: number };
  sourceTrace: string;
  status: QueueStatus;
};

const initialItems: QueueItem[] = [
  {
    entryId: 'de-haus-001',
    language: 'de',
    word: 'Haus',
    clueText: 'Ort, in dem eine Familie wohnen kann',
    autoFlags: [],
    scoreSummary: { readability: 0.92, similarity: 0.1, ambiguity: 0.08 },
    sourceTrace: 'Wiktionary | CC-BY-SA-3.0',
    status: 'reviewed'
  },
  {
    entryId: 'en-tree-004',
    language: 'en',
    word: 'tree',
    clueText: 'Tall plant with trunk and branches',
    autoFlags: ['similarity_flag'],
    scoreSummary: { readability: 0.83, similarity: 0.9, ambiguity: 0.12 },
    sourceTrace: 'WordNet | Princeton License',
    status: 'reviewed'
  },
  {
    entryId: 'fr-livre-009',
    language: 'fr',
    word: 'livre',
    clueText: 'Objet avec des pages que l’on lit',
    autoFlags: [],
    scoreSummary: { readability: 0.89, similarity: 0.15, ambiguity: 0.11 },
    sourceTrace: 'Wiktionary | CC-BY-SA-3.0',
    status: 'reviewed'
  }
];

function nextStatus(action: QueueAction): QueueStatus {
  if (action === 'approve') return 'approved';
  if (action === 'request_edit') return 'draft';
  if (action === 'escalate') return 'reviewed';
  return 'deprecated';
}

export default function ReviewerQueueAdminPage() {
  const [items, setItems] = useState<QueueItem[]>(initialItems);
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | QueueItem['language']>('all');

  const filteredItems = useMemo(
    () => items.filter((item) => selectedLanguage === 'all' || item.language === selectedLanguage),
    [items, selectedLanguage]
  );

  const applyAction = (entryId: string, action: QueueAction) => {
    setItems((prev) => prev.map((item) => (item.entryId === entryId ? { ...item, status: nextStatus(action) } : item)));
  };

  return (
    <main style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Reviewer Queue Admin UI</h1>
      <p style={{ marginTop: 0, color: '#444' }}>
        Phase 1 MVP Oberfläche für Freigabe, Nachbearbeitung und Eskalation.
      </p>

      <label htmlFor="lang-filter">Sprache filtern: </label>
      <select
        id="lang-filter"
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value as 'all' | QueueItem['language'])}
        style={{ marginBottom: '1rem' }}
      >
        <option value="all">Alle</option>
        <option value="de">Deutsch</option>
        <option value="en">Englisch</option>
        <option value="fr">Französisch</option>
        <option value="es">Spanisch</option>
      </select>

      <div style={{ display: 'grid', gap: '0.8rem' }}>
        {filteredItems.map((item) => (
          <section key={item.entryId} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '0.9rem' }}>
            <strong>
              {item.entryId} · {item.language.toUpperCase()} · {item.word}
            </strong>
            <p style={{ margin: '0.5rem 0' }}>{item.clueText}</p>
            <p style={{ margin: '0.2rem 0' }}>
              Status: <b>{item.status}</b>
            </p>
            <p style={{ margin: '0.2rem 0' }}>Flags: {item.autoFlags.join(', ') || 'none'}</p>
            <p style={{ margin: '0.2rem 0' }}>Quelle: {item.sourceTrace}</p>
            <p style={{ margin: '0.2rem 0 0.5rem' }}>
              Scores — readability {item.scoreSummary.readability.toFixed(2)}, similarity{' '}
              {item.scoreSummary.similarity.toFixed(2)}, ambiguity {item.scoreSummary.ambiguity.toFixed(2)}
            </p>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button onClick={() => applyAction(item.entryId, 'approve')}>Approve</button>
              <button onClick={() => applyAction(item.entryId, 'request_edit')}>Request edit</button>
              <button onClick={() => applyAction(item.entryId, 'escalate')}>Escalate</button>
              <button onClick={() => applyAction(item.entryId, 'reject')}>Reject</button>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
