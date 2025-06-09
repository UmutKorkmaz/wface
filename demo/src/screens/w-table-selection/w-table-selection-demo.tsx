import React, { useMemo, useState, useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
// Adjust this import path based on your actual project structure
import { WTable, WColumn } from '../../../../src';

interface SelectionDemoRow {
  id: string; // Using string IDs for variety
  name: string;
  category: string;
  lastActivity: string; // Date string
  isActive: boolean;
}

const generateSelectionData = (count: number): SelectionDemoRow[] => {
  const data: SelectionDemoRow[] = [];
  const names = ['Document Alpha', 'Project Beta', 'Task Gamma', 'File Delta', 'Report Epsilon', 'Memo Zeta'];
  const categories = ['Work', 'Personal', 'Finance', 'Health', 'Archive'];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const activityDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    data.push({
      id: `item-${i.toString().padStart(3, '0')}`,
      name: names[Math.floor(Math.random() * names.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      lastActivity: activityDate.toLocaleDateString(),
      isActive: Math.random() > 0.4, // Some active, some not
    });
  }
  return data;
};

const SelectionTableDemoScreen: React.FC = () => {
  const columns = useMemo<WColumn<SelectionDemoRow>[]>(
    () => [
      { id: 'id', label: 'ID', accessor: 'id', width: 120 },
      { id: 'name', label: 'Item Name', accessor: 'name', width: 200 },
      { id: 'category', label: 'Category', accessor: 'category', width: 150 },
      { id: 'lastActivity', label: 'Last Activity', accessor: 'lastActivity', width: 150, align: 'center' },
      {
        id: 'isActive',
        label: 'Active',
        accessor: (row) => (row.isActive ? 'Yes' : 'No'),
        width: 100,
        align: 'center'
      },
    ],
    [],
  );

  const data = useMemo(() => generateSelectionData(15), []);

  const [selectedIds, setSelectedIds] = useState<Record<string | number, boolean>>({});
  const [selectedDataObjects, setSelectedDataObjects] = useState<SelectionDemoRow[]>([]);

  const handleSelectionChange = useCallback((
    selectedRowIds: Record<string | number, boolean>,
    selectedRows: SelectionDemoRow[]
  ) => {
    setSelectedIds(selectedRowIds);
    setSelectedDataObjects(selectedRows);
    console.log('Selected Row IDs:', selectedRowIds);
    console.log('Selected Row Data Objects:', selectedRows);
  }, []);

  // Example of how to make some rows non-selectable
  const canSelectRow = useCallback((rowData: SelectionDemoRow) => {
    return rowData.isActive; // Only allow selection of active items
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        WTable - Row Selection
      </Typography>
      <WTable<SelectionDemoRow>
        columns={columns}
        data={data}
        title="Selectable Items"
        pagination
        defaultRowsPerPage={7}
        rowsPerPageOptions={[5, 7, 10, 15]}
        paperComponent
        stickyHeader
        enableRowSelection={canSelectRow} // Example: enable selection based on a condition
        // enableRowSelection // Or simply true to enable for all
        onRowSelectionChange={handleSelectionChange}
        // For controlled selection, you would pass:
        // selectedRowIds={selectedIds}
        getRowId={(row) => row.id} // Important for stable selection if 'id' is the unique key
      />
      <Paper sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6">Selected Items:</Typography>
        {selectedDataObjects.length > 0 ? (
          <ul>
            {selectedDataObjects.map(item => (
              <li key={item.id}>{item.name} (ID: {item.id})</li>
            ))}
          </ul>
        ) : (
          <Typography>No items selected.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default SelectionTableDemoScreen;
