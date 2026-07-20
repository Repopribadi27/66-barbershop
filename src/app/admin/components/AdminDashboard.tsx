'use client';

import { useState } from 'react';
import { logoutAdmin, addMember, updatePoints, deleteMember, editMember } from '../actions';
import { Search, Plus, UserPlus, Scissors, Gift, LogOut, User, Trophy, Users, Trash2, Activity, Edit2, Check, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CircularProgress = ({ value, max = 50 }: { value: number; max?: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(value / max, 1);
  const offset = circumference - percent * circumference;
  const done = value >= max;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
      <svg className="transform -rotate-90 w-12 h-12">
        <circle cx="24" cy="24" r={radius} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
        <circle
          cx="24" cy="24" r={radius}
          fill="transparent"
          stroke={done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'}
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={done ? { filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' } : {}}
        />
      </svg>
      <span className={`absolute text-[11px] font-black ${done ? 'text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]' : 'text-white/40'}`}>{value}</span>
    </div>
  );
};

export function AdminDashboard({ initialMembers, initialLogs }: { initialMembers: any[], initialLogs: any[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [logs, setLogs] = useState(initialLogs);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Sort State
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'almost'>('newest');

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Filter & Sort Logic
  let filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phoneNumber.includes(search)
  );

  if (sortBy === 'highest') {
    filtered.sort((a, b) => b.totalPoints - a.totalPoints);
  } else if (sortBy === 'almost') {
    filtered = filtered.filter(m => m.totalPoints >= 40 && m.totalPoints < 50);
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    const res = await addMember(newName, newPhone);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success('Member berhasil ditambahkan!');
      setNewName('');
      setNewPhone('');
      window.location.reload();
    }
    setIsAdding(false);
  };

  const handlePoints = async (id: string, change: number) => {
    setActionLoading(id);
    const res = await updatePoints(id, change);
    if (!res?.error) {
      toast.success(change > 0 ? `Berhasil menambah ${change} poin!` : 'Reward berhasil diklaim!');
      window.location.reload();
    } else {
      toast.error(res.error);
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus member ${name}?`)) {
      setActionLoading(id);
      const res = await deleteMember(id);
      if (!res?.error) {
        toast.success(`Member ${name} berhasil dihapus`);
        window.location.reload();
      } else {
        toast.error(res.error);
      }
      setActionLoading(null);
    }
  };

  const startEdit = (member: any) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditPhone(member.phoneNumber);
  };

  const saveEdit = async (id: string) => {
    if (!editName || !editPhone) return toast.error('Nama dan No. HP tidak boleh kosong');
    setActionLoading(id);
    const res = await editMember(id, editName, editPhone);
    if (!res?.error) {
      toast.success('Data member diperbarui');
      window.location.reload();
    } else {
      toast.error(res.error);
      setActionLoading(null);
    }
  };

  const totalPoints = members.reduce((s: number, m: any) => s + m.totalPoints, 0);
  const readyToClaim = members.filter((m: any) => m.totalPoints >= 50).length;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-6">
      {/* Header */}
      <div className="gradient-border rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden bg-gradient-to-br from-white/10 to-white/[0.02]">
        <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-border flex items-center justify-center bg-gradient-to-br from-white/12 to-white/[0.02]">
            <Scissors className="w-5 h-5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gradient tracking-tight">Dashboard</h2>
            <p className="text-white/30 text-xs font-medium">{members.length} member terdaftar</p>
          </div>
        </div>
        <Button
          onClick={() => logoutAdmin()}
          variant="outline"
          className="text-white/35 border-white/12 hover:bg-white/8 hover:text-white/70 rounded-xl px-5 py-2.5 font-bold text-[10px] uppercase tracking-[0.15em] bg-transparent transition-all duration-400"
        >
          <LogOut className="w-3.5 h-3.5 mr-2" /> Logout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Member', value: members.length, icon: Users },
          { label: 'Total Poin', value: totalPoints, icon: Scissors },
          { label: 'Siap Klaim', value: readyToClaim, icon: Gift },
        ].map((stat) => (
          <div key={stat.label} className="gradient-border rounded-xl p-5 text-center hover-lift bg-gradient-to-br from-white/8 to-white/[0.01] relative overflow-hidden">
            <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <stat.icon className="w-4 h-4 text-white/15 mx-auto mb-2" />
            <p className="text-3xl font-black text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">{stat.value}</p>
            <p className="text-[9px] font-bold text-white/25 uppercase tracking-[0.15em] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        
        {/* Left Column (Forms & Logs) */}
        <div className="flex flex-col gap-5">
          {/* Add Form */}
          <div className="gradient-border rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-white/8 to-white/[0.01]">
            <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <h3 className="text-[11px] font-black text-white/50 flex items-center gap-2.5 mb-6 uppercase tracking-[0.15em]">
              <UserPlus className="w-4 h-4 text-white/25" />
              Tambah Member
            </h3>
            <form onSubmit={handleAddMember} className="flex flex-col gap-4">
              <div>
                <label className="text-[9px] font-bold text-white/25 uppercase tracking-[0.15em] ml-1 mb-1.5 block">Nama</label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full glass-input text-white rounded-xl py-3.5 px-4 placeholder:text-white/12 text-sm font-medium outline-none"
                  required
                  suppressHydrationWarning
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-white/25 uppercase tracking-[0.15em] ml-1 mb-1.5 block">No. HP</label>
                <input
                  type="tel"
                  placeholder="08xx xxxx xxxx"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full glass-input text-white rounded-xl py-3.5 px-4 placeholder:text-white/12 text-sm font-medium outline-none"
                  required
                  suppressHydrationWarning
                />
              </div>
              <Button
                type="submit"
                disabled={isAdding}
                className="bg-gradient-to-r from-white to-white/85 text-[#0A0A0A] hover:from-white/95 hover:to-white/75 border-none rounded-xl py-6 font-extrabold text-[10px] uppercase tracking-[0.2em] mt-1 btn-glow transition-all duration-500"
                suppressHydrationWarning
              >
                {isAdding ? 'Memproses...' : 'Tambah Member'}
              </Button>
            </form>
          </div>

          {/* Activity Log */}
          <div className="gradient-border rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-white/8 to-white/[0.01]">
            <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <h3 className="text-[11px] font-black text-white/50 flex items-center gap-2.5 mb-5 uppercase tracking-[0.15em]">
              <Activity className="w-4 h-4 text-white/25" />
              Riwayat Aktivitas
            </h3>
            <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2">
              {logs.length === 0 ? (
                <p className="text-white/20 text-xs text-center py-4">Belum ada aktivitas</p>
              ) : (
                logs.map((log: any) => (
                  <div key={log.id} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-medium text-white/80">
                        <span className="font-bold text-white">{log.memberName}</span> • {log.details}
                      </p>
                      <p className="text-[9px] text-white/30 mt-0.5">
                        {new Date(log.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Member List */}
        <div className="lg:col-span-2 gradient-border rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-white/8 to-white/[0.01] h-fit">
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h3 className="text-[11px] font-black text-white/50 flex items-center gap-2.5 uppercase tracking-[0.15em]">
              <Trophy className="w-4 h-4 text-white/25" />
              Daftar Member
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Sort Controls */}
              <div className="flex items-center glass p-1 rounded-lg w-full sm:w-auto">
                <button
                  onClick={() => setSortBy('newest')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${sortBy === 'newest' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/60'}`}
                >Terbaru</button>
                <button
                  onClick={() => setSortBy('highest')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${sortBy === 'highest' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/60'}`}
                >Poin</button>
                <button
                  onClick={() => setSortBy('almost')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${sortBy === 'almost' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/60'}`}
                >Hampir</button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full glass-input text-white rounded-lg py-2 pl-10 pr-3 placeholder:text-white/12 text-xs font-medium outline-none"
                  suppressHydrationWarning
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="glass rounded-xl py-16 flex flex-col items-center justify-center">
                <Search className="w-8 h-8 text-white/[0.06] mb-2" />
                <p className="text-white/20 text-xs font-medium">Tidak ada member</p>
              </div>
            ) : (
              filtered.map((member) => (
                <div
                  key={member.id}
                  className="glass rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 hover:bg-white/[0.08] transition-all duration-400 group relative overflow-hidden"
                >
                  {/* Subtle top line per card */}
                  <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-white/12 to-white/[0.03] border border-white/12 flex items-center justify-center flex-shrink-0 group-hover:from-white/18 group-hover:border-white/20 transition-all duration-400">
                      <User className="w-4 h-4 text-white/35 group-hover:text-white/60 transition-colors duration-300" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      {editingId === member.id ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="glass-input text-white rounded-md px-2 py-1 text-xs outline-none w-full max-w-[200px]"
                            placeholder="Nama"
                          />
                          <input
                            type="tel"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="glass-input text-white rounded-md px-2 py-1 text-xs outline-none w-full max-w-[200px]"
                            placeholder="No HP"
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-bold text-white text-sm truncate group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-all duration-300">{member.name}</h4>
                          <p className="text-white/25 text-[11px] font-medium">{member.phoneNumber}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {!editingId && <CircularProgress value={member.totalPoints} />}

                    <div className="flex items-center glass rounded-lg p-0.5">
                      {editingId === member.id ? (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => saveEdit(member.id)} disabled={actionLoading === member.id} className="text-green-400 hover:text-green-300 hover:bg-green-400/10 px-2.5 h-auto py-1.5"><Check className="w-3.5 h-3.5" /></Button>
                          <div className="w-px h-4 bg-white/[0.08]" />
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="text-white/40 hover:text-white hover:bg-white/10 px-2.5 h-auto py-1.5"><X className="w-3.5 h-3.5" /></Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/30 hover:text-white hover:bg-white/12 rounded-md text-[10px] font-bold px-2.5 py-1.5 h-auto bg-transparent transition-all duration-300"
                            onClick={() => handlePoints(member.id, 5)}
                            disabled={actionLoading === member.id}
                          >
                            <Scissors className="w-3 h-3 mr-1 hidden sm:inline" /> +5
                          </Button>
                          <div className="w-px h-4 bg-white/[0.08]" />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/30 hover:text-white hover:bg-white/12 rounded-md text-[10px] font-bold px-2.5 py-1.5 h-auto bg-transparent transition-all duration-300"
                            onClick={() => handlePoints(member.id, 10)}
                            disabled={actionLoading === member.id}
                          >
                            <Plus className="w-3 h-3 mr-1 hidden sm:inline" /> +10
                          </Button>
                          <div className="w-px h-4 bg-white/[0.08]" />
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`rounded-md text-[10px] font-bold px-2.5 py-1.5 h-auto transition-all duration-300 ${
                              member.totalPoints >= 50
                                ? 'text-white bg-white/12 hover:bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                                : 'text-white/12 cursor-not-allowed bg-transparent hover:bg-transparent'
                            }`}
                            onClick={() => member.totalPoints >= 50 && handlePoints(member.id, -50)}
                            disabled={member.totalPoints < 50 || actionLoading === member.id}
                          >
                            <Gift className="w-3 h-3 mr-1 hidden sm:inline" /> Klaim
                          </Button>
                          
                          <div className="w-px h-4 bg-white/[0.08] ml-2" />
                          
                          {/* Edit & Delete */}
                          <div className="flex items-center">
                            <Button size="sm" variant="ghost" onClick={() => startEdit(member)} title="Edit Member" className="text-white/30 hover:text-white hover:bg-white/10 px-2 py-1.5 h-auto"><Edit2 className="w-3 h-3" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(member.id, member.name)} disabled={actionLoading === member.id} title="Hapus Member" className="text-red-400/50 hover:text-red-400 hover:bg-red-400/10 px-2 py-1.5 h-auto"><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
