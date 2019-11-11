import React from "react";
import Fuse from "fuse.js";

export default function useAutocomplete({
  list, // The original list, without filtering
  query, // what to search
  keys, // OPTIONAL. If present, only search the provided keys
  onSelect // Called if the user hits ↵ Enter
}) {
  // This is to keep the state when the user clicks up/down arrows
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  // I would love to somehow memoize this computation but
  // as it'd involve deep comparison of list and keys
  // I cannot in a straightforward way
  const opts = { shouldSort: false, includeScore: true };
  if (keys) opts.keys = keys;
  const fuse = new Fuse(list, opts);
  const searchResults = fuse.search(query);
  const scores = searchResults.map(d => d.score);
  const indexWithBestScore = scores.indexOf(Math.min(...scores));

  React.useEffect(() => {
    if (searchResults.length === 0) setSelectedIndex(null);
    else setSelectedIndex(indexWithBestScore);
  }, [searchResults.length, indexWithBestScore]);

  // If there's no search results, show full list
  const filteredList =
    searchResults.length > 0 ? searchResults.map(d => d.item) : list;
  const selectedItem = filteredList[selectedIndex] || null;

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
        // Complete list, start with 0
        else if (selectedIndex < filteredList.length - 1)
          setSelectedIndex(selectedIndex + 1);
        break;
      case "ArrowUp":
        if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
        break;
      default:
    }
  }

  return {
    bind: { onKeyDown },
    filteredList,
    selectedItem
  };
}
