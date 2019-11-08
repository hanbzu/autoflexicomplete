import React from "react";
import Fuse from "fuse.js";

export default function useAutocomplete({
  list, // The original list, without filtering
  query, // what to search
  keys, // OPTIONAL. If present, only search the provided keys
  onSelect // Called if the user hits ↵ Enter
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [searchResults, setSearchResults] = React.useState(list);
  const fuseOptions = (keys && { keys }) || {};
  const fuse = new Fuse(list, fuseOptions);

  React.useEffect(() => {
    const search = fuse.search(query);
    setSearchResults(search);

    if (search.length === 0) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(0);
    }
  }, [query]);

  const filteredList = searchResults.length > 0 ? searchResults : list;
  const selectedItem =
    (selectedIndex !== null && filteredList[selectedIndex]) || null;

  function onKeyDown({ key }) {
    switch (key) {
      case "Enter":
        if (selectedItem) {
          setSelectedIndex(null);
          onSelect(selectedItem);
        }
        break;
      case "ArrowDown":
        if (selectedIndex === null) setSelectedIndex(0);
        else if (selectedIndex < filteredList.length - 1)
          setSelectedIndex(selectedIndex + 1);
        break;
      case "ArrowUp":
        if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
        break;
      default:
    }
  }

  console.log("selected", selectedIndex, selectedItem);

  return {
    bind: { onKeyDown },
    filteredList,
    selectedItem
  };
}
