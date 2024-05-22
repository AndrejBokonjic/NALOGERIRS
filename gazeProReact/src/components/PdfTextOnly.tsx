// @ts-ignore
import React, {useEffect, useState} from 'react';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


interface PdfTextOnlyProps {
    file: File;
}

// @ts-ignore
export const PdfTextOnly = ({ file }:PdfTextOnlyProps) => {

    //const [textContent, setTextContent] = useState('');
    const [textContents, setTextContents] = useState<string[]>([]);

    //const [prevFile, setPrevFile] = useState<File>(file);


    // @ts-ignore
    const extractTextFromPDF = (file:File) => {
        const reader = new FileReader();
        reader.onload = async function(event) {

            // @ts-ignore
            const typedArray = new Uint8Array(event.target.result);
            const pdf = await pdfjs.getDocument(typedArray).promise;
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const pageText = await page.getTextContent();
                pageText.items.forEach(item => {

                    if ('str' in item) {
                        text += item.str; //+ '\n';
                    }
                });
                text+='\n';
            }

            setTextContents( [...textContents, text]);
            console.log(textContents);
        };
        reader.readAsArrayBuffer(file);
    }

    useEffect(() => {
        if (file) {
            extractTextFromPDF(file);
        }
    }, [file]);

    return (
        <div>
            {textContents.map((text, index) => (
                <div key={index}>
                    <h3>Text from File {index + 1}</h3>
                    <p>{text}</p>
                </div>
            ))}
        </div>
    );
}
