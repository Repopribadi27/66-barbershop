import { cookies } from 'next/headers';
import { LoginForm } from './components/LoginForm';
import { AdminDashboard } from './components/AdminDashboard';
import { getMembers, getLogs } from './actions';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_token')?.value === process.env.ADMIN_PASSWORD;

  if (!isAdmin) {
    return <LoginForm />;
  }

  const { members } = await getMembers();
  const { logs } = await getLogs();

  return <AdminDashboard initialMembers={members || []} initialLogs={logs || []} />;
}
