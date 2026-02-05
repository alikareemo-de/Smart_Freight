import type React from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

type Column<T> = {
    header: string;
    render: (row: T) => React.ReactNode;
    width?: number | string;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    rows: T[];
    emptyMessage?: string;
};

const DataTable = <T,>({ columns, rows, emptyMessage = 'No records found.' }: DataTableProps<T>) => (
    <TableContainer component={Paper} variant="outlined">
        <Table>
            <TableHead>
                <TableRow>
                    {columns.map((column, index) => (
                        <TableCell key={index} sx={{ width: column.width }}>
                            {column.header}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={columns.length}>
                            <Box py={3} textAlign="center" color="text.secondary">
                                {emptyMessage}
                            </Box>
                        </TableCell>
                    </TableRow>
                ) : (
                    rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex} hover>
                            {columns.map((column, colIndex) => (
                                <TableCell key={colIndex}>{column.render(row)}</TableCell>
                            ))}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </TableContainer>
);

export default DataTable;
