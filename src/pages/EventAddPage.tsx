import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api';
import Input from '../components/Input';
import Button from '../components/Button';
import Breadcrumbs from '../components/Breadcrumbs';

export default function EventAddPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setSaving(true);
      setError(null);
      await createEvent(title.trim());
      navigate('/'); // 作成後に一覧へ戻る
    } catch {
      setError('作成に失敗した');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        margin: 0,
        backgroundColor: '#000',
        color: '#fff',
        boxSizing: 'border-box',
        padding: 20,
      }}
    >
      <Breadcrumbs
        items={[{ label: 'Event List', to: '/' }, { label: 'Event追加' }]}
      />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
        <h1 style={{ color: '#e53935', marginTop: 0 }}>Event追加</h1>
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 12 }}>
          <Input
            placeholder="タイトルを入力"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button
            type="submit"
            disabled={saving || !title.trim()}
            style={{ minWidth: 100 }}
          >
            {saving ? '作成中...' : '作成'}
          </Button>
        </form>
        {error && (
          <div style={{ color: 'crimson', marginTop: 12 }}>{error}</div>
        )}
      </div>
    </div>
  );
}
