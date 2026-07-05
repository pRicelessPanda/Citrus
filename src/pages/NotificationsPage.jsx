import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, MessageSquare, Users, Calendar, FlaskConical, UserPlus, Mail } from 'lucide-react';
import PageHeader, { PageBody } from '../components/PageHeader.jsx';
import { Button, EmptyState, Badge, useToast, timeAgo } from '../components/ui.jsx';
import { useStore } from '../store.js';

const ICONS = {
  Forum: MessageSquare,
  Collaboration: Users,
  Messaging: Mail,
  Research: FlaskConical,
  Authors: Bell,
  Friends: UserPlus,
  Calendar: Calendar,
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const notifications = useStore((s) => s.notifications);
  const markNotification = useStore((s) => s.markNotification);
  const markAll = useStore((s) => s.markAllNotifications);
  const deleteNotification = useStore((s) => s.deleteNotification);
  const clearAll = useStore((s) => s.clearNotifications);

  return (
    <>
      <PageHeader
        title="Notifications"
        right={
          notifications.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAll}>
                <Check size={15} /> Mark all read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            </div>
          )
        }
      />
      <PageBody>
        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" />
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const Icon = ICONS[n.category] || Bell;
              return (
                <div
                  key={n.id}
                  className={`group flex items-start gap-3 rounded-xl border p-4 ${n.read ? 'border-line bg-white' : 'border-info/30 bg-info-light/40'}`}
                >
                  <div className={`rounded-lg p-2 ${n.read ? 'bg-page text-muted' : 'bg-info text-white'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge>{n.category}</Badge>
                      <span className="text-xs text-muted">{timeAgo(n.at)}</span>
                    </div>
                    <button
                      onClick={() => { markNotification(n.id, true); navigate(n.to); }}
                      className="mt-1 block cursor-pointer text-left text-sm text-ink hover:text-info"
                    >
                      {n.text}
                    </button>
                    {n.action === 'invite' && (
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="success" onClick={() => { toast('Invitation accepted'); markNotification(n.id, true); }}>
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { toast('Invitation declined'); deleteNotification(n.id); }}>
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => markNotification(n.id, !n.read)}
                      title={n.read ? 'Mark unread' : 'Mark read'}
                      className="cursor-pointer rounded-lg p-1.5 text-muted hover:bg-black/5"
                    >
                      <Check size={15} />
                    </button>
                    <button onClick={() => deleteNotification(n.id)} className="cursor-pointer rounded-lg p-1.5 text-muted hover:text-danger">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageBody>
    </>
  );
}
