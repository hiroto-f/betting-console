import { ButtonHTMLAttributes, useState } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'danger' | 'secondary';
};

export default function Button({
  children,
  variant = 'primary',
  style,
  ...props
}: Props) {
  const [hover, setHover] = useState(false);

  const baseStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: 6,
    padding: '8px 14px',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    fontWeight: 500,
    transition: 'background-color 0.2s, opacity 0.2s',
  };

  let colorStyle: React.CSSProperties;
  switch (variant) {
    case 'primary':
      colorStyle = {
        backgroundColor: hover ? '#f44336' : '#e53935', // hoverで少し明るく
        color: '#fff',
        opacity: props.disabled ? 0.5 : 1,
      };
      break;
    case 'secondary':
      colorStyle = {
        backgroundColor: hover ? '#555' : '#444',
        color: '#fff',
        opacity: props.disabled ? 0.5 : 1,
      };
      break;
    case 'danger':
      colorStyle = {
        backgroundColor: hover ? '#d32f2f' : '#b71c1c',
        color: '#fff',
        opacity: props.disabled ? 0.5 : 1,
      };
      break;
    default:
      colorStyle = {};
  }

  return (
    <button
      {...props}
      style={{ ...baseStyle, ...colorStyle, ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
}
