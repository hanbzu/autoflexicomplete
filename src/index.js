import React from "react";
import ReactDOM from "react-dom";
import TextField from "@material-ui/core/TextField";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import useAutocomplete from "./useAutocomplete";

import "./styles.css";

const TEST_DATA = [
  {
    id: "time-last-week",
    label: "Last week",
    alt: "Previous week",
    group: "time"
  },
  { id: "time-today", label: "Today", group: "time" },
  {
    id: "time-a-long-time-ago",
    label: "✨ A long time ago",
    alt: "in a galaxy far, far away",
    group: "time"
  },
  { id: "weather-sunny", label: "☀️ Sunny", group: "weather" },
  {
    id: "weather-cloudy",
    label: "☁️ Cloudy",
    alt: "covered",
    group: "weather"
  },
  {
    id: "weather-stormy",
    label: "⚡️ Stormy",
    alt: "lightning",
    group: "weather"
  }
];

function App() {
  const [inputEl, setInputEl] = React.useState(null);
  const [text, setText] = React.useState("");

  function onChosen(what) {
    // For the purposes of this demo, we blur and clear text at every choice
    console.log("onChosen", what);
    setText("");
    document.getElementsByTagName("input")[0].blur();
  }

  const { bind, filteredList, selectedItem } = useAutocomplete({
    list: TEST_DATA,
    query: text,
    keys: ["label", "alt"],
    onSelect: ({ id }) => onChosen(id)
  });

  return (
    <div>
      <TextField
        placeholder="Choose"
        value={text}
        variant="outlined"
        onFocus={e => setInputEl(e.currentTarget)}
        onBlur={() => setTimeout(() => setInputEl(null), 300)} // after 100ms to be able to click on the list without it suddenly disappearing
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
            {filteredList.map(({ id, label }) => (
              <ListItem
                button
                key={id}
                selected={selectedItem && id === selectedItem.id}
                onClick={() => onChosen(id)}
              >
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
