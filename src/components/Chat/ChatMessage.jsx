import {
  Avatar,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";

const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

function ChatMessage({ message, user }) {
  return (
    <ListItem
      sx={{
        p: "4px 16px",
        display: "flex",
        flexDirection:
          message.user.id === user.currentUser.uid ? "row-reverse" : "",
      }}
    >
      <ListItemAvatar
        sx={{
          alignSelf: "stretch",
        }}
      >
        <Avatar
          variant="rounded"
          sx={{ width: 50, height: 50 }}
          alt="profile image"
          src={message.user.avatar}
        />
      </ListItemAvatar>
      <Grid
        container
        sx={{
          ml: message.user.id === user.currentUser.uid ? "" : 2,
          mr: message.user.id === user.currentUser.uid ? 2 : "",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            // flexDirection: "row-reverse",
            justifyContent: "left",
          }}
        >
          <ListItemText
            sx={{
              display: "flex",
              flexDirection:
                message.user.id === user.currentUser.uid ? "row-reverse" : "",
              alignItems: "center",
            }}
            primary={message.user.name}
            primaryTypographyProps={{
              fontWeight: "bold",
              color:
                message.user.id === user.currentUser.uid ? "orange" : "black",
            }}
            secondary={dayjs(message.timestamp).fromNow()}
            secondaryTypographyProps={{
              color: "var(--main-color)",
              ml: 1,
              mr: 1,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ListItemText
            align="left"
            sx={{
              wordBreak: "break-all",
              background: "var(--white-color)",
              p: "5px 10px 5px 10px",
              borderRadius:
                message.user.id === user.currentUser.uid
                  ? "8px 0 8px 8px"
                  : "0 8px 8px 8px",
              display: "inline-block",
              float: message.user.id === user.currentUser.uid ? "right" : "",
            }}
            primary={message.content}
          />
          {/* add TODO image */}
          {/* <img alt="img message" src="" style={{ maxWidth: "100%" }} /> */}
        </Grid>
      </Grid>
    </ListItem>
  );
}

export default ChatMessage;
