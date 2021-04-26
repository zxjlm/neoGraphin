import React, { useEffect, useState } from "react";

import SelectSingleNode from "./SelectSingleNode";
import { neo_query } from "../utils/neo-operations";


export default function RightSideBar(props) {
  const [nodes, setNodes] = useState([]);

  const init_nodes = () => {
    neo_query("MATCH (n) RETURN n").then(res => {
      let tmp = res["records"].map(record => ({
        s_name: record.get(0).properties.s_name,
        type: record.get(0).labels[0],
      }));
      setNodes(tmp);
    });
  };

  useEffect(() => {
    init_nodes();
  }, []);


  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>选择单个节点</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SelectSingleNode options={nodes} vis={props.vis} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>选择多个节点</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography className={classes.heading}>寻找最短路径</Typography>
        </AccordionSummary>
      </Accordion>
    </div>
  );
}
