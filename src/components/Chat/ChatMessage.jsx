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

// 받은 메세지가 이미지인지 구분
const IsImage = (message) => message.hasOwnProperty("image");

function ChatMessage({ message, user, channelInfo }) {
  return (
    <>
      <ListItem
        sx={{
          mb: "5px",
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
            sx={{ width: 50, height: 50, borderRadius: "15px" }}
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
                mt: 0,
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
            {/* add TODO image */}
            {IsImage(message) ? (
              <img
                alt="img message"
                src={message.image}
                style={{
                  borderRadius: "8px",
                  maxWidth: "40%",
                  float:
                    message.user.id === user.currentUser.uid ? "right" : "left",
                }}
              />
            ) : (
              <ListItemText
                align="left"
                sx={{
                  marginTop: "0px",
                  wordBreak: "break-all",
                  background:
                    message.user.id === user.currentUser.uid
                      ? "var(--secondary-color)"
                      : "var(--white-color)",
                  p: "5px 10px 5px 10px",
                  borderRadius:
                    message.user.id === user.currentUser.uid
                      ? "8px 0 8px 8px"
                      : "0 8px 8px 8px",
                  display: "inline-block",
                  float:
                    message.user.id === user.currentUser.uid ? "right" : "",
                }}
                primary={message.content}
              />
            )}
          </Grid>
        </Grid>
      </ListItem>
    </>
  );
}

export default ChatMessage;
