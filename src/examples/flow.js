import React, { useState } from "react";

import ReactFlow, {
  removeElements,
  addEdge,
  Controls,
  Background,
  ReactFlowProvider,
} from "react-flow-renderer";
import { Switch, Route } from "react-router-dom";
import initialElements from "./initial-elements";
import { useCutCopyPaste } from "./useCutCopyPaste";

const onLoad = (reactFlowInstance) => {
  console.log("flow loaded:", reactFlowInstance);
  reactFlowInstance.fitView();
};

const Example = () => {
  return (
    <div className="example-container">
      <Switch>
        <Route path="/graph/1">
          <ReactFlowProvider>
            <Flow initialElements={initialElements} />
          </ReactFlowProvider>
        </Route>
        <Route path="/graph/:id">
          <ReactFlowProvider>
            <Flow initialElements={[]} />
          </ReactFlowProvider>
        </Route>
      </Switch>
    </div>
  );
};
export default Example;

function Flow({ initialElements }) {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));
  useCutCopyPaste(elements, onElementsRemove, setElements);
  return (
    <div className="flow-container">
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onLoad={onLoad}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
