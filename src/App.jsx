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
    const playlist =
      parseM3U(content);
    console.log(playlist);
    setChannels(playlist.channels);
    setGroups(playlist.groups);

    // setGroups([
    //   ...new Set(
    //     loadedChannels.map(
    //       channel => channel.group || ""
    //     )
    //   )
    // ]);
    setFileName(
      loadedFileName || "playlist.m3u8"
    );
  };

  // Добавляет новую группу, если группы с таким именем ещё нет.
  const handleCreateGroup = groupName => {
    setGroups(currentGroups => {
      if (
        currentGroups.some(
          group => group.name === groupName
        )
      ) {
        return currentGroups;
      }

      return [
        ...currentGroups,
        {
          id: crypto.randomUUID(),
          name: groupName,
          parentId: null
        }
      ];
    });
  };

  // Переименовывает группу по её идентификатору.
  const handleRenameGroup = (
    groupId,
    newName
  ) => {
    setGroups(currentGroups =>
      currentGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              name: newName
            }
          : group
      )
    );
  };

  // Создаёт копию канала в выбранной группе с новым идентификатором.
  const handleCopyChannel = (
    channelId,
    targetGroupId
  ) => {
    setChannels(currentChannels => {
      const channel =
        currentChannels.find(
          item => item.id === channelId
        );

      if (
        !channel ||
        channel.groupId === targetGroupId
      ) {
        return currentChannels;
      }

      return [
        ...currentChannels,
        {
          ...channel,
          id: crypto.randomUUID(),
          groupId: targetGroupId
        }
      ];
    });
  };

  // Перемещает существующий канал в другую группу.
  const handleMoveChannel = (
    channelId,
    targetGroupId
  ) => {
    setChannels(currentChannels =>
      currentChannels.map(channel =>
        channel.id === channelId
          ? {
              ...channel,
              groupId: targetGroupId
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
        sourceChannel.groupId !==
          targetChannel.groupId
      ) {
        return currentChannels;
      }

      const groupChannels =
        currentChannels.filter(
          channel =>
            channel.groupId ===
            sourceChannel.groupId
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
        channel.groupId ===
        sourceChannel.groupId
          ? groupChannels[groupIndex++]
          : channel
      );
    });
  };

  const handleReorderGroup = (sourceId, targetId) => {
    if (sourceId === targetId) return;

    setGroups(currentGroups => {
      const sourceIndex = currentGroups.findIndex(g => g.id === sourceId);
      const targetIndex = currentGroups.findIndex(g => g.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1) return currentGroups;

      const newGroups = [...currentGroups];
      const [moved] = newGroups.splice(sourceIndex, 1);
      newGroups.splice(targetIndex, 0, moved);

      return newGroups;
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

  // Удалить группу из плейлиста.
  const handleDeleteGroup = group => {
    setGroups(currentGroups =>
      currentGroups.filter(
        item => item.id !== group.id
      )
    );
    setChannels(currentChannels =>
      currentChannels.filter(
        channel => channel.groupId !== group.id
      )
    );
  };

  // Сериализует текущий плейлист и скачивает его как M3U8-файл.
  const handleSave = () => {
    const content = unparseM3U(channels, groups);
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
            onDeleteGroup={
              handleDeleteGroup
            }
            onReorderGroup={
              handleReorderGroup
            }
          />
        </>
      )}
    </div>
  );
}

export default App;
