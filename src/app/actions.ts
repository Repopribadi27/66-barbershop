'use server';

import { prisma } from '@/lib/prisma';

export async function searchMember(phoneNumber: string) {
  if (!phoneNumber) return { error: 'Nomor HP tidak boleh kosong' };

  try {
    const member = await prisma.member.findUnique({
      where: { phoneNumber },
    });

    if (!member) {
      return { error: 'Member tidak ditemukan. Silakan cek kembali nomor HP Anda.' };
    }

    return { member };
  } catch (error) {
    console.error(error);
    return { error: 'Terjadi kesalahan saat mencari data' };
  }
}
