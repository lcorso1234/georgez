import { NextRequest, NextResponse } from 'next/server';

const escapeVCardValue = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

const toVCardTimestamp = () =>
  new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

const safeFilename = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'shared-contact';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const name = (params.get('name') || '').trim() || 'Shared Contact';
  const email = (params.get('email') || '').trim();
  const phone = (params.get('phone') || '').trim();
  const rev = toVCardTimestamp();
  const uid = `share-${Date.now()}@zaharoff.com`;

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCardValue(name)}`,
    `N:${escapeVCardValue(name)};;;;`,
    `UID:${uid}`,
    `REV:${rev}`,
  ];

  if (phone) lines.push(`TEL;TYPE=CELL:${escapeVCardValue(phone)}`);
  if (email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(email)}`);

  lines.push('END:VCARD');

  const vCard = `${lines.join('\r\n')}\r\n`;
  const filename = `${safeFilename(name)}.vcf`;

  return new NextResponse(vCard, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
