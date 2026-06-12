'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('密码错误');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '280px',
      }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>管理员登录</h1>
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
          style={{
            padding: '10px 14px',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius)',
            fontSize: '0.95rem',
            background: 'var(--paper-solid)',
            color: 'var(--ink)',
          }}
        />
        {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 14px',
            background: 'var(--ink)',
            color: 'var(--background)',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: '0.95rem',
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? '登录中…' : '登录'}
        </button>
      </form>
    </div>
  );
}
