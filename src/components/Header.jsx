import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import "../firebase";
import { getAuth, signOut } from "firebase/auth";
import ProfileModal from "./Modal/ProfileModal";
import TelegramIcon from "@mui/icons-material/Telegram";

function Header() {
  const { user, theme } = useSelector((state) => state);

  // state
  const [anchorEl, setAnchorEl] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  //   menu event
  const handleOpenMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  //   setAnchorEl을 null로 초기화 함으로 menu닫기
  const handleCloseMenu = useCallback(() => setAnchorEl(null), []);

  // profile modal state
  const handleClickOpen = useCallback(() => {
    setShowProfileModal(true);
    handleCloseMenu();
  }, [handleCloseMenu]);

  const handleCloseProfileModal = useCallback(() => {
    setShowProfileModal(false);
  }, []);

  //   로그아웃
  const handleLogout = async () => {
    await signOut(getAuth());
  };

  return (
    <>
      {/* TODO background theme 적용 */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          // color: "#eef3ee",
          color: theme.textTheme,
          // backgroundColor: "#a5a19c",
          backgroundColor: theme.mainTheme,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "50px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <TelegramIcon />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              JJUNNY COMMUNITY
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleOpenMenu}>
              <Typography
                variant="h6"
                component="div"
                // sx={{ color: "#eef3ee" }}
                sx={{ color: theme.textTheme, fontWeight: "bold" }}
              >
                {user.currentUser?.displayName}
              </Typography>
              <Avatar
                sx={{ marginLeft: "10px" }}
                alt="profileImage"
                src={user.currentUser?.photoURL}
              />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleClickOpen}>
                <Typography textAlign={"center"}>프로필 변경</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign={"center"}>로그아웃</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <ProfileModal
        open={showProfileModal}
        handleClose={handleCloseProfileModal}
      />
    </>
  );
}

export default Header;
