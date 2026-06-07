import {
  useMemo,
  useState,
  useEffect
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
    const groupedChannels = new Map();

    for (const group of groups) {
      groupedChannels.set(group.id, []);
    }

    for (const channel of channels) {
      const groupId = channel.groupId;

      if (!groupedChannels.has(groupId)) {
        groupedChannels.set(groupId, []);
      }

      groupedChannels.get(groupId).push(channel);
    }

    return {
      channelsByGroup: groupedChannels,
      groupCounts: new Map(
        [...groupedChannels].map(
          ([groupId, groupChannels]) => [
            groupId,
            groupChannels.length
          ]
        )
      )
    };
  }, [channels, groups]);

  const [selectedGroup, setSelectedGroup] =
    useState(groups[0] || null);

  useEffect(() => {
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0]);
    }
  }, [groups, selectedGroup]);

  const activeGroup =
    selectedGroup &&
    channelsByGroup.has(selectedGroup.id)
      ? selectedGroup
      : groups[0] || null;

  const filteredChannels =
    channelsByGroup.get(activeGroup?.id) || [];

  const handleCreateGroup = groupName => {
    const normalizedName = groupName.trim();

    if (
      !normalizedName ||
      groups.some(
        group => group.name === normalizedName
      )
    ) {
      return false;
    }

    onCreateGroup(normalizedName);
    return true;
  };

  const handleDeleteGroup = group => {
    onDeleteGroup(group);

    setSelectedGroup(
      groups.find(g => g.id !== group.id) ||
      null
    );
  };

  const handleRenameGroup = (
    currentGroup,
    newName
  ) => {
    const normalizedName = newName.trim();

    if (
      !normalizedName ||
      normalizedName === currentGroup.name ||
      groups.some(
        group =>
          group.name === normalizedName &&
          group.id !== currentGroup.id
      )
    ) {
      return false;
    }

    onRenameGroup(
      currentGroup.id,
      normalizedName
    );

    return true;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
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
          onCreateGroup={handleCreateGroup}
          onRenameGroup={handleRenameGroup}
          onSelectGroup={setSelectedGroup}
          onDeleteGroup={handleDeleteGroup}
        />
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px"
        }}
      >
        <ChannelList
          key={activeGroup?.id}
          channels={filteredChannels}
          groups={groups}
          onCopyChannel={onCopyChannel}
          onMoveChannel={onMoveChannel}
          onReorderChannel={onReorderChannel}
          onDeleteChannel={onDeleteChannel}
        />
      </div>
    </div>
  );
}
