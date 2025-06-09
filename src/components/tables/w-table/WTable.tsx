import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Box,
  TextField,
  Toolbar,
  Typography,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress,
  Button,
  Collapse, // Added for Phase 10
  SxProps,
  Theme,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownloadIcon from '@mui/icons-material/Download'; // Added for Phase 11
import { WTableProps, WColumn, WTableRowAction } from './w-table.types';

// CSV Export Helper Function (Phase 11)
const sanitizeCsvValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  let stringValue = String(value);
  // If the value contains a comma, newline, or double quote, wrap it in double quotes.
  if (stringValue.search(/("|,|\n)/g) >= 0) {
    // Double up any existing double quotes.
    stringValue = stringValue.replace(/"/g, '""');
    stringValue = `"${stringValue}"`;
  }
  return stringValue;
};

const convertToCSV = (
  dataToExport: any[],
  columnsToExport: { id: string; label: string; accessor: (rowData: any, rowIndex: number) => any }[] // Simplified for helper
): string => {
  if (!dataToExport || dataToExport.length === 0) {
    return '';
  }

  const header = columnsToExport.map(col => sanitizeCsvValue(col.label)).join(',');

  const rows = dataToExport.map((row, rowIndex) => {
    return columnsToExport.map(col => {
      // Assuming col.accessor is always a function for this helper,
      // or we'd need to handle string accessors like in renderCellContent
      const cellValue = col.accessor(row, rowIndex);
      return sanitizeCsvValue(cellValue);
    }).join(',');
  });

  return [header, ...rows].join('\n');
};


// Helper function for stable sorting
function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
  columns: WColumn<any>[],
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  const column = columns.find(c => c.id === orderBy);
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy, column)
    : (a, b) => -descendingComparator(a, b, orderBy, column);
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T, column?: WColumn<T>): number {
  // Pass dummy rowIndex 0, as it's not used for sorting comparison directly with accessor value.
  // The actual rowIndex is used when initially calling accessor in renderCellContent if needed.
  // The 'data.indexOf(a)' from user's code was problematic as 'data' is not in this scope.
  // This will be an issue if accessor for sorting truly needs original index.
  // For now, assuming accessor for sorting uses direct value or doesn't rely on specific index for comparison.
  let valA = column && typeof column.accessor === 'function' ? column.accessor(a, 0) : a[orderBy];
  let valB = column && typeof column.accessor === 'function' ? column.accessor(b, 0) : b[orderBy];


  valA = valA ?? '';
  valB = valB ?? '';

  if (typeof valA === 'number' && typeof valB === 'number') {
    return valA - valB;
  }
  if (typeof valA === 'string' && typeof valB === 'string') {
    return valA.localeCompare(valB);
  }
  return String(valA).localeCompare(String(valB));
}

const defaultTableContainerSx: SxProps<Theme> = {};
const defaultTableSx: SxProps<Theme> = {};
const DEFAULT_ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

