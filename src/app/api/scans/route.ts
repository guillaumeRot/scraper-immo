import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const scans = await prisma.scan.findMany({
      orderBy: { date_scan: 'desc' },
    });
    return NextResponse.json(scans);
  } catch (error) {
    console.error('Error fetching scans:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des scans' },
      { status: 500 }
    );
  }
}
