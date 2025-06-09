import React, { useMemo, useState, useCallback } from 'react';
import { Box, Typography, Chip, Avatar, Rating, Alert } from '@mui/material';
// Adjust this import path
import { WTable, WColumn } from '../../../../src';

interface CellEditDemoRow {
  id: number;
  taskName: string;
  assignee: { name: string; avatarUrl?: string };
  priority: 'Low' | 'Medium' | 'High';
  progress: number; // 0-100
  notes: string;
}

const generateCellEditData = (count: number): CellEditDemoRow[] => {
  const data: CellEditDemoRow[] = [];
  const taskPrefixes = ['Develop', 'Test', 'Review', 'Deploy', 'Document', 'Fix'];
  const taskSuffixes = ['Login Page', 'API Endpoint', 'User Profile', 'Database Schema', 'Payment Gateway'];
  const assignees = [
    { name: 'Alice Wonderland', avatarUrl: '/static/images/avatar/1.jpg' }, // Placeholder URLs
    { name: 'Bob The Builder' },
    { name: 'Charlie Chaplin', avatarUrl: '/static/images/avatar/3.jpg' },
    { name: 'Diana Ross' },
  ];
  const priorities: CellEditDemoRow['priority'][] = ['Low', 'Medium', 'High'];

  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      taskName: `${taskPrefixes[Math.floor(Math.random() * taskPrefixes.length)]} ${taskSuffixes[Math.floor(Math.random() * taskSuffixes.length)]}`,
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      progress: Math.floor(Math.random() * 101),
      notes: `Note for task ${i}. Some details here.`,
    });
  }
  return data;
};

const CellEditTableDemoScreen: React.FC = () => {
  const [tableData, setTableData] = useState(() => generateCellEditData(8));
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const columns = useMemo<WColumn<CellEditDemoRow>[]>(
    () => [
      { id: 'id', label: 'ID', accessor: 'id', width: 70, align: 'center', editable: false },
      { id: 'taskName', label: 'Task Name', accessor: 'taskName', width: 250, editable: true },
      {
        id: 'assignee',
        label: 'Assignee',
        accessor: (row) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }} src={row.assignee.avatarUrl}>
              {row.assignee.name.charAt(0)}
            </Avatar>
            {row.assignee.name}
          </Box>
        ),
        width: 200,
        editable: false, // Editing complex objects via TextField is not straightforward
      },
      {
        id: 'priority',
        label: 'Priority',
        accessor: (row) => (
          <Chip
            label={row.priority}
            size="small"
            color={row.priority === 'High' ? 'error' : row.priority === 'Medium' ? 'warning' : 'default'}
          />
        ),
        width: 120,
        align: 'center',
        editable: false, // Would need a select/dropdown for editing this meaningfully
      },
      {
        id: 'progress',
        label: 'Progress',
        accessor: (row) => <Rating name={`progress-${row.id}`} value={row.progress / 20} max={5} readOnly size="small" />,
        width: 180,
        align: 'center',
        editable: false, // Would need a slider or number input for editing
      },
      { id: 'notes', label: 'Notes', accessor: 'notes', width: 300, editable: true },
    ],
    [],
  );

  const handleRowUpdate = useCallback(async (updatedRow: CellEditDemoRow, originalRow: CellEditDemoRow) => {
    // In a real app, you'd send this to a server
    console.log('Row update submitted:', { updatedRow, originalRow });
    setTableData(prev => prev.map(row => row.id === updatedRow.id ? updatedRow : row));
    showFeedback(`Task "${updatedRow.taskName}" updated!`);
    // Simulate async operation
    // return new Promise(resolve => setTimeout(resolve, 500));
  }, []);


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        WTable - Custom Cells & Editing
      </Typography>

      {feedbackMessage && <Alert severity="success" sx={{ mb: 2 }}>{feedbackMessage}</Alert>}

      <WTable<CellEditDemoRow>
        columns={columns}
        data={tableData}
        title="Project Tasks"
        pagination={false} // Keep it simple for this demo
        paperComponent
        stickyHeader
        enableEditing // Enable cell editing globally
        onRowUpdate={handleRowUpdate}
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

export default CellEditTableDemoScreen;
