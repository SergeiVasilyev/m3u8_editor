import {
  useMemo,
  useState
} from "react";

import GroupList from "./GroupList";
import ChannelList from "./ChannelList";

// Связывает список групп с каналами выбранной группы.
export default function PlaylistView({
  channels,
  groups,
  onCreateGroup,
  onRenameGroup,
  onCopyChannel,
  onMoveChannel,
  onReorderChannel,
  onDeleteChannel,
  onDeleteGroup
}) {
  const {
    channelsByGroup,
    groupCounts
  } = useMemo(() => {
    // Строит индекс каналов и счётчики один раз при изменении плейлиста.
    const groupedChannels = new Map();

    for (const group of groups) {
      groupedChannels.set(group, []);
    }

    for (const channel of channels) {
      const group = channel.group || "";

      if (!groupedChannels.has(group)) {
        groupedChannels.set(group, []);
      }

      groupedChannels
        .get(group)
        .push(channel);
    }

    return {
      channelsByGroup:
        groupedChannels,
      groupCounts: new Map(
        [...groupedChannels].map(
          ([group, groupChannels]) => [
            group,
            groupChannels.length
          ]
        )
      )
    };
  }, [channels, groups]);

  const [selectedGroup, setSelectedGroup] =
    useState(groups[0] || "");

  const activeGroup =
    channelsByGroup.has(selectedGroup)
      ? selectedGroup
      : groups[0] || "";

  const filteredChannels =
    channelsByGroup.get(activeGroup) ||
    [];

  // Проверяет имя, создаёт группу и сразу выбирает её.
  const handleCreateGroup = groupName => {
    const normalizedName =
      groupName.trim();

    if (
      !normalizedName ||
      groups.includes(normalizedName)
    ) {
      return false;
    }

    onCreateGroup(normalizedName);
    setSelectedGroup(normalizedName);
    return true;
  };

  // Удалить группу
  const handleDeleteGroup = groupName => {
    onDeleteGroup(groupName);
    setSelectedGroup(groups[0] || "");
  };

  // Проверяет новое имя, переименовывает группу и сохраняет её выбранной.
  const handleRenameGroup = (
    currentName,
    newName
  ) => {
    const normalizedName =
      newName.trim();

    if (
      !normalizedName ||
      normalizedName === currentName ||
      groups.includes(normalizedName)
    ) {
      return false;
    }

    onRenameGroup(
      currentName,
      normalizedName
    );
    setSelectedGroup(normalizedName);
    return true;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "1fr 3fr",
        gap: "20px",
        marginTop: "20px"
      }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px"
        }}
      >
        <GroupList
          groups={groups}
          groupCounts={groupCounts}
          selectedGroup={activeGroup}
          onCreateGroup={
            handleCreateGroup
          }
          onRenameGroup={
            handleRenameGroup
          }
          onSelectGroup={
            setSelectedGroup
          }
          onDeleteGroup={
            handleDeleteGroup
          }
        />
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px"
        }}
      >
        <ChannelList
          key={activeGroup}
          channels={filteredChannels}
          groups={groups}
          onCopyChannel={onCopyChannel}
          onMoveChannel={onMoveChannel}
          onReorderChannel={
            onReorderChannel
          }
          onDeleteChannel={onDeleteChannel}
        />
      </div>
    </div>
  );
}
