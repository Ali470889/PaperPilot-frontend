import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    MoreHorizontal,
    SquarePen,
    Trash
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDateTime } from '@/lib/utils';
import EditClassDialog from "./EditClassDialog";


export const columns = [
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original;

            const [openClass, setOpenClass] = React.useState(false);

            return (
                <>
                    <div className=" flex gap-1 items-center ">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setOpenClass(true)}>
                                    <SquarePen /> Edit Class
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem onClick={() => setOpenAddTopic(true)} >
                                    <Plus /> Add Topic
                                </DropdownMenuItem> */}

                                <DropdownMenuItem variant="destructive">
                                    {" "}
                                    <Trash /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {openClass && (
                        <EditClassDialog
                            data={data}
                            openClass={openClass}
                            setOpenClass={setOpenClass}
                        />
                    )}
                </>
            );
        },
    },
    {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "name",
        header: () => <div className="">Name</div>,
        cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "acronym",
        header: () => <div className="">Acronym</div>,
        cell: ({ row }) => <div className="">{row.getValue("acronym")}</div>,
    },
    {
        accessorKey: "updatedAt",
        header: () => <div className="">Updated at</div>,
        cell: ({ row }) => (
            <div className="capitalize">
                {formatDateTime(row.getValue("updatedAt"))}
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: () => <div className="">Created at</div>,
        cell: ({ row }) => (
            <div className="capitalize">
                {" "}
                {formatDateTime(row.getValue("createdAt"))}
            </div>
        ),
    },
];

export function ClassDataTable({ data }) {
    const [sorting, setSorting] = React.useState([]);

    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="overflow-hidden   ">
            <div className="overflow-auto  rounded-md border">
                <Table className="min-w-[80%]">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead className="" key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
