import React from "react";


export const CreateExcelButton = () => {

    const handleCreateExcel = () => {
        window.electron.ipcRenderer.send('create-excel');
    };


    return (
        <button
            onClick={handleCreateExcel}
            type="button"
            style={{position:"absolute", top:"16px", right:"16px", }}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none
                    focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex
                    items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
            Create Excel
            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </button>
    )
}