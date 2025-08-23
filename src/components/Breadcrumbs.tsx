import { Link } from 'react-router-dom';

type Crumb = { label: string; to?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      style={{
        width: '100%',
        background: '#000',
        color: '#fff',
        padding: '12px 20px',
        boxSizing: 'border-box',
        borderBottom: '1px solid #222',
      }}
      aria-label="breadcrumbs"
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <span
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {it.to && !isLast ? (
                <Link
                  to={it.to}
                  style={{ color: '#e53935', textDecoration: 'none' }}
                >
                  {it.label}
                </Link>
              ) : (
                <span style={{ color: isLast ? '#fff' : '#ccc' }}>
                  {it.label}
                </span>
              )}
              {!isLast && <span style={{ color: '#e53935' }}>{'>'}</span>}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
