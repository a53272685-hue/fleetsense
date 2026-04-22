"use client";

/**
 * DataTable — TanStack Table wrapper that renders with our Figma-spec cells.
 *
 * Usage:
 *   const columns: ColumnDef<Vehicle>[] = [
 *     { accessorKey: "id", header: "ID" },
 *     { accessorKey: "name", header: "Name" },
 *   ];
 *   <DataTable columns={columns} data={vehicles} />
 */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { TableHeader } from "./TableHeader";
import { TableCell } from "./TableCell";
import { TableRow } from "./TableRow";

export type DataTableProps<T> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
};

export function DataTable<T>({ columns, data }: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border-r border-border-secondary">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} body={false}>
              {headerGroup.headers.map((header) => (
                <TableHeader key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHeader>
              ))}
            </TableRow>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}