export function WTable<TData extends object = any>({
  columns,
  data = [],
  loading = false,
  stickyHeader = false,
  dense = false,
  paperComponent = true,
  tableContainerSx,
  tableSx,
  pagination = true,
  rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
  defaultRowsPerPage,
  totalRowCount: controlledTotalRowCount,
  currentPage: controlledPage,
  onPageChange: controlledOnPageChange,
  onRowsPerPageChange: controlledOnRowsPerPageChange,
  initialSortBy,
  onSortChange: controlledOnSortChange,
  disableSort: globalDisableSort = false,
  enableGlobalFilter = false,
  globalFilterValue: controlledGlobalFilterValue,
  onGlobalFilterChange: controlledOnGlobalFilterChange,
  globalFilterFn,
  title,
  enableRowSelection = false,
  onRowSelectionChange,
  selectedRowIds: controlledSelectedRowIds,
  getRowId: customGetRowId,
  rowActions,
  actionsColumnLabel = 'Actions',
  tableToolbarActions,
  // Editing Props (Phase 8)
  enableEditing = false,
  onRowUpdate,
  // Detail Panel (Phase 10)
  renderDetailPanel,
  // Data Export (Phase 11)
  enableExport = 'filtered', // Default export mode
  exportFileName = 'table-data.csv',
  exportColumns,
}: WTableProps<TData>) {

  const isPaginationControlled = controlledPage !== undefined && !!controlledOnPageChange;
  const isSortControlled = !!controlledOnSortChange;
  const isGlobalFilterControlled = controlledGlobalFilterValue !== undefined && !!controlledOnGlobalFilterChange;
  const isSelectionControlled = !!controlledSelectedRowIds && !!onRowSelectionChange;

  const [internalPage, setInternalPage] = useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(defaultRowsPerPage ?? rowsPerPageOptions[0] ?? 5);
  const [internalOrder, setInternalOrder] = useState<Order>(initialSortBy?.direction || 'asc');
  const [internalOrderBy, setInternalOrderBy] = useState<string | null>(initialSortBy?.columnId || null);
  const [internalGlobalFilter, setInternalGlobalFilter] = useState('');
  const [internalSelectedRowIds, setInternalSelectedRowIds] = useState<Record<string | number, boolean>>({});

  const [rowMenuAnchorEl, setRowMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [focusedRowForMenu, setFocusedRowForMenu] = useState<null | TData>(null);

  // State for cell editing (Phase 8)
  const [editingCell, setEditingCell] = useState<{ rowId: string | number; columnId: string } | null>(null);
  const [editValue, setEditValue] = useState<any>(''); // Stores the current value in the TextField

  // State for expandable rows (Phase 10)
  const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});

  const page = isPaginationControlled ? controlledPage : internalPage;
  const rowsPerPage = internalRowsPerPage;
  const order = isSortControlled && initialSortBy?.direction ? initialSortBy.direction : internalOrder;
  const orderBy = isSortControlled && initialSortBy?.columnId ? initialSortBy.columnId : internalOrderBy;
  const currentGlobalFilter = isGlobalFilterControlled ? controlledGlobalFilterValue! : internalGlobalFilter;
  const currentSelectedRowIds = isSelectionControlled ? controlledSelectedRowIds! : internalSelectedRowIds;

  const getRowId = useCallback(
    (rowData: TData, index: number): string | number => {
      if (customGetRowId) return customGetRowId(rowData, index);
      return (rowData as any).id ?? index;
    },
    [customGetRowId],
  );

  useEffect(() => {
    if (isPaginationControlled && controlledPage !== internalPage) {
      setInternalPage(controlledPage);
    }
  }, [controlledPage, isPaginationControlled, internalPage]);

  useEffect(() => {
    if (!isPaginationControlled) setInternalPage(0);
  }, [data, orderBy, order, currentGlobalFilter, rowsPerPage, isPaginationControlled]);


  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    if (isSortControlled) {
      const isAsc = orderBy === property && order === 'asc';
      controlledOnSortChange!(property, isAsc ? 'desc' : 'asc');
    } else {
      const isAsc = internalOrderBy === property && internalOrder === 'asc';
      setInternalOrder(isAsc ? 'desc' : 'asc');
      setInternalOrderBy(property);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    if (isPaginationControlled) {
      controlledOnPageChange!(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setInternalRowsPerPage(newRowsPerPage);
    if (controlledOnRowsPerPageChange) {
      controlledOnRowsPerPageChange(newRowsPerPage);
    }
    if (!isPaginationControlled) {
      setInternalPage(0);
    }
  };

  const handleGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || '';
    if (isGlobalFilterControlled) {
      controlledOnGlobalFilterChange!(value);
    } else {
      setInternalGlobalFilter(value);
    }
  };

  const getRawCellValue = useCallback((rowData: TData, column: WColumn<TData>): any => {
    if (typeof column.accessor === 'string') {
      return rowData[column.accessor as keyof TData];
    }
    if (typeof column.accessor === 'function') {
        // To get a raw value for editing from a function accessor, the function would ideally
        // return a primitive. If it returns complex ReactNode, direct editing is problematic.
        // We pass the originalRowIndex which can be found by searching 'data' array.
        const originalRowIndex = data.findIndex(r => getRowId(r, -1) === getRowId(rowData, -1)); // Hacky way to get original index
        const displayValue = column.accessor(rowData, originalRowIndex !== -1 ? originalRowIndex : 0);
        if (typeof displayValue === 'string' || typeof displayValue === 'number' || typeof displayValue === 'boolean') {
            return displayValue;
        }
        return ''; // Fallback for complex ReactNode from function accessor
    }
    return '';
  }, [data, getRowId]); // getRowId is stable due to its own useCallback

  const renderCellContent = useCallback((rowData: TData, column: WColumn<TData>, rowIndex: number): React.ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(rowData, rowIndex);
    }
    const value = rowData[column.accessor as keyof TData];
    return (value === null || value === undefined) ? '' : (value as React.ReactNode);
  }, []);

  const processedData = useMemo(() => {
    let result = data ? [...data] : [];

    if (enableGlobalFilter && currentGlobalFilter && !isGlobalFilterControlled) {
      result = result.filter((row, rowIndex) =>
        columns.some((col) => {
          if (col.disableGlobalFilter) return false;
          if (globalFilterFn) return globalFilterFn(row, col.id, currentGlobalFilter);
          const cellValue = renderCellContent(row, col, rowIndex);
          return cellValue ? String(cellValue).toLowerCase().includes(currentGlobalFilter.toLowerCase()) : false;
        }),
      );
    }

    if (orderBy && !isSortControlled) {
      // Pass a consistent index to the accessor within getComparator if needed
      // For sorting, the value itself is more important than its original row index.
      const tempColumns = columns.map(c => ({
        ...c,
        accessor: typeof c.accessor === 'function'
          ? (r: TData) => (c.accessor as Function)(r, 0) // Pass dummy index for sort comparison
          : c.accessor
      }));
      result = stableSort(result, getComparator(order, orderBy as keyof TData, tempColumns));
    }
    return result;
  }, [data, enableGlobalFilter, currentGlobalFilter, isGlobalFilterControlled, globalFilterFn, columns, renderCellContent, orderBy, order, isSortControlled]);

  const paginatedData = useMemo(() => {
    if (pagination && !isPaginationControlled) {
      return processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }
    return processedData;
  }, [processedData, pagination, isPaginationControlled, page, rowsPerPage]);

  const currentTotalRowCount = controlledTotalRowCount ?? processedData.length;

  const selectableRows = useMemo(() =>
    processedData.filter((row) => typeof enableRowSelection === 'function' ? enableRowSelection(row) : !!enableRowSelection)
  , [processedData, enableRowSelection]);

  const selectableRowIds = useMemo(() =>
    selectableRows.map((row) => getRowId(row, processedData.indexOf(row)))
  , [selectableRows, getRowId, processedData]);

  const numSelected = Object.keys(currentSelectedRowIds).filter(id => currentSelectedRowIds[id]).length;
  const allSelectableRowsSelected = selectableRowIds.length > 0 && numSelected === selectableRowIds.length;


  const selectedRowsData = useMemo(() => {
    if (!enableRowSelection || Object.keys(currentSelectedRowIds).length === 0) {
      return [];
    }
    return data.filter(row => {
      // Ensure original index is used if getRowId depends on it
      const originalIndex = data.findIndex(originalRow => getRowId(originalRow, -1) === getRowId(row, -1));
      const rowId = getRowId(row, originalIndex !== -1 ? originalIndex : data.indexOf(row) );
      return currentSelectedRowIds[rowId];
    });
  }, [currentSelectedRowIds, data, getRowId, enableRowSelection]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newSelected: Record<string | number, boolean> = {};
    if (event.target.checked) {
      selectableRowIds.forEach(id => newSelected[id] = true);
    }
    if (!isSelectionControlled) setInternalSelectedRowIds(newSelected);
    if (onRowSelectionChange) {
      const originalDataMap = new Map(data.map((r, i) => [getRowId(r, i), r]));
      const newlySelectedData = Object.keys(newSelected).filter(id => newSelected[id]).map(id => originalDataMap.get(id)).filter(Boolean) as TData[];
      onRowSelectionChange(newSelected, newlySelectedData);
    }
  };

  const handleRowCheckboxClick = (event: React.MouseEvent<unknown>, rowId: string | number) => {
    event.stopPropagation();
    const newSelected = { ...currentSelectedRowIds, [rowId]: !currentSelectedRowIds[rowId] };
    if (!currentSelectedRowIds[rowId] === false) delete newSelected[rowId];

    if (!isSelectionControlled) setInternalSelectedRowIds(newSelected);
    if (onRowSelectionChange) {
      const originalDataMap = new Map(data.map((r, i) => [getRowId(r, i), r]));
      const newlySelectedData = Object.keys(newSelected).filter(id => newSelected[id]).map(id => originalDataMap.get(id)).filter(Boolean) as TData[];
      onRowSelectionChange(newSelected, newlySelectedData);
    }
  };

  const handleRowClick = (event: React.MouseEvent<unknown>, row: TData, rowId: string | number) => {
    const isSelectable = typeof enableRowSelection === 'function' ? enableRowSelection(row) : !!enableRowSelection;
    if (isSelectable) {
      let target = event.target as HTMLElement;
      while (target && target !== event.currentTarget) {
        if (target.getAttribute('data-wtable-action') === 'true' || target.tagName === 'INPUT') {
          return;
        }
        target = target.parentElement as HTMLElement;
      }
      handleRowCheckboxClick(event, rowId);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, rowData: TData) => {
    event.stopPropagation();
    setRowMenuAnchorEl(event.currentTarget);
    setFocusedRowForMenu(rowData);
  };

  const handleMenuClose = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setRowMenuAnchorEl(null);
    setFocusedRowForMenu(null);
  };

  const handleToggleExpand = (rowId: string | number) => {
    setExpandedRows(prev => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const handleExportData = () => {
    let dataForExport: TData[];
    const exportScope = typeof enableExport === 'string' ? enableExport : 'filtered'; // Default to 'filtered' if enableExport is just true

    switch (exportScope) {
      case 'all':
        dataForExport = [...data];
        break;
      case 'selected':
        dataForExport = selectedRowsData; // This is already an array of TData objects
        break;
      case 'filtered':
      default:
        dataForExport = processedData; // This is already filtered and sorted
        break;
    }

    let columnsForExport: { id: string; label: string; accessor: (rowData: TData, rowIndex: number) => any }[];

    if (props.exportColumns) {
      columnsForExport = props.exportColumns.map(ec => {
        if (typeof ec === 'string') { // ec is a keyof TData
          const matchingColumn = columns.find(c => c.id === ec || (c.accessor === ec && typeof c.accessor === 'string'));
          return {
            id: String(ec),
            label: matchingColumn?.label || String(ec),
            accessor: (rowData: TData) => rowData[ec as keyof TData]
          };
        } else { // ec is an object { id, label, accessor }
          return {
            id: ec.id,
            label: ec.label,
            accessor: ec.accessor
          };
        }
      });
    } else {
      // Default to current visible columns, excluding those without a clear data accessor (e.g. purely visual/action columns if any)
      // For simplicity, we assume all current columns are exportable.
      // We need to ensure the accessor passed to convertToCSV matches its expected signature.
      columnsForExport = columns.map(col => ({
        id: col.id,
        label: col.label,
        accessor: (rowData: TData, rowIndex: number) => {
          // renderCellContent returns React.ReactNode, convertToCSV expects simpler data.
          // We need to get the "raw" data if possible.
          if (typeof col.accessor === 'function') {
            // The function accessor might return JSX. We try to get a primitive.
            const val = col.accessor(rowData, rowIndex);
            if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return val;
            return ''; // Fallback for complex nodes
          }
          return rowData[col.accessor as keyof TData];
        }
      }));
    }

    const csvContent = convertToCSV(dataForExport, columnsForExport);
    if (!csvContent) {
      console.warn("WTable: No data to export or CSV content is empty.");
      return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', exportFileName || 'table-data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tableMarkup = (
    <>
      {(enableGlobalFilter || title || (tableToolbarActions && tableToolbarActions.length > 0 && numSelected > 0)) && (
        <Toolbar
          sx={{
            pl: { sm: 2 }, pr: { xs: 1, sm: 1 },
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            ...(numSelected > 0 && { bgcolor: (theme) => theme.palette.primary.lighter }),
          }}
        >
          {numSelected > 0 ? (
            <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
          ) : title ? (
            <Typography variant="h6" sx={{ flex: '1 1 100%' }}>{title}</Typography>
          ) : null}

          {enableGlobalFilter && numSelected === 0 && (
            <TextField
              variant="standard"
              value={currentGlobalFilter}
              onChange={handleGlobalFilterChange}
              placeholder="Search..."
              sx={{ ml: title && numSelected === 0 ? 2 : 0, flexGrow: 1, maxWidth: '300px' }}
            />
          )}
          {numSelected > 0 && tableToolbarActions && tableToolbarActions.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
              {tableToolbarActions.map(action => {
                const isDisabled = (typeof action.disabled === 'function' ? action.disabled(selectedRowsData) : action.disabled) || selectedRowsData.length === 0;
                return (
                  <Tooltip title={action.tooltip || ''} key={action.id}>
                    <span>
                      <Button
                        variant={action.variant || "contained"}
                        size="small"
                        color={action.color || 'primary'}
                        startIcon={action.icon}
                        onClick={() => action.onClick(selectedRowsData, currentSelectedRowIds)}
                        disabled={isDisabled}
                        data-wtable-action="true"
                      >
                        {action.label}
                      </Button>
                    </span>
                  </Tooltip>
                );
              })}
            </Box>
          )}
          {/* Export Button - Phase 11 */}
          {enableExport && numSelected === 0 && ( // Show export button only if no rows are selected (to avoid conflict with bulk actions UI)
            <Tooltip title="Export Data">
              <Button
                sx={{ ml: 2 }}
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => handleExportData()} // handleExportData will be added in a later chunk
              >
                Export
              </Button>
            </Tooltip>
          )}
        </Toolbar>
      )}
      <TableContainer sx={{ ...defaultTableContainerSx, ...tableContainerSx }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', width: '100%' }}>
            <CircularProgress />
          </Box>
        )}
        {!loading && (
          <Table stickyHeader={stickyHeader} size={dense ? 'small' : 'medium'} sx={{ ...defaultTableSx, ...tableSx }}>
            <TableHead>
              <TableRow>
                {renderDetailPanel && <TableCell padding="checkbox" sx={{ width: '1%' }} />}
                {enableRowSelection && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={numSelected > 0 && numSelected < selectableRowIds.length}
                      checked={allSelectableRowsSelected}
                      onChange={handleSelectAllClick}
                      inputProps={{ 'aria-label': 'select all visible rows' }}
                      disabled={selectableRowIds.length === 0}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    style={{ width: column.width }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    {!globalDisableSort && !column.disableSort && typeof column.accessor === 'string' ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, column.id)}
                      >
                        {column.label}
                        {orderBy === column.id ? <Box component="span" sx={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box> : null}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                {rowActions && rowActions.length > 0 && (
                  <TableCell align="center" sx={{ width: 'auto', padding: '0 8px' }}>{actionsColumnLabel}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => { // This index is relative to paginatedData
                const originalRowIndex = processedData.indexOf(row);
                const rowId = getRowId(row, originalRowIndex);
                const isSelected = !!currentSelectedRowIds[rowId];
                const isSelectable = typeof enableRowSelection === 'function' ? enableRowSelection(row) : !!enableRowSelection;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleRowClick(event, row, rowId)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={rowId}
                    selected={isSelected}
                    sx={{ cursor: isSelectable ? 'pointer' : 'default' }}
                  >
                    {renderDetailPanel && (
                      <TableCell padding="checkbox" sx={{ width: '1%' }}>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click if any
                            handleToggleExpand(rowId);
                          }}
                          data-wtable-action="true"
                        >
                          {expandedRows[rowId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                    )}
                    {enableRowSelection && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isSelected}
                          disabled={!isSelectable}
                          inputProps={{ 'aria-labelledby': `wtable-checkbox-${rowId}` }}
                          onClick={(e) => e.stopPropagation()}
                          data-wtable-action="true"
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => {
                      const isCurrentCellEditing =
                        editingCell?.rowId === rowId &&
                        editingCell?.columnId === column.id;

                      const isColumnConfigEditable = typeof column.editable === 'function'
                        ? column.editable(row)
                        // If column.editable is undefined, it defaults to true IF enableEditing (table prop) is true.
                        // If column.editable is explicitly false, it's not editable.
                        : (column.editable === undefined ? true : column.editable);

                      const canEditCell = enableEditing &&
                                          isColumnConfigEditable &&
                                          typeof column.accessor === 'string'; // For now, only allow editing direct string accessors


                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || 'left'}
                          onClick={() => {
                            if (canEditCell && !isCurrentCellEditing) {
                              setEditingCell({ rowId, columnId: column.id });
                              setEditValue(getRawCellValue(row, column));
                            }
                          }}
                          sx={{
                            cursor: canEditCell ? 'pointer' : 'default',
                            padding: isCurrentCellEditing && canEditCell ? '0 4px' : undefined // Reduce padding in edit mode
                          }}
                        >
                          {isCurrentCellEditing && canEditCell ? (
                            <TextField
                              size="small"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                              fullWidth
                              variant="outlined"
                              sx={{
                                '.MuiInputBase-root': { height: '100%' },
                                '.MuiInputBase-input': { padding: '8.5px 8px' }
                              }}
                              // onBlur and onKeyDown will be added in the next chunk
                            />
                          ) : (
                            renderCellContent(row, column, originalRowIndex)
                          )}
                        </TableCell>
                      );
                    })}
                    {rowActions && rowActions.length > 0 && (
                      <TableCell align="center" sx={{ padding: '0 8px', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()} data-wtable-action="true">
                        {rowActions.length === 1 && !(rowActions[0].id === 'renderAsMenuForce') && !renderRowActionsAsMenu ? (
                          rowActions.map(action => {
                            const disabled = typeof action.disabled === 'function' ? action.disabled(row) : action.disabled;
                            return (
                              <Tooltip title={action.tooltip || ''} key={action.id}>
                                <span>
                                  <IconButton
                                    size="small"
                                    color={action.color || 'default'}
                                    onClick={(e) => { e.stopPropagation(); action.onClick(row); }}
                                    disabled={disabled}
                                    aria-label={action.tooltip || action.id}
                                    data-wtable-action="true"
                                  >
                                    {action.icon}
                                  </IconButton>
                                </span>
                              </Tooltip>
                            );
                          })
                        ) : (
                          <IconButton
                            aria-label="more actions"
                            size="small"
                            onClick={(e) => handleMenuOpen(e, row)}
                            data-wtable-action="true"
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {/* Detail Panel Row - Phase 10 */}
              {paginatedData.map((row, index) => {
                const originalRowIndex = processedData.indexOf(row);
                const rowId = getRowId(row, originalRowIndex);
                if (renderDetailPanel && expandedRows[rowId]) {
                  const colSpan = columns.length +
                                  (renderDetailPanel ? 1 : 0) +
                                  (enableRowSelection ? 1 : 0) +
                                  (rowActions && rowActions.length > 0 ? 1 : 0);
                  return (
                    <TableRow key={`${rowId}-detail`}>
                      <TableCell colSpan={colSpan} sx={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' /* Optional: remove border if it looks odd with collapse */ }}>
                        <Collapse in={expandedRows[rowId]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            {renderDetailPanel(row, originalRowIndex)}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  );
                }
                return null;
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      {pagination && !loading && (
        <TablePagination
          component="div"
          count={currentTotalRowCount}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
      {focusedRowForMenu && rowActions && (
        <Menu
          anchorEl={rowMenuAnchorEl}
          open={Boolean(rowMenuAnchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          {rowActions.map((action) => {
            const disabled = typeof action.disabled === 'function' ? action.disabled(focusedRowForMenu) : action.disabled;
            return (
              <MenuItem
                key={action.id}
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(focusedRowForMenu);
                  handleMenuClose();
                }}
              >
                {action.icon && <ListItemIcon>{React.cloneElement(action.icon, { fontSize: 'small' })}</ListItemIcon>}
                <ListItemText>{action.tooltip || action.id}</ListItemText>
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </>
  );

  return paperComponent ? <Paper elevation={1}>{tableMarkup}</Paper> : tableMarkup;
}

export default WTable;
