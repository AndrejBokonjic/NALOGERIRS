

// @ts-ignore
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// @ts-ignore
export const PDFViewer = ({ file }) => {
    const [numPages, setNumPages] = useState(null);

    // @ts-ignore
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }


    return (
        <div>
            {file && (
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                </Document>
            )}
        </div>
    );
}


