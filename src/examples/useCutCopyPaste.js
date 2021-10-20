import { useEffect } from "react";
import { useStoreState, isEdge, getConnectedEdges } from "react-flow-renderer";
function getSelectedGraph(selectedNodes, elements) {
  const allEdges = [];
  const allNodeMap = {};
  elements.forEach((node) => {
    if (isEdge(node)) {
      allEdges.push(node);
    } else {
      allNodeMap[node.id] = node;
    }
  });
  const edgeMap = {};
  const selectedNodeIds = [];
  const nodes = [];
  selectedNodes.forEach((node) => {
    if (!isEdge(node)) {
      selectedNodeIds.push(node.id);
      const connectedEdges = getConnectedEdges([node], allEdges);
      connectedEdges.forEach((edge) => (edgeMap[edge.id] = edge));
      nodes.push(allNodeMap[node.id]);
    }
  });
  // pick edges which has both nodes present in selectedNodes
  Object.values(edgeMap).forEach((edge) => {
    if (
      selectedNodeIds.includes(edge.source) &&
      selectedNodeIds.includes(edge.target)
    ) {
      nodes.push(edge);
    }
  });

  return nodes;
}
const Format = "application/react-flow-format";

export function useCutCopyPaste(elements, onElementsRemove, setElements) {
  const selectedElements = useStoreState((store) => store.selectedElements);

  useEffect(() => {
    function cut(event) {
      if (!event.target?.closest(".react-flow")) {
        return;
      }
      //remove selected nodes from graph
      // copy to clipboard
      if (selectedElements && selectedElements.length) {
        const data = JSON.stringify(
          getSelectedGraph(selectedElements, elements)
        );
        event.clipboardData.setData(Format, data);
        event.preventDefault();
        onElementsRemove(selectedElements);
      }
    }
    function copy(event) {
      if (!event.target?.closest(".react-flow")) {
        return;
      }
      if (selectedElements && selectedElements.length) {
        const data = JSON.stringify(
          getSelectedGraph(selectedElements, elements)
        );
        event.clipboardData.setData(Format, data);
        event.preventDefault();
      }
    }
    function paste(event) {
      // read data from clipboard
      // add elements to graph
      if (!event.target?.closest(".react-flow")) {
        return;
      }
      try {
        const elementsToAdd = JSON.parse(event.clipboardData.getData(Format));
        const now = Date.now();
        // change id/source/target of new elements
        elementsToAdd.forEach((element) => {
          if (isEdge(element)) {
            element.id = `${element.id}_${now}`;
            element.source = `${element.source}_${now}`;
            element.target = `${element.target}_${now}`;
          } else {
            element.id = `${element.id}_${now}`;
          }
        });
        event.preventDefault();
        setElements((elements = []) => [...elements, ...elementsToAdd]);
      } catch (error) {
        console.error(error);
      }
    }

    document.addEventListener("cut", cut);
    document.addEventListener("copy", copy);
    document.addEventListener("paste", paste);
    return () => {
      document.removeEventListener("cut", cut);
      document.removeEventListener("copy", copy);
      document.removeEventListener("paste", paste);
    };
  }, [elements, onElementsRemove, selectedElements, setElements]);
}
