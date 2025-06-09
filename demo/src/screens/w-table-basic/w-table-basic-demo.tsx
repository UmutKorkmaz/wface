import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
// Adjust this import path based on your actual project structure
// Assuming WTable is exported from the root of your src or a specific components path
import { WTable, WColumn } from '../../../../src';

interface BasicDemoRow {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  occupation: string;
  country: string;
}

const generateDemoData = (count: number): BasicDemoRow[] => {
  const data: BasicDemoRow[] = [];
  const firstNames = ['John', 'Jane', 'Mike', 'Sue', 'Tom', 'Emily', 'David', 'Laura'];
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson'];
  const occupations = ['Engineer', 'Doctor', 'Teacher', 'Artist', 'Developer', 'Nurse', 'Musician', 'Writer'];
  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Australia', 'Japan', 'Brazil'];

  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      age: Math.floor(Math.random() * 40) + 20, // Ages between 20 and 59
      email: `user${i}@example.com`,
      occupation: occupations[Math.floor(Math.random() * occupations.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
    });
  }
  return data;
};

const BasicTableDemoScreen: React.FC = () => {
  const columns = useMemo<WColumn<BasicDemoRow>[]>(
    () => [
      { id: 'id', label: 'ID', accessor: 'id', width: 80, align: 'center' },
      { id: 'firstName', label: 'First Name', accessor: 'firstName', width: 150 },
      { id: 'lastName', label: 'Last Name', accessor: 'lastName', width: 150 },
      { id: 'age', label: 'Age', accessor: 'age', width: 100, align: 'right' },
      { id: 'email', label: 'Email Address', accessor: 'email', width: 250 },
      { id: 'occupation', label: 'Occupation', accessor: 'occupation', width: 180 },
      { id: 'country', label: 'Country', accessor: 'country', width: 150 },
    ],
    [],
  );

  const data = useMemo(() => generateDemoData(25), []); // Generate 25 rows

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        WTable - Basic Display & Pagination
      </Typography>
      <WTable<BasicDemoRow>
        columns={columns}
        data={data}
        title="Employee Data (Basic)"
        pagination // Default is true, explicitly set for clarity
        defaultRowsPerPage={10}
        rowsPerPageOptions={[5, 10, 20, 25]}
        paperComponent // Enable Paper wrapper
        stickyHeader
      />
    </Box>
  );
};

export default BasicTableDemoScreen;
