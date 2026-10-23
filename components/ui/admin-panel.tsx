import type { ReactNode } from 'react';

export function AdminPanel({ title, description, children }: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="admin-section admin-panel">
      {(title || description) && (
        <div className="admin-section-heading">
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
