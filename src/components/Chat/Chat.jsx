import { Divider, Grid, List, Paper, Toolbar } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import { useSelector } from "react-redux";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import "../../firebase";
import {
  child,
  get,
  getDatabase,
  onChildAdded,
  orderByChild,
  query,
  ref,
  startAt,
} from "firebase/database";

function Chat() {
  const { channel, user } = useSelector((state) => state);
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef();

  // 이미 저장된 메세지
  useEffect(() => {
    if (!channel.currentChannel) return;
    async function getMessages() {
      const snapShot = await get(
        child(ref(getDatabase()), "messages/" + channel.currentChannel.id)
      );
      setMessages(snapShot.val() ? Object.values(snapShot.val()) : []);
    }
    getMessages();
    return () => {
      setMessages([]);
    };
  }, [channel.currentChannel]);

  useEffect(() => {
    if (!channel.currentChannel) return;
    const sorted = query(
      ref(getDatabase(), "messages/" + channel.currentChannel.id),
      orderByChild("timestamp")
    );
    const unsubscribe = onChildAdded(
      query(sorted, startAt(Date.now())),
      (snapShot) =>
        setMessages((oldMessages) => [...oldMessages, snapShot.val()])
    );
    return () => {
      unsubscribe?.();
    };
  }, [channel.currentChannel]);

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 2000);
    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [messages.length]);

  return (
    <>
      {/* <Toolbar /> */}
      {/* <ChatHeader channelInfo={channel.currentChannel} /> */}
      <Grid
        container
        component={Paper}
        variant="outlined"
        sx={{ mt: 8, position: "relative" }}
      >
        {/* <div style={{ width: "100%", position: "absolute" }}>
          <p
            style={{
              fontSize: "26px",
              fontWeight: "600",
              margin: "5px",
              textAlign: "center",
            }}
          >
            {channel.currentChannel?.name}
          </p>
        </div> */}
        <List
          sx={{
            zIndex: "5",
            pt: "45px",
            height: "calc(100vh - 265px)",
            // minHeight: "250px",
            overflowY: "scroll",
            width: "100%",
            position: "relative",
          }}
        >
          {/* chat message */}
          {messages.map((message) => (
            <ChatMessage
              key={message.timestamp}
              message={message}
              user={user}
            />
          ))}
          <div ref={messageEndRef}></div>
        </List>
        <Divider />
        <ChatInput />
        <div style={{ width: "100%", position: "absolute", top: "0" }}>
          <p
            style={{
              fontSize: "26px",
              fontWeight: "600",
              margin: "5px 0 8px",
              textAlign: "center",
            }}
          >
            {channel.currentChannel?.name}
          </p>
        </div>
      </Grid>
    </>
  );
}

export default Chat;
