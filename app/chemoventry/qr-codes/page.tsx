'use client';

import { useEffect } from 'react';
import PageTitle from '@/components/pageTitle';
import { QRCodeGenerator } from '@/components/qr-codes/qr-code-generator';
import { QRCodeList } from '@/components/qr-codes/qr-code-list';
import { useQRCodeStore } from '@/store/qrcode';
import { Toaster } from '@/components/ui/toaster';

export default function QRCodeManagementPage() {
  const { fetchQRCodes } = useQRCodeStore();

  useEffect(() => {
    fetchQRCodes();
  }, [fetchQRCodes]);

  return (
    <div className="space-y-8">
      <PageTitle title="QR Code Management" />
      <QRCodeGenerator />
      <QRCodeList />
      <Toaster />
    </div>
  );
}
