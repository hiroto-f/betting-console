// src/pages/EventListPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, Event } from '../api';
import Button from '../components/Button';
import Input from '../components/Input';
import Breadcrumbs from '../components/Breadcrumbs';

export default function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents(page, search).then((data) => {
      setEvents(data.results);
      setCount(data.count);
    });
  }, [page, search]);

  const totalPages = Math.ceil(count / 30);

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
      <Breadcrumbs items={[{ label: 'Event List' }]} />
      <div style={{ padding: 20, boxSizing: 'border-box' }}></div>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ color: '#e53935', margin: 0 }}>Event List</h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            gap: 12,
          }}
        >
          <Input
            placeholder="Search by ID or Title"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
          <Button
            onClick={() => navigate('/events/new')}
            style={{ minWidth: 150 }}
          >
            イベント追加
          </Button>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#111',
            marginTop: 16,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  borderBottom: '2px solid #e53935',
                  textAlign: 'left',
                  padding: 10,
                }}
              >
                ID
              </th>
              <th
                style={{
                  borderBottom: '2px solid #e53935',
                  textAlign: 'left',
                  padding: 10,
                }}
              >
                Title
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr
                key={ev.id}
                onClick={() => navigate(`/events/${ev.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td style={{ padding: 10, borderBottom: '1px solid #222' }}>
                  {ev.id}
                </td>
                <td style={{ padding: 10, borderBottom: '1px solid #222' }}>
                  {ev.title}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: 'center',
          }}
        >
          <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <span>
            Page {page} / {totalPages || 1}
          </span>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
