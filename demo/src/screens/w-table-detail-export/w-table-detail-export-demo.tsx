import React, { useMemo, useCallback } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
// Adjust this import path
import { WTable, WColumn } from '../../../../src';

interface DetailExportDemoRow {
  id: string;
  orderName: string;
  customer: string;
  items: number;
  totalAmount: number;
  orderDate: string;
  details?: { // Optional details for the panel
    shippingAddress: string;
    notes?: string;
    itemBreakdown: { itemName: string; quantity: number; price: number }[];
  };
}

const generateDetailExportData = (count: number): DetailExportDemoRow[] => {
  const data: DetailExportDemoRow[] = [];
  const orderPrefixes = ['ORD-', 'INV-', 'SHIP-', 'SALE-'];
  const customers = ['Global Corp', 'Local Biz Ltd.', 'Tech Solutions Inc.', 'Retail Goods Co.'];
  const itemNames = ['Widget', 'Gadget', 'Doohickey', 'Thingamajig'];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const itemCount = Math.floor(Math.random() * 5) + 1;
    let total = 0;
    const itemBreakdown: DetailExportDemoRow['details']['itemBreakdown'] = [];
    for(let j=0; j<itemCount; j++) {
      const price = parseFloat((Math.random() * 100 + 5).toFixed(2));
      const quantity = Math.floor(Math.random() * 3) + 1;
      itemBreakdown.push({
        itemName: itemNames[Math.floor(Math.random() * itemNames.length)],
        quantity,
        price
      });
      total += price * quantity;
    }

    const daysAgo = Math.floor(Math.random() * 60);
    const orderDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    data.push({
      id: `${orderPrefixes[Math.floor(Math.random() * orderPrefixes.length)]}${1000 + i}`,
      orderName: `Order #${1000 + i}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      items: itemCount,
      totalAmount: parseFloat(total.toFixed(2)),
      orderDate: orderDate.toLocaleDateString(),
      details: {
        shippingAddress: `${100 + i} Main St, Anytown, USA`,
        notes: Math.random() > 0.5 ? `Order notes for #${1000+i}` : undefined,
        itemBreakdown,
      }
    });
  }
  return data;
};

const DetailExportTableDemoScreen: React.FC = () => {
  const columns = useMemo<WColumn<DetailExportDemoRow>[]>(
    () => [
      { id: 'id', label: 'Order ID', accessor: 'id', width: 150 },
      { id: 'customer', label: 'Customer', accessor: 'customer', width: 200 },
      { id: 'items', label: 'Items', accessor: 'items', width: 100, align: 'center' },
      { id: 'totalAmount', label: 'Total ($)', accessor: 'totalAmount', width: 120, align: 'right',
        accessorFnForExport: (row) => row.totalAmount // Ensure raw number for export
      },
      { id: 'orderDate', label: 'Order Date', accessor: 'orderDate', width: 150, align: 'center' },
    ],
    [],
  );

  const data = useMemo(() => generateDetailExportData(12), []);

  const renderDetailPanel = useCallback((rowData: DetailExportDemoRow, rowIndex: number) => {
    if (!rowData.details) return <Typography sx={{p:2}}>No additional details for this order.</Typography>;
    return (
      <Box sx={{ p: 2, bgcolor: 'background.default', borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
        <Typography variant="subtitle1" gutterBottom>Order Details for {rowData.orderName}</Typography>
        <Typography variant="body2"><strong>Shipping Address:</strong> {rowData.details.shippingAddress}</Typography>
        {rowData.details.notes && <Typography variant="body2"><strong>Notes:</strong> {rowData.details.notes}</Typography>}
        <Typography variant="subtitle2" sx={{mt: 1}}>Items:</Typography>
        <List dense disablePadding>
          {rowData.details.itemBreakdown.map((item, idx) => (
            <ListItem key={idx} disableGutters sx={{pl:2}}>
              <ListItemText
                primary={`${item.itemName} (x${item.quantity})`}
                secondary={`$${item.price.toFixed(2)} each - Total: $${(item.price * item.quantity).toFixed(2)}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }, []);

  // Example of custom export columns to flatten data
  const customExportColumns: WColumn<DetailExportDemoRow>[] = useMemo(() => [
    { id: 'id', label: 'Order ID', accessor: 'id' },
    { id: 'customer', label: 'Customer Name', accessor: 'customer' },
    { id: 'itemsInOrder', label: 'Number of Items', accessor: 'items' },
    { id: 'orderTotal', label: 'Order Total ($)', accessor: 'totalAmount' },
    { id: 'dateOfOrder', label: 'Date of Order', accessor: 'orderDate' },
    { id: 'shippingTo', label: 'Shipping Address', accessor: (row) => row.details?.shippingAddress || '' },
    { id: 'orderNotes', label: 'Notes', accessor: (row) => row.details?.notes || '' },
  ], []);


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        WTable - Detail Panel & Data Export
      </Typography>
      <WTable<DetailExportDemoRow>
        columns={columns}
        data={data}
        title="Customer Orders"
        pagination
        defaultRowsPerPage={5}
        rowsPerPageOptions={[5, 10]}
        paperComponent
        stickyHeader
        getRowId={(row) => row.id}

        renderDetailPanel={renderDetailPanel}

        enableExport // Default is 'filtered', can also be true, 'all', 'selected'
        exportFileName="customer_orders.csv"
        // exportColumns={customExportColumns} // Uncomment to use custom columns for export
      />
    </Box>
  );
};

export default DetailExportTableDemoScreen;
