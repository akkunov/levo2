import type { LucideIcon } from 'lucide-react';

type AdminStatCardProps = {
  label: string;
  value: string | number;
  caption: string;
  icon: LucideIcon;
};

export function AdminStatCard({ label, value, caption, icon: Icon }: AdminStatCardProps) {
  return (
    <article className="admin-stat-card">
      <div className="admin-stat-top">
        <span>{label}</span>
        <Icon size={20} aria-hidden="true" />
      </div>
      <strong>{value}</strong>
      <span className="admin-stat-caption">{caption}</span>
    </article>
  );
}
