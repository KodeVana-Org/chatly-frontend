import React, { useEffect, useRef, useState } from "react";
import {
  ChatTeardropSlash,
  Gif,
  Microphone,
  PaperPlaneTilt,
  VideoCamera,
  User,
  Users,
} from "@phosphor-icons/react";
import EmojiPicker from "../../components/EmojiPicker";
import UserInfo from "./UserInfo";
import Giphy from "../../components/Giphy";
import { useDispatch, useSelector } from "react-redux";
import { ToggleAudioModal } from "../../redux/slices/app";
import Attachment from "../../components/Attachment";
import MsgSeparator from "../../components/MsgSeparator";
import TypingIndicator from "../../components/TypingIndicator";
import {
  DocumentMessage,
  GiphyMessage,
  MediaMessage,
  TextMessage,
  VoiceMessage,
} from "../../components/Messages";
import {
  emitStartTyping,
  emitStopTyping,
  getDirectChatHistory,
  sendDirectMessage,
} from "../../socket/socketConnection";
import { format } from "date-fns";
import dateFormat, { masks } from "dateformat";
import VideoRoom from "../../components/VideoRoom";
// import AudioRoom from "../../components/AudioRoom";

export default function Inbox() {
  const dispatch = useDispatch();
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const containerRef = useRef(null);
  const [scheduledMessages, setScheduledMessages] = useState([]); // New state for scheduled messages NOTE:

  const { user } = useSelector((state) => state.user);
  const { currentConversation, conversations, typing } = useSelector(
    (state) => state.chat,
  );

  const [isTyping, setIsTyping] = useState(false);

  const this_conversation = conversations.find(
    (el) => el._id?.toString() === currentConversation?.toString(),
  );

  // Define other_user early; null for group chats
  const other_user = this_conversation?.isGroup
    ? null
    : this_conversation?.participants?.find((e) => e._id !== user._id);

  // Handle typing event
  useEffect(() => {
    if (isTyping && currentConversation) {
      const typingData = {
        userId: other_user?._id || null, // Null for group chats
        conversationId: currentConversation,
      };

      emitStartTyping(typingData);

      const timeout = setTimeout(() => {
        emitStopTyping(typingData);
        setIsTyping(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isTyping, currentConversation, other_user]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getDirectChatHistory({ conversationId: currentConversation });
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [currentConversation]);

  // Check and send scheduled messages NOTE:
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setScheduledMessages((prev) =>
        prev.filter((msg) => {
          if (new Date(msg.sendAt) <= now) {
            handleSendMsg(null, msg.content); // Send scheduled message
            return false; // Remove from list
          }
          return true; // Keep in list
        }),
      );
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [scheduledMessages]);

  const [videoCall, setVideoCall] = useState(false);
  // const [audioCall, setAudioCall] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);

  const handleToggleVideo = () => setVideoCall((p) => !p);
  // const handleToggleAudio = () => setAudioCall((p) => !p);
  const handleToggleGif = (e) => {
    e.preventDefault();
    setGifOpen((prev) => !prev);
  };
  const handleToggleUserInfo = () => setUserInfoOpen((prev) => !prev);
  const handleMicClick = (e) => {
    e.preventDefault();
    dispatch(ToggleAudioModal(true));
  };

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    if (!isTyping) setIsTyping(true);
    setInputValue(e.target.value);
  };

  const handleEmojiSelect = (emoji) => {
    setInputValue((prev) => prev + emoji.native);
  };

  function formatTime(dateString) {
    masks.hammerTime = "HH:MM";
    return dateFormat(dateString, "hammerTime");
  }

  const MSG_LIST = this_conversation?.messages
    ? this_conversation.messages
        .map((msg) => {
          const incoming = msg.author === user._id ? false : true;
          const author = this_conversation?.participants?.find(
            (p) => p._id === msg.author,
          );
          const authorName = incoming
            ? this_conversation?.isGroup
              ? author?.name || "Unknown"
              : other_user?.name || "Unknown"
            : user.name;
          const content = msg?.content;
          const timestamp = formatTime(msg.date);
          const type = msg?.type;
          const id = msg?._id;

          switch (type) {
            case "Text":
              return {
                id,
                incoming,
                content,
                timestamp,
                authorName,
                type,
                date: msg?.date,
              };
            case "Document":
              return {
                id,
                incoming,
                content,
                timestamp,
                authorName,
                type,
                document: msg.document,
                date: msg?.date,
              };
            case "Media":
              return {
                id,
                incoming,
                content,
                timestamp,
                authorName,
                type,
                media: msg.media,
                date: msg?.date,
              };
            case "Giphy":
              return {
                id,
                incoming,
                content,
                timestamp,
                authorName,
                type,
                giphy: msg.giphyUrl,
                date: msg?.date,
              };
            case "Audio":
              return {
                id,
                incoming,
                content,
                timestamp,
                authorName,
                type,
                audioUrl: msg?.audioUrl,
                date: msg?.date,
              };
            default:
              return null;
          }
        })
        .filter(Boolean)
    : [];

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentConversation, MSG_LIST]);

  const handleSendMsg = (e, scheduledContent = null) => {
    console.log("sending message");
    const content = scheduledContent || inputValue; // Use scheduled content if provided
    if (content) {
      const data = {
        conversationId: currentConversation,
        message: {
          author: user._id,
          type: "Text",
          content: content,
        },
      };
      sendDirectMessage(data);
      if (!scheduledContent) setInputValue(""); // Only clear input for manual send
    }
  };

  //const handleSendMsg = (e) => { TODO: old one
  //  console.log("sending message");
  //  if (inputValue) {
  //    const data = {
  //      conversationId: currentConversation,
  //      message: {
  //        author: user._id,
  //        type: "Text",
  //        content: inputValue,
  //      },
  //    };
  //    sendDirectMessage(data);
  //    setInputValue("");
  //  }
  //};

  return (
    <>
      {currentConversation ? (
        <div
          className={`flex h-full flex-col border-l border-stroke dark:border-strokedark w-full ${
            userInfoOpen ? "xl:w-1/2" : "xl:w-3/4"
          }`}
        >
          {/* Chat header */}
          <div className="sticky flex items-center flex-row justify-between border-b border-stroke dark:border-strokedark px-6 py-4.5">
            <div className="flex items-center" onClick={handleToggleUserInfo}>
              <div className="mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full">
                {this_conversation?.isGroup ? (
                  <div className="h-13 w-13 rounded-full bg-gray-300 flex items-center justify-center">
                    <Users size={24} color="#fff" />
                  </div>
                ) : other_user?.avatar ? (
                  <img
                    src={other_user?.avatar ? other_user.avatar : User}
                    alt="avatar"
                    className="h-13 w-13 rounded-full object-cover object-center"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-full border border-stroke dark:border-strokedark bg-gray dark:bg-boxdark flex items-center justify-center text-body dark:text-white capitalize">
                    {other_user?.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white text-nowrap">
                  {this_conversation?.isGroup
                    ? this_conversation.groupName
                    : other_user?.name || "Unknown"}
                </h5>
                {this_conversation?.isGroup ? (
                  <p className="text-sm text-gray-500">Group Chat</p>
                ) : typing?.conversationId === currentConversation &&
                  typing?.typing ? (
                  <p className="text-sm text-gray-500">Typing...</p>
                ) : (
                  <div
                    className={`text-sm font-medium ${
                      other_user?.status === "Online"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {other_user?.status}
                  </div>
                )}
              </div>
            </div>

            {/* Audio/Video call */}
            <div className="flex gap-5 pr-7">
              {/* 
              <button onClick={handleToggleAudio}>
                <Phone size={24} />
              </button>
              */}
              <button onClick={handleToggleVideo}>
                <VideoCamera size={24} />
              </button>
            </div>
          </div>

          {/* Message list */}
          <div
            ref={containerRef}
            className="max-h-full space-y-3.5 overflow-y-auto no-scrollbar px-6 py-7.5 grow"
          >
            {MSG_LIST.map((message, index) => {
              const isNewDay =
                index === 0 ||
                format(new Date(MSG_LIST[index - 1].date), "yyyy-MM-dd") !==
                  format(new Date(message.date), "yyyy-MM-dd");

              return (
                <React.Fragment key={message.id}>
                  {isNewDay && <MsgSeparator date={message.date} />}
                  {(() => {
                    switch (message.type) {
                      case "Text":
                        return (
                          <TextMessage
                            author={message.authorName}
                            content={message.content}
                            incoming={message.incoming}
                            timestamp={message.timestamp}
                            isGroup={this_conversation?.isGroup} // Pass isGroup
                          />
                        );
                      case "Giphy":
                        return (
                          <GiphyMessage
                            author={message.authorName}
                            content={message.content}
                            incoming={message.incoming}
                            timestamp={message.timestamp}
                            giphy={message.giphy}
                            isGroup={this_conversation?.isGroup} // Pass isGroup
                          />
                        );
                      case "Document":
                        return (
                          <DocumentMessage
                            author={message.authorName}
                            content={message.content}
                            incoming={message.incoming}
                            timestamp={message.timestamp}
                            documentFile={message.document}
                            isGroup={this_conversation?.isGroup} // Pass isGroup
                          />
                        );
                      case "Audio":
                        return (
                          <VoiceMessage
                            author={message.authorName}
                            content={message.content}
                            incoming={message.incoming}
                            timestamp={message.timestamp}
                            audioUrl={message.audioUrl}
                            isGroup={this_conversation?.isGroup} // Pass isGroup
                          />
                        );
                      case "Media":
                        return (
                          <MediaMessage
                            incoming={message.incoming}
                            author={message.authorName}
                            timestamp={message.timestamp}
                            media={message.media}
                            caption={message.content}
                            isGroup={this_conversation?.isGroup} // Pass isGroup
                          />
                        );
                      default:
                        return null;
                    }
                  })()}
                </React.Fragment>
              );
            })}
            {typing?.conversationId === currentConversation &&
              typing?.typing && <TypingIndicator />}
          </div>

          {/* Input */}
          <div className="sticky bottom-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between space-x-4.5">
              <div className="relative w-full">
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMsg(e);
                  }}
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Send Message..."
                  className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center space-x-4">
                  <button
                    onClick={handleMicClick}
                    className="hover:text-primary"
                  >
                    <Microphone size={20} />
                  </button>
                  <button className="hover:text-primary">
                    <Attachment />
                  </button>
                  <button onClick={handleToggleGif}>
                    <Gif size={20} />
                  </button>
                  <EmojiPicker onSelectEmoji={handleEmojiSelect} />
                </div>
              </div>
              <button
                onClick={handleSendMsg}
                disabled={!inputValue}
                className={`flex items-center justify-center h-13 w-13 rounded-md hover:bg-opacity-90 ${
                  !inputValue
                    ? "bg-gray text-body dark:bg-boxdark-2 dark:text-body"
                    : "bg-primary text-white"
                }`}
              >
                <PaperPlaneTilt size={24} weight="bold" />
              </button>
            </div>
            {gifOpen && <Giphy />}
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center w-full xl:w-3/4 border-l border-stroke dark:border-strokedark">
          <div className="flex flex-col space-y-4 items-center justify-center">
            <ChatTeardropSlash size={100} />
            <span className="text-lg font-semibold">
              No Conversation Selected
            </span>
          </div>
        </div>
      )}

      {videoCall && (
        <VideoRoom open={videoCall} handleClose={handleToggleVideo} />
      )}

      {/*
      {audioCall && (
        <AudioRoom open={audioCall} handleClose={handleToggleAudio} />
      )}
      */}

      {currentConversation && userInfoOpen && (
        <UserInfo
          user={other_user}
          group={this_conversation} // Use other_user here too (this_converstion)
          handleToggleUserInfo={handleToggleUserInfo}
          sendDirectMessage={sendDirectMessage} // Pass socket function
          handleSendMsg={handleSendMsg} // Pass send function
          currentConversation={currentConversation} // Pass conversation ID
          setScheduledMessages={setScheduledMessages} // Pass setter for scheduled messages
          scheduledMessages={scheduledMessages} // for listing all shedules
        />
      )}
    </>
  );
}
