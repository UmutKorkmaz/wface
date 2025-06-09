import React, { useMemo, useState, useCallback } from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArchiveIcon from '@mui/icons-material/Archive';
// Adjust this import path
import { WTable, WColumn, WTableRowAction, WTableBulkAction } from '../../../../src';

interface ActionsDemoRow {
  id: number;
  name: string;
  status: 'Active' | 'Archived' | 'Pending';
  lastModified: string;
}

const generateActionsData = (count: number): ActionsDemoRow[] => {
  const data: ActionsDemoRow[] = [];
  const names = ['Feature Request', 'Bug Report', 'User Story', 'Documentation Task', 'Deployment Plan'];
  const statuses: ActionsDemoRow['status'][] = ['Active', 'Archived', 'Pending'];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const daysAgo = Math.floor(Math.random() * 15);
    const modifiedDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    data.push({
      id: i,
      name: `${names[Math.floor(Math.random() * names.length)]} #${i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastModified: modifiedDate.toLocaleDateString(),
    });
  }
  return data;
};

const ActionsTableDemoScreen: React.FC = () => {
  const [renderAsMenu, setRenderAsMenu] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const columns = useMemo<WColumn<ActionsDemoRow>[]>(
    () => [
      { id: 'id', label: 'ID', accessor: 'id', width: 80, align: 'center' },
      { id: 'name', label: 'Task Name', accessor: 'name', width: 250 },
      { id: 'status', label: 'Status', accessor: 'status', width: 120 },
      { id: 'lastModified', label: 'Last Modified', accessor: 'lastModified', width: 150, align: 'center' },
    ],
    [],
  );

  const data = useMemo(() => generateActionsData(10), []);

  const rowActions = useMemo<WTableRowAction<ActionsDemoRow>[]>(() => [
    {
      id: 'view',
      icon: <VisibilityIcon />,
      tooltip: 'View Details',
      onClick: (rowData) => showFeedback(`Viewing item: ${rowData.name}`),
    },
    {
      id: 'edit',
      icon: <EditIcon />,
      tooltip: 'Edit Item',
      onClick: (rowData) => showFeedback(`Editing item: ${rowData.name}`),
      disabled: (rowData) => rowData.status === 'Archived',
    },
    {
      id: 'delete',
      icon: <DeleteIcon />,
      tooltip: 'Delete Item',
      color: 'error',
      onClick: (rowData) => showFeedback(`Deleting item: ${rowData.name}`),
      disabled: (rowData) => rowData.status === 'Archived',
    },
  ], []);

  const tableToolbarActions = useMemo<WTableBulkAction<ActionsDemoRow>[]>(() => [
    {
      id: 'archiveSelected',
      label: 'Archive Selected',
      icon: <ArchiveIcon />,
      tooltip: 'Archive all selected items',
      onClick: (selectedRows) => {
        showFeedback(`Archiving ${selectedRows.length} item(s): ${selectedRows.map(r => r.name).join(', ')}`);
      },
      disabled: (selectedRows) => selectedRows.length === 0 || selectedRows.every(row => row.status === 'Archived'),
    },
    {
      id: 'deleteSelected',
      label: 'Delete Selected',
      icon: <DeleteIcon />,
      color: 'error',
      variant: 'outlined',
      tooltip: 'Delete all selected items',
      onClick: (selectedRows) => {
        showFeedback(`Deleting ${selectedRows.length} item(s): ${selectedRows.map(r => r.name).join(', ')}`);
      },
      disabled: (selectedRows) => selectedRows.length === 0,
    }
  ], []);

  const [selectedIds, setSelectedIds] = useState<Record<string | number, boolean>>({});

  const handleSelectionChange = useCallback((
    selectedRowIds: Record<string | number, boolean>,
  ) => {
    setSelectedIds(selectedRowIds);
  }, []);


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        WTable - Actions (Per-Row & Bulk)
      </Typography>

      {feedbackMessage && <Alert severity="info" sx={{ mb: 2 }}>{feedbackMessage}</Alert>}

      <FormControlLabel
        control={<Switch checked={renderAsMenu} onChange={(e) => setRenderAsMenu(e.target.checked)} />}
        label="Render Row Actions as Menu"
        sx={{ mb: 2 }}
      />

      <WTable<ActionsDemoRow>
        columns={columns}
        data={data}
        title="Tasks Dashboard"
        pagination
        defaultRowsPerPage={5}
        rowsPerPageOptions={[5, 10]}
        paperComponent
        stickyHeader
        enableRowSelection // Required for bulk actions
        onRowSelectionChange={handleSelectionChange} // Manage selection
        selectedRowIds={selectedIds} // Control selection
        getRowId={(row) => row.id}

        rowActions={rowActions}
        renderRowActionsAsMenu={renderAsMenu}
        actionsColumnLabel={renderAsMenu ? "Options" : "Actions"} // Dynamic label

        tableToolbarActions={tableToolbarActions}
      />
    </Box>
  );
};

export default ActionsTableDemoScreen;
