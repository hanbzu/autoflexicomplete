import React from "react";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import styled from "styled-components";

export default function DropdownMenu({ list, selectedItem, onChosen }) {
  // Sort by groups, so that we can create collapsible menu opts
  const byGroup = {};
  list.forEach(d => (byGroup[d.group] = [...(byGroup[d.group] || []), d]));
  const [expandedGroups, setExpandedGroups] = React.useState([]);

  const selectedGroup = selectedItem && selectedItem.group;
  React.useEffect(() => {
    setExpandedGroups(expandedGroups => {
      if (!expandedGroups.includes(selectedGroup))
        return [...expandedGroups, selectedGroup];
      else return expandedGroups;
    });
  }, [selectedGroup]);

  return (
    <Paper style={{ width: 250 }}>
      <List disablePadding>
        {Object.keys(byGroup).map(group => (
          <div key={group}>
            <ListItem
              button
              onMouseDown={e => e.preventDefault()} // Don't focus or the menu will close
              onClick={() => {
                if (expandedGroups.includes(group))
                  setExpandedGroups(expandedGroups.filter(d => d !== group));
                else setExpandedGroups([...expandedGroups, group]);
              }}
            >
              <GroupItemText primary={group} />
              {expandedGroups.includes(group) ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={expandedGroups.includes(group)}>
              <List disablePadding>
                {list
                  .filter(d => d.group === group)
                  .map(({ id, label }) => (
                    <ListItem
                      button
                      key={id}
                      selected={selectedItem && id === selectedItem.id}
                      onClick={() => onChosen(id)}
                      style={{ paddingLeft: 20 }}
                    >
                      <ListItemText primary={label} />
                    </ListItem>
                  ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </Paper>
  );
}

const GroupItemText = styled(ListItemText)`
  color: gray;
  text-transform: uppercase;
`;
