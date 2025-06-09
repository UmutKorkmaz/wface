import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
// Adjust this import path based on your actual project structure
import { WTable, WColumn } from '../../../../src';

interface SortFilterDemoRow {
  id: number;
  productName: string;
  category: 'Electronics' | 'Books' | 'Clothing' | 'Home Goods';
  price: number;
  stock: number;
  rating: number; // 1-5
}

const generateSortFilterData = (count: number): SortFilterDemoRow[] => {
  const data: SortFilterDemoRow[] = [];
  const productPrefixes = ['Smart', 'Eco', 'Pro', 'Ultra', 'Basic', 'Advanced'];
  const productSuffixes = ['Phone', 'Laptop', 'Shirt', 'Lamp', 'Cookbook', 'Headphones'];
  const categories: SortFilterDemoRow['category'][] = ['Electronics', 'Books', 'Clothing', 'Home Goods'];

  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      productName: `${productPrefixes[Math.floor(Math.random() * productPrefixes.length)]} ${productSuffixes[Math.floor(Math.random() * productSuffixes.length)]} X${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: parseFloat((Math.random() * 200 + 10).toFixed(2)), // Price between 10.00 and 210.00
      stock: Math.floor(Math.random() * 100),
      rating: Math.floor(Math.random() * 5) + 1,
    });
  }
  return data;
};

const SortFilterTableDemoScreen: React.FC = () => {
  const columns = useMemo<WColumn<SortFilterDemoRow>[]>(
    () => [
      { id: 'id', label: 'ID', accessor: 'id', width: 80, align: 'center', disableSort: true, disableGlobalFilter: true },
      { id: 'productName', label: 'Product Name', accessor: 'productName', width: 250 },
      { id: 'category', label: 'Category', accessor: 'category', width: 150 },
      { id: 'price', label: 'Price ($)', accessor: 'price', width: 120, align: 'right' },
      { id: 'stock', label: 'Stock', accessor: 'stock', width: 100, align: 'right' },
      { id: 'rating', label: 'Rating (1-5)', accessor: 'rating', width: 150, align: 'center' },
    ],
    [],
  );

  const data = useMemo(() => generateSortFilterData(30), []); // Generate 30 rows

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        WTable - Sorting & Global Filtering
      </Typography>
      <WTable<SortFilterDemoRow>
        columns={columns}
        data={data}
        title="Product Inventory"
        pagination
        defaultRowsPerPage={10}
        rowsPerPageOptions={[5, 10, 20, 30]}
        paperComponent
        stickyHeader
        enableGlobalFilter // Enable global search
        initialSortBy={{ columnId: 'price', direction: 'desc' }} // Initial sort
      />
    </Box>
  );
};

export default SortFilterTableDemoScreen;
