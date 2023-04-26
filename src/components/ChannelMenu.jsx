import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "../firebase";
import {
  child,
  getDatabase,
  onChildAdded,
  push,
  ref,
  update,
} from "firebase/database";
import { useDispatch } from "react-redux";
import { setCurrentChannel } from "../store/channelReducer";

function ChannelMenu() {
  // state
  const [open, setOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelDetail, setChannelDetail] = useState("");
  const [channels, setChannels] = useState([]);
  const [activeChannelId, setActiveChannelId] = useState("");
  const [firstLoaded, setFirstLoaded] = useState(true);
  const dispatch = useDispatch();

  const handleClickOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  //   handle
  useEffect(() => {
    // Mount 후 데이터 정보를 가져옴
    const unsubscribe = onChildAdded(
      ref(getDatabase(), "channels"),
      (snapshot) => {
        setChannels((channelArr) => [...channelArr, snapshot.val()]);
      }
    );

    return () => {
      setChannels([]);
      unsubscribe();
    };
  }, []);

  const changeChannel = useCallback(
    (channel) => {
      if (channel.id === activeChannelId) return;
      setActiveChannelId(channel.id);
      dispatch(setCurrentChannel(channel));
    },
    [dispatch, activeChannelId]
  );

  const handleChangeChannelName = useCallback(
    (e) => setChannelName(e.target.value),
    []
  );
  const handleChangeChannelDetail = useCallback(
    (e) => setChannelDetail(e.target.value),
    []
  );

  const handleSubmit = useCallback(async () => {
    //   data를 firebase에 저장
    const db = getDatabase();
    const key = push(child(ref(db), "channels")).key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetail,
    };
    const updates = {};
    updates["/channels/" + key] = newChannel;

    try {
      await update(ref(db), updates);
      setChannelName("");
      setChannelDetail("");
      handleClose();
    } catch (error) {
      console.log(error);
    }
  }, [channelDetail, channelName, handleClose]);

  useEffect(() => {
    if (channels.length > 0 && firstLoaded) {
      setActiveChannelId(channels[0].id);
      dispatch(setCurrentChannel(channels[0]));
      setFirstLoaded(false);
    }
  }, [channels, dispatch, firstLoaded]);

  const onKeyPressEnter = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      {/* TODO 테마 반영 */}
      <List sx={{ overflow: "auto", width: 240, backgroundColor: "#a5a19c" }}>
        <ListItem
          secondaryAction={
            <IconButton sx={{ color: "#eef3ee" }} onClick={handleClickOpen}>
              <AddIcon />
            </IconButton>
          }
        >
          <ListItemIcon sx={{ color: "#eef3ee" }}>
            <ArrowDropDownIcon />
          </ListItemIcon>
          <ListItemText
            primary="채널"
            sx={{ wordBreak: "break-all", color: "#eef3ee" }}
          />
        </ListItem>
        {/* <List component={"div"} disablePadding sx={{ pl: 3 }}> */}
        {
          // TODO store구현, selected 구현
          channels.map((channel) => (
            <ListItem
              button
              selected={channel.id === activeChannelId}
              onClick={() => changeChannel(channel)}
              key={channel.id}
            >
              <ListItemText
                primary={`# ${channel.name}`}
                sx={{ wordBreak: "break-all", color: "#eef3ee" }}
              />
            </ListItem>
          ))
        }
      </List>
      {/* </List> */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>채널 추가</DialogTitle>
        <DialogContent>
          <DialogContentText>
            생성할 채널명과 설명을 입력하세요.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="채널명"
            type={"text"}
            fullWidth
            variant="standard"
            onChange={handleChangeChannelName}
          />
          <TextField
            margin="dense"
            label="설명"
            type={"text"}
            fullWidth
            variant="standard"
            onChange={handleChangeChannelDetail}
            onKeyPress={onKeyPressEnter}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSubmit}>생성</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChannelMenu;
