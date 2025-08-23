// src/pages/EventOptionAddPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addOption, fetchBoard } from '../api';
import Input from '../components/Input';
import Button from '../components/Button';
import Breadcrumbs from '../components/Breadcrumbs';

export default function EventOptionAddPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [eventTitle, setEventTitle] = useState<string>('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBoard(id)
        .then((b) => setEventTitle(b.title))
        .catch(() => setEventTitle(''));
    }
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !name.trim()) return;
    try {
      setSaving(true);
      setError(null);
      await addOption(id, name.trim());
      navigate(`/events/${id}`);
    } catch {
      setError('追加に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  if (!id) {
    return (
      <div
        style={{
          width: '100vw',
          minHeight: '100vh',
          margin: 0,
          background: '#000',
          color: '#fff',
          padding: 20,
          boxSizing: 'border-box',
        }}
      >
        Invalid URL
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        margin: 0,
        backgroundColor: '#000',
        color: '#fff',
        padding: 20,
        boxSizing: 'border-box',
      }}
    >
      <Breadcrumbs
        items={[
          { label: 'Event List', to: '/' },
          { label: eventTitle || id!, to: `/events/${id}` },
          { label: '選択肢の追加' },
        ]}
      />
      <div style={{ padding: 20, boxSizing: 'border-box' }}></div>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ color: '#e53935', marginTop: 0 }}>選択肢の追加</h1>
        <div style={{ marginBottom: 16, color: '#aaa' }}>
          イベント: {eventTitle || id}
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 12 }}>
          <Input
            placeholder="選択肢名を入力"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            type="submit"
            disabled={saving || !name.trim()}
            style={{ minWidth: 80 }}
          >
            {saving ? '追加中...' : '追加'}
          </Button>
        </form>

        {error && (
          <div style={{ color: 'crimson', marginTop: 12 }}>{error}</div>
        )}
      </div>
    </div>
  );
}
