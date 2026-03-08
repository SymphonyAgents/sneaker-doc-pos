'use client';

import { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { XIcon } from '@phosphor-icons/react';
import { ReportPdf } from './ReportPdf';
import type { ReportSummary } from '@/lib/types';

interface Props {
  data: ReportSummary;
  year: number;
  month: number;
  branchName?: string;
  label: string;
  fileName: string;
}

export default function PdfButtonInner({ data, year, month, branchName, label, fileName }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  // Resolve logo to absolute URL so react-pdf can fetch it in the browser
  const logoUrl = `${window.location.origin}/sneaker-doc-logo.png`;

  const doc = (
    <ReportPdf
      data={data}
      year={year}
      month={month}
      branchName={branchName}
      logoUrl={logoUrl}
    />
  );

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPreviewOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-zinc-800 border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors duration-150"
        >
          Preview
        </button>
        <PDFDownloadLink
          document={doc}
          fileName={fileName}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-950 text-white rounded-md hover:bg-zinc-800 transition-colors duration-150"
        >
          {({ loading }) => (loading ? 'Preparing...' : label)}
        </PDFDownloadLink>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 shrink-0">
            <span className="text-sm font-medium text-zinc-200">Report Preview</span>
            <button
              onClick={() => setPreviewOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md transition-colors"
            >
              <XIcon size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <PDFViewer width="100%" height="100%" showToolbar={false}>
              {doc}
            </PDFViewer>
          </div>
        </div>
      )}
    </>
  );
}
