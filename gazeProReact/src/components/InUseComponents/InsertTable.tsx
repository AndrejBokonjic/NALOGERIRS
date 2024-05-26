import React, { useState } from 'react';
import {Table} from "flowbite-react";

export const InsertTableButterfly = () => {
    const [tableData, setTableData] = useState([
        ['', '', '', ''], // easy
        ['', '', '', ''], // medium
        ['', '', '', '']  // difficult
    ]);

    const handleInputChange = (event, rowIndex, cellIndex) => {
        const { value } = event.target;
        setTableData(prevData => {
            const newData = [...prevData];
            newData[rowIndex][cellIndex] = value;
            return newData;
        });
        console.log(value);

        console.log(tableData);
    };

    return (
        <Table className="rounded-lg overflow-hidden">
            <Table.Head >

                <Table.HeadCell className="bg-blue-300">Difficulty</Table.HeadCell>
                <Table.HeadCell className="bg-blue-300">Time on Target</Table.HeadCell>
                <Table.HeadCell className="bg-blue-300">Undershoot</Table.HeadCell>
                <Table.HeadCell className="bg-blue-300">Overshoots</Table.HeadCell>
                <Table.HeadCell className="bg-blue-300">Amplitude Accuracy</Table.HeadCell>

            </Table.Head>
            <Table.Body>
            {tableData.map((row, rowIndex) => (
                <Table.Row key={rowIndex}>
                    <Table.Cell>{rowIndex === 0 ? 'Easy' : rowIndex === 1 ? 'Medium' : 'Difficult'}</Table.Cell>
                    {row.map((cell, cellIndex) => (
                        <Table.Cell key={cellIndex}>
                            <input type="text" value={cell} onChange={e => handleInputChange(e, rowIndex, cellIndex)} />
                        </Table.Cell>
                    ))}
                </Table.Row>
            ))}
            </Table.Body>
        </Table>
    );
};

