import {
  useMemo,
  useState
} from "react";

import GroupList from "./GroupList";
import ChannelList from "./ChannelList";

export default function PlaylistView({
  channels,
  onCopyChannel,
  onMoveChannel,
  onDeleteChannel
}) {
  const {
    groups,
    channelsByGroup,
    groupCounts
  } = useMemo(() => {
    const groupedChannels = new Map();

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
      groups: [
        ...groupedChannels.keys()
      ],
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
  }, [channels]);

  const [selectedGroup, setSelectedGroup] =
    useState(groups[0] || "");

  const activeGroup =
    channelsByGroup.has(selectedGroup)
      ? selectedGroup
      : groups[0] || "";

  const filteredChannels =
    channelsByGroup.get(activeGroup) ||
    [];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "250px 1fr",
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
          onSelectGroup={
            setSelectedGroup
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
          onDeleteChannel={onDeleteChannel}
        />
      </div>
    </div>
  );
}
