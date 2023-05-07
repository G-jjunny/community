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
import React, { useCallback, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import "../../firebase";
import {
  child,
  getDatabase,
  onChildAdded,
  push,
  ref,
  update,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../store/themeReducer";

function ThemeMenu() {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  // state
  const [showThemeModal, setShowThemeModal] = useState(false);

  const [mainTheme, setMainTheme] = useState("#FFFFFF");
  const [subTheme, setSubTheme] = useState("#FFFFFF");
  const [textTheme, setTextTheme] = useState("#FFFFFF");
  const [userTheme, setUserTheme] = useState([]);

  const handleClickOpen = useCallback(() => setShowThemeModal(true), []);
  const handleClose = useCallback(() => setShowThemeModal(false), []);

  const handleChangeMain = useCallback((color) => setMainTheme(color), []);
  const handleChangeSub = useCallback((color) => setSubTheme(color), []);
  const handleChangeText = useCallback((color) => setTextTheme(color), []);

  const handleSaveTheme = useCallback(async () => {
    if (!user.currentUser?.uid) return;
    try {
      const db = getDatabase();
      const key = push(
        child(ref(db), "/users/" + user.currentUser.uid + "/theme")
      ).key;
      const newTheme = { mainTheme, subTheme, textTheme };
      const updates = {};
      updates["/users/" + user.currentUser.uid + "/theme/" + key] = newTheme;
      await update(ref(db), updates);
      handleClose();
    } catch (error) {
      console.log(error);
      handleClose();
    }
  }, [handleClose, mainTheme, subTheme, textTheme, user.currentUser.uid]);

  useEffect(() => {
    if (!user.currentUser?.uid) return;
    const db = getDatabase();
    const themeRef = ref(db, "users/" + user.currentUser.uid + "/theme");
    const unsubscribe = onChildAdded(themeRef, (snap) => {
      setUserTheme((themeArr) => [snap.val(), ...themeArr]);
    });
    return () => {
      setUserTheme([]);
      unsubscribe?.();
    };
  }, [user.currentUser?.uid]);

  return (
    <>
      <List sx={{ overflow: "auto", width: 60, backgroundColor: "#5f5f5f" }}>
        <ListItem button onClick={handleClickOpen}>
          <ListItemIcon sx={{ color: "white" }}>
            <PaletteIcon />
          </ListItemIcon>
        </ListItem>
        {/* 추가되는 테마 */}
        {userTheme.map((theme, i) => (
          <ListItem key={i}>
            <div
              className="theme-box"
              onClick={() => {
                dispatch(
                  setTheme(theme.mainTheme, theme.subTheme, theme.textTheme)
                );
              }}
            >
              <div
                className="theme-main"
                style={{ backgroundColor: theme.mainTheme }}
              ></div>
              <div
                className="theme-sub"
                style={{ backgroundColor: theme.subTheme }}
              ></div>
              <div
                className="theme-text"
                style={{ backgroundColor: theme.textTheme }}
              ></div>
            </div>
          </ListItem>
        ))}
      </List>
      <Dialog open={showThemeModal} onClose={handleClose}>
        <DialogTitle>테마 색상 변경</DialogTitle>
        <DialogContent sx={{ p: "0 10px" }}>
          <Stack direction={"row"} spacing={2}>
            <div style={{ textAlign: "center" }}>
              Main
              <HexColorPicker color={mainTheme} onChange={handleChangeMain} />
            </div>
            <div style={{ textAlign: "center" }}>
              Sub
              <HexColorPicker color={subTheme} onChange={handleChangeSub} />
            </div>
            <div style={{ textAlign: "center" }}>
              Text
              <HexColorPicker color={textTheme} onChange={handleChangeText} />
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSaveTheme}>테마 적용</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ThemeMenu;
