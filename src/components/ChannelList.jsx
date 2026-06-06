import { useState } from "react";

const PAGE_SIZE = 50;

export default function ChannelList({
  channels,
  groups,
  onCopyChannel
}) {
  const [targetGroups, setTargetGroups] =
    useState({});
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(
    channels.length / PAGE_SIZE
  );
  const visibleChannels =
    channels.slice(
      page * PAGE_SIZE,
      (page + 1) * PAGE_SIZE
    );

  const selectTargetGroup = (
    channelId,
    group
  ) => {
    setTargetGroups(current => ({
      ...current,
      [channelId]: group
    }));
  };

  const copyChannel = channel => {
    const targetGroup =
      targetGroups[channel.id];

    if (!targetGroup) return;

    onCopyChannel(
      channel.id,
      targetGroup
    );
  };

  return (
    <div>
      <h3>Каналы</h3>

      <div
        style={{
          marginBottom: "12px"
        }}
      >
        Показано{" "}
        {channels.length === 0
          ? 0
          : page * PAGE_SIZE + 1}
        -
        {Math.min(
          (page + 1) * PAGE_SIZE,
          channels.length
        )}{" "}
        из {channels.length}
      </div>

      {visibleChannels.map(channel => {
        const availableGroups =
          groups.filter(
            group =>
              group !== channel.group
          );
        const targetGroup =
          targetGroups[channel.id] || "";

        return (
          <div
            key={channel.id}
            style={{
              padding: "8px",
              borderBottom:
                "1px solid #ddd"
            }}
          >
            <strong>
              {channel.name}
            </strong>

            <div
              style={{
                fontSize: "12px",
                color: "#666"
              }}
            >
              {channel.url}
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "8px"
              }}
            >
              <select
                aria-label={
                  `Группа для копии ${channel.name}`
                }
                value={targetGroup}
                onChange={event =>
                  selectTargetGroup(
                    channel.id,
                    event.target.value
                  )
                }
                disabled={
                  availableGroups.length === 0
                }
              >
                <option value="">
                  Выберите группу
                </option>
                {availableGroups.map(
                  group => (
                    <option
                      key={group}
                      value={group}
                    >
                      {group}
                    </option>
                  )
                )}
              </select>

              <button
                type="button"
                onClick={() =>
                  copyChannel(channel)
                }
                disabled={!targetGroup}
              >
                Копировать
              </button>
            </div>
          </div>
        );
      })}

      {pageCount > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginTop: "16px"
          }}
        >
          <button
            type="button"
            disabled={page === 0}
            onClick={() =>
              setPage(current =>
                current - 1
              )
            }
          >
            Назад
          </button>

          <span>
            Страница {page + 1} из{" "}
            {pageCount}
          </span>

          <button
            type="button"
            disabled={
              page === pageCount - 1
            }
            onClick={() =>
              setPage(current =>
                current + 1
              )
            }
          >
            Далее
          </button>
        </div>
      )}
    </div>
  );
}
