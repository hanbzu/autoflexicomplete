import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import "./styles.css";

const TEST_DATA = [
  {
    id: "time-last-week",
    label: "Last week",
    alt: "Previous week",
    group: "time"
  },
  { id: "time-today", label: "Today", group: "time" },
  { id: "sunny", label: "☀️ Sunny", group: "weather" },
  { id: "cloudy", label: "☁️ Cloudy", alt: "covered", group: "weather" }
];

function useAutocompleteList({
  list, // The original list, without filtering
  query, // what to search
  onSelect // Called if the user hits ↵ Enter
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const filteredList = list;

  function onKeyDown({ key }) {
    switch (key) {
      case "Enter":
        return onSelect(filteredList[selectedIndex]);
        break;
      case "ArrowDown":
        if (selectedIndex < filteredList.length - 1)
          setSelectedIndex(selectedIndex + 1);
        break;
      case "ArrowUp":
        if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
        break;
      default:
    }
  }

  console.log("selectedIndex", selectedIndex);

  return {
    bind: { onKeyDown },
    filteredList,
    selectedItem: filteredList[selectedIndex] || null
  };
}

function App() {
  const [inputEl, setInputEl] = React.useState(null);
  const [text, setText] = React.useState("");
  const { bind, filteredList, selectedItem } = useAutocompleteList({
    list: TEST_DATA,
    query: text,
    onSelect: what => console.log("onSelect", what)
  });

  console.log("selectedItem", selectedItem);

  return (
    <div>
      <h1>🍥 auto·flexi·complete!</h1>

      <TextField
        variant="outlined"
        onFocus={e => setInputEl(e.currentTarget)}
        onBlur={() => setInputEl(null)}
        onChange={e => setText(e.target.value)}
        {...bind}
      />

      <Popper
        open={Boolean(inputEl)}
        anchorEl={inputEl}
        placement="bottom-start"
        style={{ marginTop: 10 }}
      >
        <Paper>
          <List>
            {TEST_DATA.map(({ id, label }) => (
              <ListItem button key={id} selected={id === selectedItem.id}>
                {label}
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popper>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
