import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper'; // Optional: for the list itself if CardContent is not enough
import Box from '@mui/material/Box';

import { WTransferListProps, WTransferListItem } from './w-transfer-list.types';

const defaultListSx = {
  width: 250,
  height: 230,
  overflow: 'auto',
  bgcolor: 'background.paper',
};

export const WTransferList: React.FC<WTransferListProps> = (props) => {
  const {
    id,
    leftListTitle = 'Choices',
    rightListTitle = 'Chosen',
    initialLeftItems = [],
    initialRightItems = [],
    onListChange,
    sx,
    cardSx,
    listSx = defaultListSx,
  } = props;

  const [leftItems, setLeftItems] = useState<WTransferListItem[]>(initialLeftItems);
  const [rightItems, setRightItems] = useState<WTransferListItem[]>(initialRightItems);
  const [leftChecked, setLeftChecked] = useState<Set<string | number>>(new Set());
  const [rightChecked, setRightChecked] = useState<Set<string | number>>(new Set());

  const handleToggle = (item: WTransferListItem, side: 'left' | 'right') => {
    const checkedSet = side === 'left' ? leftChecked : rightChecked;
    const setChecked = side === 'left' ? setLeftChecked : setRightChecked;
    const newChecked = new Set(checkedSet);
    if (checkedSet.has(item.id)) {
      newChecked.delete(item.id);
    } else {
      newChecked.add(item.id);
    }
    setChecked(newChecked);
  };

  const customList = (title: React.ReactNode, items: WTransferListItem[], side: 'left' | 'right') => (
    <Card sx={cardSx}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        // avatar={ // Placeholder for "select all" checkbox
        //   <Checkbox
        //     // onClick={handleToggleAll(items, side)}
        //     // checked={numberOfChecked(items, side) === items.length && items.length !== 0}
        //     // indeterminate={numberOfChecked(items, side) !== items.length && numberOfChecked(items, side) !== 0}
        //     // disabled={items.length === 0}
        //     inputProps={{ 'aria-label': 'all items selected' }}
        //   />
        // }
        title={title}
        subheader={`${side === 'left' ? leftChecked.size : rightChecked.size}/${items.length} selected`}
      />
      <Divider />
      <List sx={listSx} dense component="div" role="list">
        {items.map((item: WTransferListItem) => {
          const labelId = `transfer-list-all-item-${item.id}-label`;
          return (
            <ListItem
              key={item.id}
              role="listitem"
              onClick={() => handleToggle(item, side)}
              onKeyPress={(e) => e.key === 'Enter' && handleToggle(item, side)}
              disabled={item.disabled}
              sx={{ cursor: item.disabled ? 'default' : 'pointer', my: 0.25, py: 0.25, borderRadius:1, '&:hover': {bgcolor: item.disabled ? undefined : 'action.hover'} }}
            >
              <ListItemIcon sx={{minWidth: 'auto', mr: 1}}>
                <Checkbox
                  checked={ (side === 'left' ? leftChecked : rightChecked).has(item.id) }
                  disabled={item.disabled}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={item.label} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" sx={sx} id={id}>
      <Grid item xs={12} sm={5}>{customList(leftListTitle, leftItems, 'left')}</Grid>
      <Grid item xs={12} sm={2}>
        <Grid container direction={{xs: "row", sm: "column"}} alignItems="center" justifyContent="center" spacing={1}>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            // onClick={handleCheckedRight}
            // disabled={leftChecked.size === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            // onClick={handleCheckedLeft}
            // disabled={rightChecked.size === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          {/* Optional: Move all buttons */}
          {/* <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleAllRight} disabled={leftItems.length === 0} aria-label="move all right">&gt;&gt;</Button> */}
          {/* <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleAllLeft} disabled={rightItems.length === 0} aria-label="move all left">&lt;&lt;</Button> */}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={5}>{customList(rightListTitle, rightItems, 'right')}</Grid>
    </Grid>
  );
};
