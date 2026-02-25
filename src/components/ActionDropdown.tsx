import * as React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { Add } from "@mui/icons-material";

type ActionType = {
  key: string;
  label?: string;
  action: () => void;
};

interface IActionDropdown {
  label: string;
  actions: ActionType[];
}

export const ActionDropdown = ({ label, actions }: IActionDropdown) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCallAction = (action: () => void) => {
    handleClose();
    action();
  };

  return (
    <div>
      <Button
        variant="outlined"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Add color="action" sx={{ color: "white" }} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        {actions?.map(item => (
          <MenuItem
            key={item.key}
            onClick={() => handleCallAction(item.action)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
