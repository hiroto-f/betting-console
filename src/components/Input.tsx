// src/components/Input.tsx
import { InputHTMLAttributes, useState } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  errorText?: string;
};

export default function Input({
  label,
  errorText,
  style,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [focus, setFocus] = useState(false);

  const base: React.CSSProperties = {
    width: '100%',
    padding: 10,
    borderRadius: 6,
    border: `1px solid ${errorText ? '#d32f2f' : focus ? '#f44336' : '#e53935'}`,
    backgroundColor: '#111',
    color: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{ width: (style as React.CSSProperties)?.width ?? '100%' }}>
      {label && (
        <div style={{ color: '#e53935', marginBottom: 6, fontSize: 14 }}>
          {label}
        </div>
      )}
      <input
        {...props}
        style={{ ...base, ...style }} // style が最後に展開されるので width も上書きされる
        onFocus={(e) => {
          setFocus(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          onBlur?.(e);
        }}
      />
      {errorText && (
        <div style={{ color: '#d32f2f', marginTop: 6, fontSize: 12 }}>
          {errorText}
        </div>
      )}
    </div>
  );
}
