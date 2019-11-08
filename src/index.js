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
  { id: "weather-sunny", label: "☀️ Sunny", group: "weather" },
  { id: "weather-cloudy", label: "☁️ Cloudy", alt: "covered", group: "weather" }
];

function App() {
  const [inputEl, setInputEl] = React.useState(null);
  const [text, setText] = React.useState("");

  function onChosen(what) {
    console.log("onChosen", what);
    setText("");
  }

  const { bind, filteredList, selectedItem } = useAutocomplete({
    list: TEST_DATA,
    query: text,
    keys: ["label", "alt"],
    onSelect: ({ id }) => onChosen(id)
  });

  // console.log("selectedItem", selectedItem);

  return (
    <div>
      <h1>auto·flexi·complete</h1>

      <TextField
        value={text}
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
