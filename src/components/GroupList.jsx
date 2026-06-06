import { useState } from "react";

export default function GroupList({
  groups,
  groupCounts,
  selectedGroup,
  onCreateGroup,
  onSelectGroup
}) {
  const [groupName, setGroupName] =
    useState("");

  const createGroup = event => {
    event.preventDefault();

    if (onCreateGroup(groupName)) {
      setGroupName("");
    }
  };

  return (
    <div>
      <h3>Группы</h3>

      <form
        onSubmit={createGroup}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "12px"
        }}
      >
        <input
          type="text"
          value={groupName}
          placeholder="Название группы"
          aria-label="Название новой группы"
          onChange={event =>
            setGroupName(
              event.target.value
            )
          }
        />

        <button
          type="submit"
          disabled={!groupName.trim()}
        >
          Создать группу
        </button>
      </form>

      {groups.map(group => (
        <div
          key={group}
          onClick={() => onSelectGroup(group)}
          style={{
            padding: "8px",
            cursor: "pointer",
            borderRadius: "4px",
            marginBottom: "4px",
            background:
              selectedGroup === group
                ? "#dbeafe"
                : "transparent"
          }}
        >
          {group || "Без группы"}{" "}
          ({groupCounts.get(group) || 0})
        </div>
      ))}
    </div>
  );
}
