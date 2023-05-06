import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  Stack,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import React, { useCallback, useState } from "react";
import { HexColorPicker } from "react-colorful";

function ThemeMenu() {
  // state
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleClickOpen = useCallback(() => setShowThemeModal(true), []);
  const handleClose = useCallback(() => setShowThemeModal(false), []);

  return (
    <>
      <List sx={{ overflow: "auto", width: 60, backgroundColor: "#5f5f5f" }}>
        <ListItem button onClick={handleClickOpen}>
          <ListItemIcon sx={{ color: "white" }}>
            <PaletteIcon />
          </ListItemIcon>
        </ListItem>
        {/* 추가되는 테마 */}
        <ListItem>
          <div className="theme-box">
            <div
              className="theme-main"
              style={{ backgroundColor: "red" }}
            ></div>
            <div
              className="theme-sub"
              style={{ backgroundColor: "royalblue" }}
            ></div>
          </div>
        </ListItem>
      </List>
      <Dialog open={showThemeModal} onClose={handleClose}>
        <DialogTitle>테마 색상 변경</DialogTitle>
        <DialogContent>
          <Stack direction={"row"} spacing={2}>
            <div>
              Main
              <HexColorPicker />
            </div>
            <div>
              Sub
              <HexColorPicker />
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button>테마 적용</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ThemeMenu;
