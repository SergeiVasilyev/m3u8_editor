import { useState } from "react";

import FileLoader from "./components/FileLoader";
import PlaylistView from "./components/PlaylistView";

import {
  parseM3U,
  unparseM3U
} from "./parser/m3u_parser";

function App() {
  const [channels, setChannels] =
    useState([]);
  const [fileName, setFileName] =
    useState("playlist.m3u8");

  const handleLoad = (
    content,
    loadedFileName
  ) => {
    setChannels(parseM3U(content));
    setFileName(
      loadedFileName || "playlist.m3u8"
    );
  };

  const handleCopyChannel = (
    channelId,
    targetGroup
  ) => {
    setChannels(currentChannels => {
      const channel = currentChannels.find(
        item => item.id === channelId
      );

      if (
        !channel ||
        channel.group === targetGroup
      ) {
        return currentChannels;
      }

      return [
        ...currentChannels,
        {
          ...channel,
          id: crypto.randomUUID(),
          group: targetGroup
        }
      ];
    });
  };

  const handleSave = () => {
    const content = unparseM3U(channels);
    const blob = new Blob(
      [content],
      {
        type:
          "application/vnd.apple.mpegurl;charset=utf-8"
      }
    );
    const url = URL.createObjectURL(blob);
    const link =
      document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>M3U Editor</h1>

      <FileLoader
        onLoad={handleLoad}
      />

      {channels.length > 0 && (
        <>
          <button
            type="button"
            onClick={handleSave}
            style={{
              marginTop: "20px"
            }}
          >
            Сохранить M3U8
          </button>

          <PlaylistView
            channels={channels}
            onCopyChannel={
              handleCopyChannel
            }
          />
        </>
      )}
    </div>
  );
}

export default App;
