/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Button } from "@material-ui/core";

export default function SelectSingleNode({ options, vis }) {
  const handleClick = event => {
    let name = document.getElementById("select-single-node-name").value;
    vis.renderWithCypher(
      'MATCH r=(s)-->() WHERE s.s_name = "' + name + '" RETURN r'
    );
  };

  // const handleValueChange = (event) => {
  //   console.log(event.target.value)
  // }

  return (
    <div>
      <Autocomplete
        id="select-single-node-name"
        options={options.sort((a, b) => -b.type.localeCompare(a.type))}
        groupBy={option => option.type}
        getOptionLabel={option => option.s_name}
        style={{ width: "200%" }}
        renderInput={params => (
          <TextField {...params} label="选择节点" variant="outlined" />
        )}
      />
      <Button color="primary" t={20} onClick={handleClick}>
        确认选择
      </Button>
    </div>
  );
}
