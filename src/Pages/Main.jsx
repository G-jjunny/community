import { Box, Drawer, Toolbar } from "@mui/material";
import React from "react";
import ChannelMenu from "../components/Menu/ChannelMenu";
import Header from "../components/Header";
import Chat from "../components/Chat/Chat";

function Main() {
  // TODO backgroundColor 테마 적용
  return (
    <Box sx={{ display: "flex", backgroundColor: "#fff" }}>
      <Header />
      <Drawer variant="permanent" sx={{ width: 240 }} className="no-scroll">
        <Toolbar />
        <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
          <ChannelMenu />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Chat />
      </Box>
    </Box>
  );
}

export default Main;
