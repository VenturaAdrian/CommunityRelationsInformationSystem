import { memo, useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import NavItem from './NavItem';
import NavGroup from './NavGroup';
import getMenuItems from 'menu-items'; // ✅ now a function

import { useGetMenuMaster } from 'api/menu';

function MenuList() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [selectedID, setSelectedID] = useState('');
  const [menuItems, setMenuItems] = useState({ items: [] });

  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    const position = empInfo?.emp_position || '';
    const items = getMenuItems(position);
    setMenuItems(items);
  }, []);

  const lastItem = null;

  let lastItemIndex = menuItems.items.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && { url: item.url })
    }));
  }

  const navItems = menuItems.items.slice(0, lastItemIndex + 1).map((item, index) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <List key={item.id}>
              <NavItem item={item} level={1} isParents setSelectedID={() => setSelectedID('')} />
              {index !== 0 && <Divider sx={{ py: 0.5 }} />}
            </List>
          );
        }

        return (
          <NavGroup
            key={item.id}
            setSelectedID={setSelectedID}
            selectedID={selectedID}
            item={item}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
          />
        );

      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <Box {...(drawerOpen && { sx: { mt: 1.5 } })}>{navItems}</Box>;
}

export default memo(MenuList);
