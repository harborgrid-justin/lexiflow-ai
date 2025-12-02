import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { Select } from './ui/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/Table';
import { Dropdown, DropdownMenuItem } from './ui/Dropdown';

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  cell?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (row: T) => string;
  pagination?: boolean;
  pageSize?: number;
  onExport?: (format: 'csv' | 'json') => void;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowId = (row: any) => row.id,
  pagination = true,
  pageSize: initialPageSize = 10,
  onExport,
  className,
  loading = false,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(
    columns.map((col) => col.id)
  );

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    const column = columns.find((col) => col.id === sortColumn);
    if (!column) return data;

    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (typeof column.accessor === 'function') {
        aValue = column.accessor(a);
        bValue = column.accessor(b);
      } else {
        aValue = a[column.accessor];
        bValue = b[column.accessor];
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection, columns]);

  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = paginatedData.map(getRowId);
      onSelectionChange?.(allIds);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedRows, rowId]);
    } else {
      onSelectionChange?.(selectedRows.filter((id) => id !== rowId));
    }
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRows.includes(getRowId(row)));

  const isSomeSelected =
    !isAllSelected &&
    paginatedData.some((row) => selectedRows.includes(getRowId(row)));

  const toggleColumnVisibility = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const visibleColumnsList = columns.filter((col) =>
    visibleColumns.includes(col.id)
  );

  const columnVisibilityItems: DropdownMenuItem[] = columns.map((col) => ({
    label: col.header,
    value: col.id,
    icon: visibleColumns.includes(col.id) ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />,
  }));

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectable && selectedRows.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedRows.length} row(s) selected
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Column visibility */}
          <Dropdown
            items={columnVisibilityItems}
            onSelect={toggleColumnVisibility}
          >
            <Button variant="outline" size="sm" leftIcon={<EyeOff className="h-4 w-4" />}>
              Columns
            </Button>
          </Dropdown>

          {/* Export */}
          {onExport && (
            <Dropdown
              items={[
                { label: 'Export as CSV', value: 'csv' },
                { label: 'Export as JSON', value: 'json' },
              ]}
              onSelect={(value) => onExport(value as 'csv' | 'json')}
            >
              <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                Export
              </Button>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border">
        <Table hoverable striped>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHead>
              )}
              {visibleColumnsList.map((column) => (
                <TableHead
                  key={column.id}
                  sortable={column.sortable}
                  sortDirection={
                    sortColumn === column.id ? sortDirection : null
                  }
                  onSort={() => column.sortable && handleSort(column.id)}
                  style={{ width: column.width }}
                  className={cn(
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    visibleColumnsList.length + (selectable ? 1 : 0)
                  }
                  className="text-center py-12"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    visibleColumnsList.length + (selectable ? 1 : 0)
                  }
                  className="text-center py-12 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowId = getRowId(row);
                const isSelected = selectedRows.includes(rowId);

                return (
                  <TableRow
                    key={rowId}
                    className={cn(
                      onRowClick && 'cursor-pointer',
                      isSelected && 'bg-muted/50'
                    )}
                    onClick={() => onRowClick?.(row)}
                    data-state={isSelected ? 'selected' : undefined}
                  >
                    {selectable && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectRow(rowId, e.target.checked)
                          }
                        />
                      </TableCell>
                    )}
                    {visibleColumnsList.map((column) => {
                      let cellContent;

                      if (column.cell) {
                        cellContent = column.cell(row);
                      } else if (typeof column.accessor === 'function') {
                        cellContent = column.accessor(row);
                      } else {
                        cellContent = row[column.accessor] as React.ReactNode;
                      }

                      return (
                        <TableCell
                          key={column.id}
                          className={cn(
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right'
                          )}
                        >
                          {cellContent}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && sortedData.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              options={[
                { label: '10', value: '10' },
                { label: '20', value: '20' },
                { label: '50', value: '50' },
                { label: '100', value: '100' },
              ]}
              value={pageSize.toString()}
              onChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
              className="w-20"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
