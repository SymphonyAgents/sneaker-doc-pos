'use client';

import dynamic from 'next/dynamic';
import type { ReportSummary } from '@/lib/types';

const PdfButtonInner = dynamic(() => import('./PdfButtonInner'), { ssr: false });

interface Props {
  data: ReportSummary;
  year: number;
  month: number;
  branchName?: string;
  label: string;
}

export function PdfDownloadButton({ data, year, month, branchName, label }: Props) {
  const fileName = `sneakerdoc-report-${year}-${month === 0 ? 'full' : String(month).padStart(2, '0')}.pdf`;
  return (
    <PdfButtonInner
      data={data}
      year={year}
      month={month}
      branchName={branchName}
      label={label}
      fileName={fileName}
    />
  );
}
