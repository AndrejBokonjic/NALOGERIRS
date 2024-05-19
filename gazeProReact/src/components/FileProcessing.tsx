import {FilesUpload} from "./FilesUpload.tsx";
import {PdfTextOnly} from "./PdfTextOnly.tsx";
import {useState} from "react";
import {PDFViewer} from "./PDFViewer.tsx";


export const FileProcessing = () => {

    const [files, setFiles] = useState<File[]>([]);

    const handleChangeOnFilesUpload = (filesUpload: File[])=> {
        console.log(filesUpload);

        setFiles(prevFiles => [...prevFiles, ...filesUpload])
    }

    return <>
        <FilesUpload onAddFiles={handleChangeOnFilesUpload}/>

        {files.map((file, index) => (
        <div key={index}>
            <br />
            <h3>Uploaded File {index + 1}</h3>
            <PdfTextOnly file={file} />

            {/* preview od pdf
            <PDFViewer file={file}/>*/}

            <br/><br/><br/><br/>
        </div>
        ))}
    </>
}