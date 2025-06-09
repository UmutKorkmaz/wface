export interface WColumn<TData extends object = any> {
  id: string; // Unique identifier for the column
  label: string; // Display name for the column header
  accessor: keyof TData | ((rowData: TData, rowIndex: number) => string | number | React.ReactNode | null);
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  disableSort?: boolean;
  disableGlobalFilter?: boolean;
  editable?: boolean | ((rowData: TData) => boolean); // Phase 8
}

export interface WTableRowAction<TData extends object = any> {
  id: string;
  icon: React.ReactElement;
  tooltip?: string;
  onClick: (rowData: TData) => void;
  disabled?: boolean | ((rowData: TData) => boolean);
  color?: 'inherit' | 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
}

export interface WTableBulkAction<TData extends object = any> {
  id: string;
  icon?: React.ReactElement; // Icon is optional for bulk actions
  label: string;
  tooltip?: string;
  onClick: (selectedRows: TData[], selectedRowIds: Record<string | number, boolean>) => void;
  disabled?: boolean | ((selectedRows: TData[]) => boolean);
  color?: 'inherit' | 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'text' | 'outlined' | 'contained';
}

export interface WTableProps<TData extends object = any> {
  columns: WColumn<TData>[];
  data: TData[];
  loading?: boolean;
  stickyHeader?: boolean;
  dense?: boolean;
  paperComponent?: boolean;
  tableContainerSx?: object;
  tableSx?: object;

  // Pagination
  pagination?: boolean;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  totalRowCount?: number;
  currentPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;

  // Sorting
  initialSortBy?: { columnId: string; direction: 'asc' | 'desc' };
  onSortChange?: (columnId: string | null, direction: 'asc' | 'desc' | undefined) => void;
  disableSort?: boolean;

  // Global Filtering
  enableGlobalFilter?: boolean;
  globalFilterValue?: string;
  onGlobalFilterChange?: (value: string) => void;
  globalFilterFn?: (rowData: TData, columnId: string, filterValue: string) => boolean;
  title?: string;

  // Row Selection
  enableRowSelection?: boolean | ((rowData: TData) => boolean);
  onRowSelectionChange?: (selectedRowIds: Record<string | number, boolean>, selectedRows: TData[]) => void;
  selectedRowIds?: Record<string | number, boolean>;
  getRowId?: (rowData: TData, index: number) => string | number;

  // Per-Row Actions
  rowActions?: WTableRowAction<TData>[];
  renderRowActionsAsMenu?: boolean;
  actionsColumnLabel?: string;

  // Table-Level Bulk Actions
  tableToolbarActions?: WTableBulkAction<TData>[];

  // Editing (Phase 8)
  enableEditing?: boolean;
  onRowUpdate?: (updatedRowData: TData, originalRowData: TData) => Promise<void> | void;

  // Detail Panel (Phase 10)
  renderDetailPanel?: (rowData: TData, rowIndex: number) => React.ReactNode;

  // Data Export (Phase 11)
  enableExport?: boolean | ('all' | 'filtered' | 'selected');
  exportFileName?: string;
  exportColumns?: (keyof TData | { id: string; label: string; accessor: (rowData: TData, rowIndex: number) => any })[];
}
