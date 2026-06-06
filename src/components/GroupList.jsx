export default function GroupList({
  groups,
  groupCounts,
  selectedGroup,
  onSelectGroup
}) {
  return (
    <div>
      <h3>Группы</h3>

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
