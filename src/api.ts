export type Event = { id: string; title: string };
export type Option = {
  option_id: string;
  name: string;
  total_amount: string;
  odds: number | null;
};
export type Board = {
  event_id: string;
  title: string;
  total_pool: string;
  options: Option[];
};
export type Bet = {
  id: string;
  option: string;
  username: string;
  amount: string;
  created_at: string;
};

// Event 一覧
export async function fetchEvents(page = 1, search = '') {
  const params = new URLSearchParams();
  params.append('page', String(page));
  if (search) params.append('search', search);

  const r = await fetch(
    `${import.meta.env.VITE_API_URL}/events/?${params.toString()}`
  );
  if (!r.ok) throw new Error('Failed to fetch events');
  return r.json();
}

// Event 詳細 (board)
export async function fetchBoard(eventId: string): Promise<Board> {
  const r = await fetch(
    `${import.meta.env.VITE_API_URL}/events/${eventId}/board/`
  );
  if (!r.ok) throw new Error('Failed to fetch board');
  return r.json();
}

// Option 追加
export async function addOption(eventId: string, name: string) {
  const r = await fetch(
    `${import.meta.env.VITE_API_URL}/events/${eventId}/add_option/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    }
  );
  return r.json();
}

// Bet 投票
export async function placeBet(
  optionId: string,
  amount: number,
  username: string
) {
  const r = await fetch(`${import.meta.env.VITE_API_URL}/bets/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ option: optionId, amount, username }),
  });
  if (!r.ok) throw new Error('Failed to place bet');
  return r.json();
}

export async function fetchOptionBets(optionId: string): Promise<Bet[]> {
  const r = await fetch(
    `${import.meta.env.VITE_API_URL}/options/${optionId}/bets/`
  );
  if (!r.ok) throw new Error('Failed to fetch option bets');
  return r.json();
}

export async function createEvent(title: string) {
  const r = await fetch(`${import.meta.env.VITE_API_URL}/events/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!r.ok) throw new Error('Failed to create event');
  return r.json();
}
