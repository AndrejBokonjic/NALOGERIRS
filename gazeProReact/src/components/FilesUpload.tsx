"use client";

import { FileInput, Label } from "flowbite-react";
import {ChangeEvent} from "react";


interface FilesUploadProps {

    onAddFiles: (files: File[]) => any;
}
export const FilesUpload = ({onAddFiles}:FilesUploadProps) => {

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {

        const newFiles = Array.from(event.target.files as FileList);
        onAddFiles(newFiles);
    }

    return (
        <div>
            <div>
                <Label className="text-blue-400" htmlFor="file-upload-helper-text" value="Upload pdf" />
            </div>
            <FileInput id="file-upload-helper-text" onChange={handleFileChange} helperText="Accepted pdf" multiple />
            <br/>
        </div>
    );
}
