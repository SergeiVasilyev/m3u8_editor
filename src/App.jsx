import { useState } from "react";

import FileLoader from "./components/FileLoader";
import PlaylistView from "./components/PlaylistView";
import VideoPlayer from "./components/VideoPlayer";

import {
  parseM3U,
  unparseM3U
} from "./parser/m3u_parser";

// Управляет плейлистом и переключает редактор в режим видеоплеера.
function App() {
  const searchParams = new URLSearchParams(
    window.location.search
  );
  const streamUrl =
    searchParams.get("stream");
  const streamName =
    searchParams.get("name");

  const [channels, setChannels] =
    useState([]);
  const [groups, setGroups] =
    useState([]);
  const [fileName, setFileName] =
    useState("playlist.m3u8");

  // Разбирает загруженный файл и сохраняет его каналы, группы и имя.
  const handleLoad = (
    content,
    loadedFileName
  ) => {
    const loadedChannels =
      parseM3U(content);

    setChannels(loadedChannels);
    setGroups([
      ...new Set(
        loadedChannels.map(
          channel => channel.group || ""
        )
      )
    ]);
    setFileName(
      loadedFileName || "playlist.m3u8"
    );
  };

  // Добавляет новую группу, если группы с таким именем ещё нет.
  const handleCreateGroup = groupName => {
    setGroups(currentGroups =>
      currentGroups.includes(groupName)
        ? currentGroups
        : [...currentGroups, groupName]
    );
  };

  // Переименовывает группу и обновляет имя группы у всех её каналов.
  const handleRenameGroup = (
    currentName,
    newName
  ) => {
    setGroups(currentGroups =>
      currentGroups.map(group =>
        group === currentName
          ? newName
          : group
      )
    );
    setChannels(currentChannels =>
      currentChannels.map(channel =>
        (channel.group || "") ===
        currentName
          ? {
              ...channel,
              group: newName
            }
          : channel
      )
    );
  };

  // Создаёт копию канала в выбранной группе с новым идентификатором.
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

  // Перемещает существующий канал в другую группу.
  const handleMoveChannel = (
    channelId,
    targetGroup
  ) => {
    setChannels(currentChannels =>
      currentChannels.map(channel =>
        channel.id === channelId
          ? {
              ...channel,
              group: targetGroup
            }
          : channel
      )
    );
  };

  // Меняет порядок двух позиций каналов внутри одной группы.
  const handleReorderChannel = (
    sourceId,
    targetId
  ) => {
    if (sourceId === targetId) return;

    setChannels(currentChannels => {
      const sourceChannel =
        currentChannels.find(
          channel =>
            channel.id === sourceId
        );
      const targetChannel =
        currentChannels.find(
          channel =>
            channel.id === targetId
        );

      if (
        !sourceChannel ||
        !targetChannel ||
        sourceChannel.group !==
          targetChannel.group
      ) {
        return currentChannels;
      }

      const groupChannels =
        currentChannels.filter(
          channel =>
            channel.group ===
            sourceChannel.group
        );
      const sourceIndex =
        groupChannels.findIndex(
          channel =>
            channel.id === sourceId
        );
      const targetIndex =
        groupChannels.findIndex(
          channel =>
            channel.id === targetId
        );
      const [movedChannel] =
        groupChannels.splice(
          sourceIndex,
          1
        );

      groupChannels.splice(
        targetIndex,
        0,
        movedChannel
      );

      let groupIndex = 0;

      return currentChannels.map(channel =>
        channel.group ===
        sourceChannel.group
          ? groupChannels[groupIndex++]
          : channel
      );
    });
  };

  // Удаляет канал из плейлиста по его идентификатору.
  const handleDeleteChannel = (
    channelId
  ) => {
    setChannels(currentChannels =>
      currentChannels.filter(
        item => item.id !== channelId
      )
    );
  };

  // Сериализует текущий плейлист и скачивает его как M3U8-файл.
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

  if (streamUrl) {
    return (
      <VideoPlayer
        name={streamName}
        url={streamUrl}
      />
    );
  }

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
            groups={groups}
            onCreateGroup={
              handleCreateGroup
            }
            onRenameGroup={
              handleRenameGroup
            }
            onCopyChannel={
              handleCopyChannel
            }
            onMoveChannel={
              handleMoveChannel
            }
            onReorderChannel={
              handleReorderChannel
            }
            onDeleteChannel={
              handleDeleteChannel
            }
          />
        </>
      )}
    </div>
  );
}

export default App;
