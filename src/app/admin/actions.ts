'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function loginAdmin(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', password, { httpOnly: true, secure: true, path: '/' });
    return { success: true };
  }
  return { error: 'Password salah' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  revalidatePath('/admin');
}

export async function getMembers(search: string = '') {
  try {
    const members = await prisma.member.findMany({
      where: search ? {
        OR: [
          { name: { contains: search } },
          { phoneNumber: { contains: search } }
        ]
      } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    return { members };
  } catch (error) {
    console.error(error);
    return { error: 'Gagal mengambil data member' };
  }
}

export async function addMember(name: string, phoneNumber: string) {
  try {
    const existing = await prisma.member.findUnique({ where: { phoneNumber } });
    if (existing) {
      return { error: 'Nomor HP sudah terdaftar' };
    }
    const newMember = await prisma.member.create({
      data: { name, phoneNumber }
    });

    await prisma.activityLog.create({
      data: {
        action: 'TAMBAH_MEMBER',
        memberId: newMember.id,
        memberName: newMember.name,
        details: 'Mendaftar sebagai member baru'
      }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Gagal menambahkan member' };
  }
}

export async function updatePoints(id: string, pointChange: number) {
  try {
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) return { error: 'Member tidak ditemukan' };

    const newPoints = member.totalPoints + pointChange;
    if (newPoints < 0) return { error: 'Poin tidak mencukupi' };

    await prisma.member.update({
      where: { id },
      data: { totalPoints: newPoints }
    });

    const actionType = pointChange > 0 ? 'TAMBAH_POIN' : 'KLAIM_REWARD';
    const details = pointChange > 0 ? `Menambahkan ${pointChange} poin` : `Klaim reward (${pointChange} poin)`;

    await prisma.activityLog.create({
      data: {
        action: actionType,
        memberId: member.id,
        memberName: member.name,
        details: details
      }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Gagal memperbarui poin' };
  }
}

export async function deleteMember(id: string) {
  try {
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) return { error: 'Member tidak ditemukan' };

    await prisma.member.delete({
      where: { id }
    });

    await prisma.activityLog.create({
      data: {
        action: 'HAPUS_MEMBER',
        memberId: id,
        memberName: member.name,
        details: 'Menghapus member dari sistem'
      }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Gagal menghapus member' };
  }
}

export async function editMember(id: string, name: string, phoneNumber: string) {
  try {
    const existing = await prisma.member.findUnique({ where: { phoneNumber } });
    if (existing && existing.id !== id) {
      return { error: 'Nomor HP sudah digunakan member lain' };
    }

    const member = await prisma.member.update({
      where: { id },
      data: { name, phoneNumber }
    });

    await prisma.activityLog.create({
      data: {
        action: 'EDIT_MEMBER',
        memberId: member.id,
        memberName: member.name,
        details: 'Memperbarui data profil'
      }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Gagal memperbarui member' };
  }
}

export async function getLogs() {
  try {
    const logs = await prisma.activityLog.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' }
    });
    return { logs };
  } catch (error) {
    console.error(error);
    return { error: 'Gagal mengambil log', logs: [] };
  }
}
