export function createGroup({
  id,
  name,
  parentId = null
}) {
  return {
    id,
    name,
    parentId
  };
}