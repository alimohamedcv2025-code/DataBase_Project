export function Feedback({ message }) {
  if (!message) return null;
  return (
    <p className={message.error ? 'alert-error' : 'toast'} role={message.error ? 'alert' : 'status'} dir="auto">
      {message.text}
    </p>
  );
}

export function ListStatus({ list }) {
  if (list.loading) return <p className="empty-state" role="status">جاري التحميل…</p>;
  if (!list.error) return null;

  return (
    <div className="alert-error" role="alert">
      <p dir="auto">{list.error}</p>
      <button type="button" className="btn-secondary" onClick={list.refresh}>إعادة المحاولة</button>
    </div>
  );
}
