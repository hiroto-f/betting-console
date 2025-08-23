// src/pages/EventDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchBoard,
  placeBet,
  fetchOptionBets,
  Board,
  Bet as BetType,
} from '../api';
import Input from '../components/Input';
import Button from '../components/Button';
import Breadcrumbs from '../components/Breadcrumbs';

type BetInputs = Record<string, { amount?: number; username?: string }>;
type ToggleMap = Record<string, boolean>;

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board | null>(null);

  // 行ごとの Bet 入力/詳細表示状態
  const [betInputs, setBetInputs] = useState<BetInputs>({});
  const [showBetForm, setShowBetForm] = useState<ToggleMap>({});
  const [showDetails, setShowDetails] = useState<ToggleMap>({});
  const [betsCache, setBetsCache] = useState<Record<string, BetType[]>>({}); // optionId -> bets

  async function reload() {
    if (!id) return;
    const data = await fetchBoard(id);
    setBoard(data);
  }

  useEffect(() => {
    if (!id) return;
    let alive = true;
    async function load() {
      if (alive && typeof id === 'string') setBoard(await fetchBoard(id));
    }
    load();
    const t = setInterval(load, 3000); // 3秒毎に更新
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [id]);

  function updateInput(
    optionId: string,
    patch: Partial<{ amount: number; username: string }>
  ) {
    setBetInputs((prev) => ({
      ...prev,
      [optionId]: { ...prev[optionId], ...patch },
    }));
  }

  async function handlePlaceBet(optionId: string) {
    const amt = betInputs[optionId]?.amount ?? 0;
    const user = (betInputs[optionId]?.username || '').trim();
    if (amt <= 0 || !user) return;
    await placeBet(optionId, amt, user);
    // 入力リセット & 再描画
    setBetInputs((prev) => ({
      ...prev,
      [optionId]: { amount: undefined, username: '' },
    }));
    await reload();
    // 詳細表示中なら最新のbetsも更新
    if (showDetails[optionId]) {
      const list = await fetchOptionBets(optionId);
      setBetsCache((prev) => ({ ...prev, [optionId]: list }));
    }
  }

  async function toggleDetails(optionId: string) {
    const willShow = !showDetails[optionId];
    setShowDetails((prev) => ({ ...prev, [optionId]: willShow }));
    if (willShow && !betsCache[optionId]) {
      const list = await fetchOptionBets(optionId);
      setBetsCache((prev) => ({ ...prev, [optionId]: list }));
    }
  }

  if (!board) {
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
        Loading...
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
        boxSizing: 'border-box',
        padding: 20,
      }}
    >
      <Breadcrumbs
        items={[
          { label: 'Event List', to: '/' },
          { label: board.title || board.event_id },
        ]}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
        <h1 style={{ color: '#e53935', margin: 0 }}>{board.title}</h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ color: '#e53935', marginTop: 20 }}>投票状況</h2>
          <Button
            onClick={() => navigate(`/events/${board.event_id}/options/new`)}
          >
            選択肢の追加
          </Button>
        </div>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#111',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  borderBottom: '2px solid #e53935',
                  padding: 10,
                  textAlign: 'left',
                }}
              >
                Option
              </th>
              <th
                style={{
                  borderBottom: '2px solid #e53935',
                  padding: 10,
                  textAlign: 'right',
                }}
              >
                Stake
              </th>
              <th
                style={{
                  borderBottom: '2px solid #e53935',
                  padding: 10,
                  textAlign: 'right',
                }}
              >
                Odds
              </th>
              <th style={{ borderBottom: '2px solid #e53935', padding: 10 }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {board.options.map((opt) => {
              const oId = opt.option_id;
              const formOpen = !!showBetForm[oId];
              const detailsOpen = !!showDetails[oId];
              const inputs = betInputs[oId] || {};
              return (
                <FragmentRow
                  key={oId}
                  opt={opt}
                  formOpen={formOpen}
                  detailsOpen={detailsOpen}
                  inputs={inputs}
                  onToggleForm={() =>
                    setShowBetForm((prev) => ({ ...prev, [oId]: !prev[oId] }))
                  }
                  onToggleDetails={() => toggleDetails(oId)}
                  onChangeAmount={(v) => updateInput(oId, { amount: v })}
                  onChangeUser={(v) => updateInput(oId, { username: v })}
                  onSubmit={() => handlePlaceBet(oId)}
                  bets={betsCache[oId] || []}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FragmentRow({
  opt,
  formOpen,
  detailsOpen,
  inputs,
  onToggleForm,
  onToggleDetails,
  onChangeAmount,
  onChangeUser,
  onSubmit,
  bets,
}: {
  opt: {
    option_id: string;
    name: string;
    total_amount: string;
    odds: number | null;
  };
  formOpen: boolean;
  detailsOpen: boolean;
  inputs: { amount?: number; username?: string };
  onToggleForm: () => void;
  onToggleDetails: () => void;
  onChangeAmount: (v: number) => void;
  onChangeUser: (v: string) => void;
  onSubmit: () => void;
  bets: BetType[];
}) {
  return (
    <>
      {/* 表示行 */}
      <tr>
        <td style={{ padding: 10, borderBottom: '1px solid #222' }}>
          {opt.name}
        </td>
        <td
          style={{
            padding: 10,
            borderBottom: '1px solid #222',
            textAlign: 'right',
          }}
        >
          {opt.total_amount}
        </td>
        <td
          style={{
            padding: 10,
            borderBottom: '1px solid #222',
            textAlign: 'right',
          }}
        >
          {opt.odds ? opt.odds.toFixed(2) : '-'}
        </td>
        <td style={{ padding: 10, borderBottom: '1px solid #222' }}>
          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button variant="secondary" onClick={onToggleDetails}>
              詳細
            </Button>
            <Button onClick={onToggleForm}>Bet</Button>
          </div>
        </td>
      </tr>

      {/* Betフォーム行（トグル） */}
      {formOpen && (
        <tr>
          <td
            colSpan={4}
            style={{
              padding: 12,
              borderBottom: '1px solid #222',
              background: '#0b0b0b',
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 140 }}>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={inputs.amount ?? ''}
                  onChange={(e) => onChangeAmount(Number(e.target.value))}
                  style={{ width: 140 }}
                />
              </div>
              <div style={{ width: 220 }}>
                <Input
                  placeholder="User name"
                  value={inputs.username ?? ''}
                  onChange={(e) => onChangeUser(e.target.value)}
                  style={{ width: 220 }}
                />
              </div>
              <Button
                onClick={onSubmit}
                disabled={
                  !inputs.username ||
                  !inputs.amount ||
                  (inputs.amount ?? 0) <= 0
                }
              >
                送信
              </Button>
            </div>
          </td>
        </tr>
      )}

      {/* 詳細（bets一覧）行（トグル） */}
      {detailsOpen && (
        <tr>
          <td
            colSpan={4}
            style={{
              padding: 12,
              borderBottom: '1px solid #222',
              background: '#0b0b0b',
            }}
          >
            {bets.length === 0 ? (
              <div style={{ color: '#aaa' }}>まだ投票はない</div>
            ) : (
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  background: '#111',
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        borderBottom: '1px solid #333',
                        textAlign: 'left',
                        padding: 8,
                      }}
                    >
                      User
                    </th>
                    <th
                      style={{
                        borderBottom: '1px solid #333',
                        textAlign: 'right',
                        padding: 8,
                      }}
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        borderBottom: '1px solid #333',
                        textAlign: 'left',
                        padding: 8,
                      }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bets.map((b) => (
                    <tr key={b.id}>
                      <td style={{ padding: 8 }}>{b.username}</td>
                      <td style={{ padding: 8, textAlign: 'right' }}>
                        {b.amount}
                      </td>
                      <td style={{ padding: 8 }}>
                        {new Date(b.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
