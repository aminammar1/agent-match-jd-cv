// src/components/PDFPreview.js
import React, { useState } from 'react';
// Pull everything (including worker) from the Webpack5 entry
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';

export default function PDFPreview({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: 16,
        marginTop: 16,
        maxHeight: 400,
        overflow: 'auto',
      }}
    >
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={600}
          />
        ))}
      </Document>
    </div>
  );
}
