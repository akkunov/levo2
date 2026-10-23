'use client';

import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Users } from 'lucide-react';
import { createManager, fetchManagers } from '@/lib/api/admin-users';

export default function ManagerManagement() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const managersQuery = useQuery({
    queryKey: ['admin', 'managers'],
    queryFn: fetchManagers,
    retry: false,
  });
  const createMutation = useMutation({
    mutationFn: createManager,
    onSuccess: async () => {
      setName('');
      setEmail('');
      setPassword('');
      setNotice('Менеджер создан. Передайте ему пароль безопасным способом.');
      await queryClient.invalidateQueries({ queryKey: ['admin', 'managers'] });
    },
    onError: (error) => setNotice(error instanceof Error ? error.message : 'Не удалось создать менеджера'),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');
    createMutation.mutate({ name: name.trim(), email: email.trim(), password, role: 'MANAGER' });
  }

  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">LEVO / ACCESS</span>
          <h1>Менеджеры</h1>
          <p>Создание учётных записей с ролью MANAGER.</p>
        </div>
      </div>

      <section className="admin-section admin-panel">
        <div className="admin-section-heading">
          <h2><UserPlus size={19} aria-hidden="true" /> Новый менеджер</h2>
          <p>Пароль будет отправлен только на сервер и не сохраняется в списке.</p>
        </div>
        <form className="admin-form admin-manager-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="manager-name">Имя</label>
            <input id="manager-name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={100} />
          </div>
          <div className="admin-field">
            <label htmlFor="manager-email">Рабочая почта</label>
            <input id="manager-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} />
          </div>
          <div className="admin-field">
            <label htmlFor="manager-password">Временный пароль</label>
            <input id="manager-password" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required minLength={12} maxLength={128} />
          </div>
          <button className="admin-primary-button" type="submit" disabled={createMutation.isPending}>
            <UserPlus size={17} /> {createMutation.isPending ? 'Создаём…' : 'Создать менеджера'}
          </button>
          {notice && <p className={createMutation.isError ? 'admin-error' : 'admin-notice'} role="status">{notice}</p>}
        </form>
      </section>

      <section className="admin-section admin-panel">
        <div className="admin-section-heading">
          <h2><Users size={19} aria-hidden="true" /> Учётные записи</h2>
          <p>Список загружается с защищённого API.</p>
        </div>
        {managersQuery.isPending ? <p>Загрузка списка…</p> :
          managersQuery.isError ? <p className="admin-error">Не удалось загрузить менеджеров. Проверьте, что backend реализует GET /users/admin и доступ разрешён администратору. ({managersQuery.error instanceof Error ? managersQuery.error.message : 'Ошибка API'})</p> :
          managersQuery.data.length === 0 ? <p>Учётных записей пока нет.</p> :
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead><tr><th>Имя</th><th>Email</th><th>Роль</th><th>Статус</th></tr></thead>
              <tbody>{managersQuery.data.map(manager => <tr key={manager.id}>
                <td>{manager.name}</td><td>{manager.email}</td><td>{manager.role}</td>
                <td>{manager.isActive === false ? 'Отключён' : 'Активен'}</td>
              </tr>)}</tbody>
            </table>
          </div>}
      </section>
    </div>
  );
}
