import React, { useState, useEffect, useStoreState } from "react";
import Project from "./project";
import { Link, useParams } from "react-router-dom";
import "./phase.css";
import Detail from "../images/detail.png";
import "reactflow/dist/style.css";
import { useCallback } from "react";
import ImgNodeChain from "./ImgNodeChain.js";
import ImgNodeChainEnd from "./ImgNodeChainEnd.js";
import ImgNodeChain1 from "./ImgNodeChain1.js";
import ImgNodeChain2 from "./ImgNodeChain2.js";
import ParallelImg from "./ParalleStep.js";
import InsideParallel from "./InsideParallel.js";
import RightAngleConnecting from "./edgecustom.js";
import RightAngleConnectingDown from "./edgecustomdown";
import Jumpedge from "./jumpedge";
import JumpedgeDown from "./jumpedgedown";
import ActionTable from "./ActionTable.js";
import Step from "./steptable.js";
import { updateActionStepIdTable } from "../redux/slices/actionStepReducer";

import { resetTable } from "../redux/slices/actionStepReducer";

import { fetchProjectSuccess } from "../redux/slices/projectReducerGet";
import { useDispatch, useSelector } from "react-redux";

const nodeTypes = {
  ImgNodeUpdEnd: ImgNodeChainEnd,
  ImgNodeUpd: ImgNodeChain,
  ImgNodeUpd1: ImgNodeChain1,
  ImgNodeUpdAction: ImgNodeChain2,
  ImgNodeUpd2: ParallelImg,
  ImgNodeUpd3: InsideParallel,
  custom: { draggable: false },
};

const edgeTypes = {
  customEdge: RightAngleConnecting,
  customEdgeDown: RightAngleConnectingDown,
  stepEdges: StepEdge,
  jumpedge: Jumpedge,
  jumpedgedown: JumpedgeDown,
};
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  StepEdge,
  StraightEdge,
  useReactFlow,
  Panel,
} from "reactflow";

//NEED TO STAY OUTSIDE
const getNodeId = () => `randomnode_${+new Date()}`;
const initialNodes = [
  {
    id: "1",
    sourcePosition: "top",
    targetPosition: "bottom",
    position: { x: 0, y: -300 },
    type: "ImgNodeUpd",
    data: {
      image: require(`../images/Step.png`),
      inputValue: "Start",
      text: "Start",
    },
    draggable: false,
  },
  {
    id: "2",
    sourcePosition: "top",
    targetPosition: "bottom",
    position: { x: 0, y: -200 },
    type: "ImgNodeUpd1",
    data: { image: require(`../images/Transition.png`), inputValue: 0 },
    draggable: false,
  },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const Phase = (props) => {
  const { id } = useParams();

  //fortoolbox
  const [visible, setVisible] = useState(false);

  const [visible1, setVisible1] = useState(true);
  const [visible2, setVisible2] = useState(false);
  //formultiplestep
  const [visibles3, setVisibles3] = useState(false);
  //addnumber of steps
  const [number, setNumber] = useState();
  //addnumber of upstep
  const [upNum, setupNum] = useState();

  //for moveup
  const [up, setUp] = useState(false);
  //for movedown
  const [down, setDown] = useState(false);

  const handleMultiStep = (event) => {
    setNumber(event.target.value);
  };
  const handleUpStep = (event) => {
    setupNum(event.target.value);
  };

  //for project
  const [visibles2, setVisibles2] = useState(false);
  const removeElement = () => {
    setVisible((prev) => !prev);
  };
  let [desiredRecipe2, setdesiredRecipe2] = useState(null);

  const get_detail = () => {
    setVisible1((prev) => !prev);
    setVisible2((prev) => !prev);
    fetchData();
    const storedData = localStorage.getItem("RecipesFetched");
    const parsedData = JSON.parse(storedData);
    desiredRecipe2 = parsedData.find((recipe) => recipe.id === id);
    setdesiredRecipe2(desiredRecipe2);
  };

  const hide_detail = () => {
    setVisible1((prev) => !prev);
    setVisible2((prev) => !prev);
  };
  const hide_tables = () => {
    setVisible1((prev) => !prev);
  };
  ///for adding multiple steps visile or not
  const addMultiStep = () => {
    setVisibles3((prev) => !prev);
  };
  ///for  steping up visile or not
  const Jumpup = () => {
    setUp((prev) => !prev);
  };

  const removeElement2 = () => {
    setVisibles2((prev) => !prev);
  };
  const myRecipe = JSON.parse(localStorage.getItem("recipe"));

  ////FOR STEP CHAIN
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const { setViewport } = useReactFlow();
  //FOR parallel section
  const [parallnode, setParallelNode] = useState();

  const [insertionIndex, setInsertionIndex] = useState(1); // Initial insertion index

  ////FOR THE TABLE CHANGE NAME AND STEPS
  const [actionName, setActioName] = useState();
  const [actionStep, setActionStep] = useState();
  const [actionObject, setActioObject] = useState([{}]);
  const [StepObject, setStepObject] = useState([{}]);

  const [transitionName, setTransitionname] = useState();
  const [transitionStep, setTransitionStep] = useState();
  ////ADDING THE STEPVALUE
  const [stepValueAdd, setstepValueAdd] = useState(0);
  ////TO CONTINIUE TO  ADDING THE NODES OR NOT
  const [selectedOrNot, setselectedOrNot] = useState(false);

  const ValueChange = (e) => {
    const value = e.target.value;
    setstepValueAdd(parseInt(value));
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  //////FOR THE INPUT CHANGES

  const [myArray, setMyArray] = useState([stepValueAdd]);

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      setParallelCount((prevCount) => prevCount - 1);
      setMyArray((prevArray) => {
        const newArray = [...prevArray];
        // newArray.slice(0, -1);

        const lastIndex = newArray.length - 1;
        const previousNode = nodes[selectedNodeId + 1];

        // Check if the last element starts with "tran"
        if (previousNode.id.startsWith("decis")) {
          newArray.push(newArray[lastIndex] - stepValueAdd);
        } else if (previousNode.id.startsWith("step")) {
          myArray.pop();
        }

        return newArray;
      });

      setInputValue((prevCount) => prevCount - 0.1);
    }
  };

  /////FOR THE STEP CHAIN DIAGRAM PERSITENCE MEMORY
  const onSave = useCallback(() => {
    if (rfInstance) {
      ///TO BE DELETED
      // const flow = rfInstance.toObject();
      // localStorage.setItem("chain", JSON.stringify(flow));
      // console.log(myArray)
      ////TODO TO BE SAVED ON BACKEND AS WELL.
      localStorage.setItem(id, JSON.stringify(myArray));
    }
  }, [rfInstance, myArray]);

  ////SAVING THE DATA
  const handleSubmit = async () => {
    try {
      const flow = rfInstance.toObject();

      console.log(myArray);
      const requestData = {
        flow: JSON.stringify(flow),
        chainArray: JSON.stringify(myArray),
      };
      const response = await fetch(
        `http://localhost:8080/api/project/recipe/stepchain/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        console.log("Data sent to server successfully");
      } else {
        console.error("Error sending data to server");
      }
    } catch (error) {
      console.error("Error sending data to server", error);
    }
  };

  /////RESTORE THE DATA

  const storedData = localStorage.getItem("RecipesFetched");
  const parsedData = JSON.parse(storedData);
  const desiredRecipe = parsedData.find((recipe) => recipe.id === id);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = desiredRecipe.stepChain.stepChain;
      // console.log(flow)

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
    const restoreArray = JSON.parse(localStorage.getItem("myArray"));
    // console.log(restoreArray);
    setMyArray(restoreArray);
  }, [setNodes, setViewport]);

  //This IS FOR THE END
  const getImg = useCallback(
    (e) => {
      const previousNode = nodes[selectedNodeId + 1];

      const node = {
        id: getNodeId(),
        sourcePosition: "top",
        targetPosition: "bottom",
        position: {
          x: 0, // Increment x-coordinate by 100
          y: previousNode.position.y + 100, // Increment y-coordinate by 100
        },
        type: "ImgNodeUpdEnd",
        data: { image: require(`../images/Step.png`) },
      };
      setNodes([...nodes, node]);

      if (nodes.length > 0) {
        const newedge = {
          id: getNodeId(),
          source: previousNode.id,
          target: node.id,
          type: "stepEdges",
        };
        setEdges([...edges, newedge]);
      }
    },
    [nodes, edges]
  );

  //THIS IS FOR THE ACTION/TRANSITION STEPS
  const getImg1 = useCallback(() => {
    console.log(selectedOrNot);
    const a = myArray.length;
    setMyArray([...myArray, myArray[a - 1] + stepValueAdd]);
    const idName = myArray[a - 1] + stepValueAdd;

    const previousNode = nodes[selectedNodeId + 1];
    const node = {
      id: idName + getNodeId(),
      key: getNodeId(),
      sourcePosition: "top",
      targetPosition: "bottom",
      position: {
        x: previousNode.position.x, // Increment x-coordinate by 100
        y: previousNode.position.y + 100, // Increment y-coordinate by 100
      },
      type: "ImgNodeUpdAction",
      data: {
        image: require(`../images/Step.png`),
        isselected: isSelected,
        text: "--",
        inputValue: myArray[a - 1] + stepValueAdd,
        inputValue1: myArray[a - 1] + stepValueAdd,
      },
      draggable: false,
    };

    const node2 = {
      id: "step" + getNodeId(),
      key: idName + getNodeId(),
      sourcePosition: "top",
      targetPosition: "bottom",
      position: {
        x: previousNode.position.x, // Same as the previous node's X position
        y: previousNode.position.y + 200, // Increment the y-coordinate by another 150 units
      },
      type: "ImgNodeUpd1",
      data: {
        image: require(`../images/Transition.png`),
        isselected: isSelected,
        text: "--",
        inputValue: myArray[a - 1] + stepValueAdd,
        inputValue1: myArray[a - 1] + stepValueAdd,
      },
      draggable: false,
    };

    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];

      if (
        parallnode &&
        previousNode.position.y + 200 >= parallnode.position.y
      ) {
        updatedNodes.forEach((nodes) => {
          if (
            nodes.position.y > node.position.y &&
            parallnode.position.x < nodes.position.x + 150
          ) {
            const deltaY = 200;
            nodes.position.y += deltaY;
          }
        });
      }

      // Insert the new node at the insertion point
      updatedNodes.splice(insertionIndex, 0, node, node2);

      return updatedNodes;
    });

    if (nodes.length > 0) {
      const previousNode = nodes[selectedNodeId + 1];
      const newedge = {
        id: getNodeId(),
        source: previousNode.id,
        target: node.id,
        type: "stepEdges",
      };
      // Second Edge (Between First and Second Node)
      const newEdge2 = {
        id: getNodeId(),
        source: node.id,
        target: node2.id,
        type: "stepEdges",
      };
      setEdges([...edges, newedge, newEdge2]);
    }

    setselectedOrNot(false);
  }, [nodes, myArray]);

  ///THIS IS FOR ADDING  A TRANSITION FOR PARALLEL
  const getImg1P = useCallback(() => {
    const a = myArray.length;
    setMyArray([...myArray, myArray[a - 1] + stepValueAdd]);
    const idName = myArray[a - 1] + stepValueAdd;
    const previousNode = nodes[selectedNodeId + 1];
    const node2 = {
      id: "step" + getNodeId(),
      key: idName + getNodeId(),
      sourcePosition: "top",
      targetPosition: "bottom",
      position: {
        x: previousNode.position.x, // Same as the previous node's X position
        y: previousNode.position.y + 100, // Increment the y-coordinate by another 150 units
      },
      type: "ImgNodeUpd1",
      data: {
        image: require(`../images/Transition.png`),
        isselected: isSelected,
        text: "--",
        inputValue: myArray[a - 1] + stepValueAdd,
        inputValue1: myArray[a - 1] + stepValueAdd,
      },
      draggable: false,
    };

    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];

      if (parallnode && previousNode.position.y + 220 > parallnode.position.y) {
        updatedNodes.forEach((nodes) => {
          if (nodes.position.y - 20 > previousNode.position.y) {
            console.log(nodes);
            const deltaY = 300;
            nodes.position.y += deltaY;
          }
        });
      }
      // Insert the new node at the insertion point
      updatedNodes.splice(insertionIndex, 0, previousNode, node2);

      return updatedNodes;
    });

    if (nodes.length > 0) {
      const previousNode = nodes[selectedNodeId + 1];
      const newedge = {
        id: getNodeId(),
        source: previousNode.id,
        target: node2.id,
        type: "stepEdges",
      };
      // Second Edge (Between First and Second Node)

      setEdges([...edges, newedge]);
    }
    setselectedOrNot(false);
  }, [nodes, myArray]);

  ////ADDING MULTIPLE STEPS

  const MultiSteps = useCallback(() => {
    setVisibles3((prev) => !prev);

    const a = myArray.length;
    const idName = myArray[a - 1] + stepValueAdd;
    const previousNode = nodes[selectedNodeId + 1];
    const arrNode = [];
    var bool = true;
    for (let i = 1; i < 2 * number + 1; i++) {
      // let value = myArray[a-1] + (i <= number ? 5 : 10);
      let value =
        myArray[a - 1] + stepValueAdd + Math.floor((i - 1) / 2) * stepValueAdd;

      if (bool) {
        const node3 = {
          id: idName + getNodeId() + i,
          type: "ImgNodeUpd1",
          data: {
            image: require(`../images/Step.png`),
            isselected: isSelected,
            text: "--",
            inputValue: value,
            inputValue1: value,
          },
          draggable: false,
          position: {
            x: previousNode.position.x,
            y: previousNode.position.y + i * 100,
          },
        };
        arrNode.push(node3);
      } else {
        const node3 = {
          id: "step" + getNodeId() + i,
      
          type: "ImgNodeUpdAction",
          key: idName + getNodeId(),
          data: {
            image: require(`../images/Transition.png`),
            isselected: isSelected,
            text: "--",
            inputValue: value,
            inputValue1: value,
          },
          draggable: false,
          position: {
            x: previousNode.position.x,
            y: previousNode.position.y + i * 100,
          },
        };
        arrNode.push(node3);
      }
      if (i % 2 === 0) {
        myArray.push(value);
      }
      bool = !bool;
    }

    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];

      if (parallnode && previousNode.position.y + 500 > parallnode.position.y) {
        updatedNodes.forEach((nodes) => {
          if (nodes.position.y > previousNode.position.y) {
            const deltaY = number * 120;
            nodes.position.y += deltaY;
          }
        });
      }

      updatedNodes.splice(insertionIndex, 0, ...arrNode);

      return updatedNodes;
    });

    if (nodes.length > 0) {
      const previousNode = nodes[selectedNodeId + 1];
      const arrEdge = [];
      const newedge = {
        id: getNodeId(),
        source: previousNode.id,
        target: arrNode[0].id,
        type: "stepEdges",
      };
      arrEdge.push(newedge);

      for (let i = 0; i < 2 * number - 1; i++) {
        const newEdge4 = {
          id: getNodeId(),
          source: arrNode[i].id,
          target: arrNode[i + 1].id,
          type: "stepEdges",
        };
        arrEdge.push(newEdge4);
      }

      setEdges([...edges, ...arrEdge]);
    }
    setselectedOrNot(false);
    // arrNode.splice(0, arrNode.length);
  }, [nodes, number]);

  const url = "http://localhost:8080/api/project/recipeids";
  async function fetchData() {
    try {
      const response = await fetch(url);
      const data = await response.json();

      dispatch(fetchProjectSuccess(data));
      localStorage.setItem("RecipesFetched", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching missions:", error);
    }
  }

  useEffect(() => {
    fetchData();
    onRestore();

    const restoreArray = desiredRecipe?.stepChain?.actionStepArray || "[0]";

    const array = JSON.parse(restoreArray);

    setMyArray(array.length === 0 ? myArray : array);

    // ///ALL TO BE FIXED
    // // Retrieve the saved data from localStorage
    // const parallelid = localStorage.getItem("parallelid");
    // const parallelCountN = localStorage.getItem("parallelCount");
    // // const flow = JSON.parse(localStorage.getItem("chain"));
    // const flow = parsedData.recipe[0].stepChain.stepChain;
    // const nodeValues = Object.values(flow.nodes);
    // const matchedNode = nodeValues.find((node) => node.id == parallelid);
    // // If there is saved data, update the state with it
    // // setParallelNode(matchedNode);
    // const parsedNumber = parseInt(parallelCountN);
    // // setParallelCount(parsedNumber);???????????????

    // /////////////?????????????? NOT USED ANYWHERE
    // const checkForChanges = () => {
    //   const nodesWithInputFields = nodes.filter((element) => {
    //     return element.type === "ImgNodeUpd1"; // Replace 'inputNode' with your node type
    //   });

    //   nodesWithInputFields.forEach((node) => {
    //     const initialInputValue = initialNodes.find(
    //       (initialNode) => initialNode.id === node.id
    //     )?.data.text;
    //     if (node.data.text !== initialInputValue) {
    //     }
    //   });
    // };
    // checkForChanges();

    // fetchData();
  }, []);

  const [valueP, setvalueP] = useState(null);
  const [inputValue, setInputValue] = useState(0.0);
  const [parallelCount, setParallelCount] = useState(null);
  const [hasSelectedNodeChanged, setHasSelectedNodeChanged] = useState(true);
  /////ADDDING PARALLEL
  const getImgParallelstep = useCallback(
    (e) => {
      const previousNode = nodes[selectedNodeId + 1];
      const a = myArray.length;

      // const fix = myArray[a - 1];
      setInputValue(previousNode.data.inputValue + 0.1);

      //   const arrPara = [];
      //   for(let i=0;i<2;i++){
      //     const node =  {
      //       id: "parall" +i,
      //       key: getNodeId(),
      //       sourcePosition: 'top',
      //        targetPosition: 'bottom',
      //        position: {
      //          x: nodes[insertionIndex].position.x,       y: i === 0 ? nodes[insertionIndex].position.y : nodes[insertionIndex].position.y + 175,

      //        },
      //        type: 'ImgNodeUpd2',
      //         data: {  image:require(`../images/Pr.png`) },
      //         draggable: true,
      //      }
      //      arrPara.push(node)
      //   }

      const node = {
        id: "parall" + getNodeId(),
        key: getNodeId(),
        sourcePosition: "top",
        targetPosition: "bottom",
        position: {
          x: nodes[insertionIndex].position.x,
          y: nodes[insertionIndex].position.y,
        },
        type: "ImgNodeUpd2",
        data: {
          image: require(`../images/Pr.png`),
          valueP: null,
          countP: null,
        },
        draggable: false,
      };

      setParallelNode(node);

      setNodes((prevNodes) => {
        const updatedNodes = [...prevNodes];

        updatedNodes.forEach((nodes) => {
          console.log(nodes.position.x);
          if (
            nodes.position.y >= node.position.y &&
            nodes.position.x == node.position.x
          ) {
            const deltaY = 30;
            nodes.position.y += deltaY;
          }
        });
        // Insert the new node at the insertion point
        updatedNodes.splice(insertionIndex, 0, node);

        return updatedNodes;
      });

      if (nodes.length > 0) {
        const previousNode = nodes[selectedNodeId + 1];

        setParallelCount(1);
      }

      localStorage.setItem("parallelid", node.id);
      setselectedOrNot(false);
    },

    [nodes]
  );

  //This is for adding parallel actions inside the parallel step
  const getImgParallelstepAction = useCallback(
    (e) => {
      const previousNode = nodes[selectedNodeId + 1];
      console.log("hi", inputValue);
      setInputValue((prevValue) => prevValue + 0.11);
      const btnId = e.target.id;
      console.log(inputValue);

      const node = {
        id: getNodeId(),
        key: getNodeId(),
        sourcePosition: "top",
        targetPosition: "bottom",
        position: {
          x: previousNode.position.x + parallelCount * 200,
          y: previousNode.position.y + 47,
        },
        type: "ImgNodeUpd3",
        data: {
          image: require(`../images/${btnId}`),
          text: "--",
          inputValue: Number(inputValue.toFixed(1)),
        },
        draggable: false,
      };
      setNodes((prevNodes) => [
        ...prevNodes,
        {
          ...previousNode,
          data: {
            ...previousNode.data,
            valueP: inputValue,
            countP: parallelCount,
          },
        },
        node, // Add the new node to the end of the array
      ]);
      if (nodes.length > 0) {
        const newedge = {
          id: getNodeId(),
          source: previousNode.id,
          target: node.id,
          sourceHandle: "right",
          targetHandle: "left",
          type: "customEdge",
          // Additional props you want to pass to the custom edge component
          data: {
            sourceX: previousNode.position.x,
            sourceY: previousNode.position.y,
            targetX: node.position.x,
            targetY: node.position.y,
          },
        };

        setEdges([...edges, newedge]);
        setParallelCount((prevCount) => prevCount + 1);
        localStorage.setItem("parallelCount", parallelCount);
      }
      setselectedOrNot(false);
    },

    [nodes]
  );

  ///This is for Transition move
  const getImgParallel = useCallback(
    (e) => {
      const a = myArray.length;
      setMyArray([...myArray, myArray[a - 1] + stepValueAdd]);
      const btnId = e.target.id;
      const node = {
        id: "decis" + getNodeId(),
        sourcePosition: "top",
        targetPosition: "bottom",
        position: {
          x: nodes[insertionIndex].position.x + 200,
          y: nodes[insertionIndex].position.y + 100,
        },
        type: "ImgNodeUpd1",
        data: {
          image: require(`../images/${btnId}`),
          text: "--",
          inputValue: myArray[a - 1] + stepValueAdd,
          inputValue1: myArray[a - 1] + stepValueAdd,
        },
        draggable: false,
      };
      setNodes([...nodes, node]);

      if (nodes.length > 0) {
        const previousNode = nodes[selectedNodeId + 1];
        // const commingNode = nodes[nodes.length - 1];
        const newedge = {
          id: getNodeId(),
          source: previousNode.id,
          target: node.id,
          type: "stepEdges",
        };

        setEdges([...edges, newedge]);
      }
      setselectedOrNot(false);
    },

    [nodes]
  );

  const Goup = useCallback(
    (e) => {
      setUp((prev) => !prev);
      if (nodes.length === 0) return null;
      const a = myArray.length;
      setMyArray([...myArray, myArray[a - 1] + stepValueAdd]);
      console.log(myArray)
      let mostLeftNode = nodes[0];
console.log(upNum)
      var index = nodes.findIndex(
        (node) => node && node.key && node.key.startsWith(upNum - stepValueAdd)
      );
console.log(index)
      if (index == -1) {
        index = 0;
      }
      nodes.forEach((node) => {
        if (node.position.x > mostLeftNode.position.x) {
          mostLeftNode = node;
        }
      });
      // console.log(mostLeftNode.position.x)
      const move = mostLeftNode.position.x + 150;

      const node = {
        id: getNodeId(),
        key: getNodeId(),
        sourcePosition: "top",
        targetPosition: "bottom",
        position: {
          x: mostLeftNode.position.x + 150,
          y: mostLeftNode.position.y,
        },
        type: "ImgNodeUpd1",
        data: {
          image: require(`../images/Transition.png`),
          inputValue: myArray[a - 1] + stepValueAdd,
        },
        draggable: true,
      };
      setNodes((prevNodes) => [
        ...prevNodes,
        { ...node, order: prevNodes.length },
      ]);

      if (nodes.length > 0) {
        const previousNode = nodes[selectedNodeId + 1];
        const RestartNode = nodes[index];
        const newedge = {
          id: getNodeId(),
          source: node.id,
          target: previousNode.id,
          type: "jumpedge",
          data: {
            sourceX: previousNode.position.x,
            sourceY: previousNode.position.y,
            targetX: node.position.x,
            targetY: node.position.y,
            moves: move,
          },
        };
        const newedge1 = {
          id: getNodeId(),
          target: node.id,
          source: RestartNode.id,
          type: "jumpedgedown",
          data: {
            sourceX: node.position.x,
            sourceY: node.position.y,
            targetX: RestartNode.position.x,
            targetY: RestartNode.position.y,
            moves: move,
          },
        };

        setEdges([...edges, newedge, newedge1]);
      }
      setselectedOrNot(false);
    },

    [nodes, upNum]
  );

  const Godown = useCallback(
    (e) => {
      // console.log(myArray);
    },
    [nodes]
  );

  const actionstepTable = useSelector((state) => state.actionstep);
  // console.log(actionstepTable)
  const dispatch = useDispatch();

  const handleNodeClick = (event, element) => {
    dispatch(resetTable());
    const ids = element.id;
    const indx = nodes.findIndex((element) => element.id === ids);
    setSelectedNodeId(indx - 1);

    localStorage.setItem("parallelCount", parallelCount);
    setInsertionIndex(indx);

    const selectedNode = nodes[indx];
    if (selectedNode) {
      setselectedOrNot(true);
    }

    if (selectedNode.id.startsWith("step")) {
      // setfixValueTrans(selectedNode.id)
      setTransitionStep(selectedNode.data.inputValue);
      setTransitionname(selectedNode.data.text);
      dispatch(updateActionStepIdTable(selectedNode.data.text + id));
      const flow = desiredRecipe?.stepChain?.actionStepTables || [];

      const concatenatedString = selectedNode.data.text + id;
      const inputObject = flow.find((item) => item.id === concatenatedString);

      setStepObject(inputObject);
    } else {
      // setfixValueAction(selectedNode.id)
      setActionStep(selectedNode.data.inputValue);
      setActioName(selectedNode.data.text);
      dispatch(updateActionStepIdTable(selectedNode.data.text + id));

      const flow = desiredRecipe?.stepChain?.actionStepTables || [];
      const concatenatedString = selectedNode.data.text + id;
      const inputObject = flow.find((item) => item.id === concatenatedString);
      setActioObject(inputObject);
      fetchData();
    }
    const nodesWithIdStartingWithParall = nodes.filter((node) =>
      node.id.startsWith("parall")
    );

    let nodeRightBelowSelected;

    // Find the node starting with "parall" and right below the selected node
    for (const node of nodesWithIdStartingWithParall) {
      const { x: selectedX, y: selectedY } = selectedNode.position;
      const { x, y } = node.position;
      if (y > selectedY) {
        nodeRightBelowSelected = node;
        break;
      }
    }
    setParallelNode(nodeRightBelowSelected);
    if (selectedNode.data.valueP !== null && hasSelectedNodeChanged) {
      const valuep = selectedNode.data.valueP;
      setInputValue(valuep);
      setHasSelectedNodeChanged(false);
    }

    if (hasSelectedNodeChanged) {
      setParallelCount(selectedNode.data.countP);
      setHasSelectedNodeChanged(false);
    }
  };

  //MAKE CONNECTION IN PARALLEL SECTION
  const ConnectNode = (event) => {
    const previousNode = nodes[selectedNodeId + 1];
    if (parallnode) {
      const newEdge = {
        id: getNodeId(),
        stroke: "red",
        source: previousNode.id,
        target: parallnode.id, // Modify this to the desired target node ID
        sourceHandle: "right",
        targetHandle: "left",
        type: "customEdgeDown",
        data: {
          // sourceX: previousNode.position.x,
          sourceY: previousNode.position.y,
          targetX: previousNode.position.x,
          targetY: parallnode.position.y,
        },
      };
      setEdges([...edges, newEdge]);
    }
  };

  return (
    <>
      <div
        className="position-fixed sticky-top top-0 end-0 p-3"
        id="myDiv"
        style={{ width: "50%" }}
      >
       
      </div>

      <div className=" d-flex menu-body w-100   ">
        <div className=" menu-body2 d-flex flex-row  h-75 w-100">
          <div className="border d-flex row w-100  border-info">
            <div className="d-flex  justify-content-between">
              <div>
                <button
                  type="button"
                  className="border text-center m-1 btn border-info"
                  style={{ backgroundColor: "#C0C0C0" }}
                  onClick={removeElement2}
                >
                  Management
                </button>
              </div>
              <div className="d-flex  flex-row align-items-end">
          <button
            type="button"
            className="border rounded-circle m-1 p-2  btn border-info"
            style={{ backgroundColor: "#b7e778" }}
          >
            Run
          </button>
          <button
            type="button"
            className="border rounded-circle m-1 p-2  btn border-info"
            style={{ backgroundColor: "#b7e778" }}
          >
            Hold
          </button>
          <button
            type="button"
            className="border rounded-circle m-1 p-2 btn border-info"
            style={{ backgroundColor: "#b7e778" }}
          >
            Abort
          </button>
        </div>
              <div>
                <Link to={`/logic/${id}`}>
                  <button
                    type="button"
                    className="border  btn m-1  border-info"
                    style={{ backgroundColor: "#b7e778" }}
                  >
                    Logic{" "}
                  </button>
                </Link>
                <Link to={`/graph/${id}`}>
                  <button
                    type="button"
                    className="border  btn  border-info"
                    style={{ backgroundColor: "#b7e778" }}
                  >
                    Graph
                  </button>
                </Link>

                <Link to={`/description/${id}`}>
                  <button
                    type="button"
                    className="border m-1 btn border-info"
                    style={{ backgroundColor: "#b7e778" }}
                  >
                    Descrition
                  </button>
                </Link>
                <Link to={`/parameter/${id}`}>
                  <button
                    type="button"
                    className="border  m-1 btn border-info"
                    style={{ backgroundColor: "#b7e778" }}
                  >
                    Parameter
                  </button>
                </Link>

                <Link to={`/signals/${id}`}>
                  <button
                    type="button"
                    className="border  m-1 btn border-info"
                    style={{ backgroundColor: "#b7e778" }}
                  >
                    Signals
                  </button>
                </Link>

                <Link to={`/alarmprompt/${id}`}>
                  <button
                    type="button"
                    className="border m-1 btn border-info"
                    style={{ backgroundColor: "#b7e778" }}
                  >
                    Alarm&Prompt
                  </button>
                </Link>
                <button
                  type="button"
                  className="border m-1 btn border-info"
                  style={{ backgroundColor: "#b7e778" }}
                  onClick={hide_tables}
                >
                  Hide Table
                </button>
                <Link to={`/pdf/${id}`}>
                  <button
                    type="button"
                    className="border m-1 btn border-info"
                    style={{ backgroundColor: "#b7e778" }}
                  >
                    Go to Pdf
                  </button>
                </Link>
                <button
                  type="button"
                  className="border m-1 btn border-info"
                  style={{ backgroundColor: "#C0C0C0" }}
                  onClick={removeElement}
                >
                  List-toolbox
                </button>
              </div>
            </div>
            <div className=" border d-flex p-0 m-0 border-info">
              {visibles2 && (
                <div className=" m-0" style={{ width: "18%" }}>
                  <Project />
                </div>
              )}
              <div className="border border-info " style={{ width: "10%" }}>
                <div className=" d-flex  row justify-content-between p-4 h-100">
                  <div className="">
                    <button
                      className="rounded border logic-btn p-0 w-100 border-info"
                      onClick={selectedOrNot ? getImg1 : undefined}
                    >
                      <img
                        className="logic-button"
                        id="Start.png"
                        alt="Start"
                        src={require(`../images/addStep.PNG`)}
                        style={{ backgroundColor: "white" }}
                      />{" "}
                    </button>
                  </div>
                  <div className="">
                    <button
                      className="rounded border logic-btn  p-0 w-100 border-info"
                      onClick={selectedOrNot ? addMultiStep : undefined}
                    >
                      <img
                        className="logic-button"
                        id="Pr.png"
                        alt="Parallel"
                        src={require(`../images/AddMultipleStep.PNG`)}
                        style={{ backgroundColor: "white" }}
                      />
                    </button>{" "}
                  </div>

                  <div>
                    <button
                      className="logic-btn border-0 p-0 w-75"
                      onClick={selectedOrNot ? getImgParallel : undefined}
                    >
                      {" "}
                      <img
                        className="logic-button"
                        id="Transition.png"
                        alt="Transition"
                        src={require(`../images/Decision.PNG`)}
                        style={{ backgroundColor: "white", width: "100px" }}
                      />
                    </button>{" "}
                  </div>
                  <div className="">
                    <button
                      className="rounded border logic-btn  p-0  w-100 border-info"
                      onClick={selectedOrNot ? getImgParallelstep : undefined}
                    >
                      <img
                        className="logic-button"
                        id="Pr.png"
                        alt="Parallel"
                        src={require(`../images/Parall.png`)}
                        style={{ backgroundColor: "white" }}
                      />
                    </button>{" "}
                  </div>
                  <div className="">
                    <button
                      className="rounded border logic-btn p-0 w-100 border-info"
                      onClick={
                        selectedOrNot ? getImgParallelstepAction : undefined
                      }
                    >
                      <img
                        className="logic-button"
                        id="Step.png"
                        src={require(`../images/InsideParal.PNG`)}
                        style={{ backgroundColor: "white" }}
                      />
                    </button>
                  </div>
                  <div className="">
                    <button
                      className="rounded border logic-btn p-0 w-100 border-info"
                      onClick={selectedOrNot ? getImg1P : undefined}
                    >
                      <img
                        className="logic-button"
                        id="Start.png"
                        alt="Start"
                        src={require(`../images/ParalelTransition.PNG`)}
                        style={{ backgroundColor: "white" }}
                      />{" "}
                    </button>
                  </div>
                  <div className="">
                    <button
                      className="rounded border logic-btn  p-0  w-100 border-info"
                      onClick={selectedOrNot ? Jumpup : undefined}
                    >
                      <img
                        className="logic-button"
                        id="Step.png"
                        src={require(`../images/up.PNG`)}
                        style={{ backgroundColor: "white" }}
                      />
                    </button>
                  </div>

                  <div>
                    <button
                      className="border logic-btn  p-0  w-75 border-info"
                      onClick={selectedOrNot ? ConnectNode : undefined}
                    >
                      Connect
                    </button>{" "}
                  </div>
                  <div>
                    <button
                      className="logic-btn border-0 p-0  w-75"
                      onClick={selectedOrNot ? getImg : undefined}
                    >
                      <img
                        className="logic-button"
                        id="Ende.png"
                        src={require(`../images/Ende.png`)}
                        style={{ backgroundColor: "white" }}
                      />
                    </button>
                  </div>
                  <Link to="/">
                    <div className="mt-auto text-center ">
                      {" "}
                      <button
                        type="button"
                        className="border btn btn-rounded p-4  border-info"
                        style={{ backgroundColor: "#b7e778" }}
                      >
                        Back
                      </button>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="border w-100 border-info">
                <div className="d-flex h-100">
                  <div className="border w-100 border-info">
                    <text className=" border-bottom d-flex  justify-content-center p-2 border-info ">
                      {" "}
                      {myRecipe} Run:O{" "}
                    </text>
                    <section className="d-flex p-2 mb-3 justify-content-between">
                      <button
                        className="p-0 no-border"
                        style={{ width: "3em", height: "3em" }}
                      >
                        {" "}
                        <img
                          alt="detail"
                          className="image"
                          src={Detail}
                          style={{ width: "100%", height: "100%" }}
                          onClick={get_detail}
                        />{" "}
                      </button>
                      <div className="d-flex justify-content-between">
                        <h5>Enter Jump Step:</h5>
                        <input
                          type="text"
                          defaultValue={stepValueAdd}
                          className="w-50 h-50 no-border"
                          onChange={(event) => ValueChange(event, "1")}
                        ></input>
                      </div>
                      <text> Rev-01.00</text>
                    </section>
                    <div className="d-flex column justify-content-around">
                      <div className="d-flex w-100  ">
                        <section className="d-flex h-100 w-100 justify-content-between">
                          <div className="border w-100">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-evenly",
                                width: "100%",
                                height: "100hv",
                              }}
                            >
                              <div
                                onKeyDown={handleKeyDown}
                                className=" w-100 "
                                style={{ height: "120vh", width: "90em" }}
                              >
                                <ReactFlow
                                  nodes={nodes}
                                  edges={edges}
                                  onNodesChange={onNodesChange}
                                  onEdgesChange={onEdgesChange}
                                  onConnect={onConnect}
                                  onInit={setRfInstance}
                                  nodeTypes={nodeTypes}
                                  onNodeClick={handleNodeClick}
                                  fitView
                                  attributionPosition="bottom-left"
                                  // edgeTypes={{ default: StepEdge }}
                                  edgeTypes={edgeTypes}
                                >
                                  <MiniMap />
                                  <Controls />

                                  {/* <Panel position="top-right">
                                    <button
                                      onClick={() => {
                                        onRestore();
                                      }}
                                    >
                                      Restore
                                    </button>
                                  </Panel> */}
                                  <Panel position="top-right">
                                    <button
                                      onClick={() => {
                                        onSave();
                                        handleSubmit();
                                      }}
                                    >
                                      save
                                    </button>
                                  </Panel>
                                </ReactFlow>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>

                      {visible2 && (
                        <div className="border  d-flex row justify-content-between border-info m-2 w-50 h-25">
                          <h5
                            className="border border-info text-center"
                            style={{ backgroundColor: "#b7e778" }}
                          >
                            {" "}
                            All steps{" "}
                          </h5>

                          <table className="table border border-dark ">
                            <thead>
                              <tr>
                                <th className="p-0">Scrittname</th>
                                <th className="p-0">Scrittnummer</th>
                                <th className="p-0">Restartadress</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...Array(nodes.length)].map((node, index) => (
                                <tr key={index} className="rows">
                                  <td>
                                    <input
                                      type="text"
                                      defaultValue={
                                        desiredRecipe2?.stepChain?.stepChain
                                          ?.nodes?.[index + 1]?.data?.text ||
                                        "-"
                                      }
                                      className="w-100 no-border"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      defaultValue={
                                        desiredRecipe2?.stepChain?.stepChain
                                          ?.nodes?.[index + 1]?.data
                                          ?.inputValue || "-"
                                      }
                                      className="no-border"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      defaultValue={
                                        desiredRecipe2?.stepChain?.stepChain
                                          ?.nodes?.[index + 1]?.data
                                          ?.inputValue || "-"
                                      }
                                      className="no-border"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="d-flex justify-content-end">
                            <button
                              type="button"
                              className="border  btn m-1  border-info"
                              style={{ backgroundColor: "#b7e778" }}
                              onClick={hide_detail}
                            >
                              Confirm{" "}
                            </button>
                          </div>
                        </div>
                      )}

                      {visibles3 && (
                        <div className="border  d-flex row justify-content-between border-info m-2 w-100 h-25">
                          <h5
                            className="border border-info text-center"
                            style={{ backgroundColor: "#b7e778" }}
                          >
                            {" "}
                            Add more steps{" "}
                          </h5>
                          <div className="d-flex column ">
                            <p>Number of steps</p>
                            <input
                              type="number"
                              value={number}
                              className="w-25 form-control mr-3 h-75"
                              onChange={handleMultiStep}
                            ></input>
                            {/* <p>{number}</p> */}
                          </div>

                          <table className="table border border-dark ">
                            <thead>
                              <tr>
                                <th className="p-0">Scrittname</th>
                                <th className="p-0">Scrittnummer</th>
                                <th className="p-0">Restartadress</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="rows">
                                <td>
                                  <input
                                    type="text"
                                    defaultValue="-"
                                    className="w-100 no-border"
                                  ></input>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    defaultValue="-"
                                    className=" no-border"
                                  ></input>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    defaultValue="-"
                                    className=" no-border"
                                  ></input>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="d-flex justify-content-end">
                            <button
                              type="button"
                              className="border  btn m-1  border-info"
                              style={{ backgroundColor: "#b7e778" }}
                              onClick={() => setVisibles3((prev) => !prev)}
                            >
                              Cancel{" "}
                            </button>
                            <button
                              type="button"
                              className="border  btn m-1  border-info"
                              style={{ backgroundColor: "#b7e778" }}
                              onClick={MultiSteps}
                            >
                              Confirm{" "}
                            </button>
                          </div>
                        </div>
                      )}

                      {up && (
                        <div className="border  d-flex row justify-content-between border-info m-2 w-50 h-25">
                          <h5 className="text-center">
                            {" "}
                            Choose step to jump:{" "}
                          </h5>
                          <div className="d-flex column p-3">
                            {myArray.map((elem) => (
                              <p className="m-2"> {elem}</p>
                            ))}
                          </div>
                          <div className="d-flex column ">
                            <p></p>
                            <input
                              type="number"
                              onChange={handleUpStep}
                              className="w-25 form-control mr-3 h-75"
                            ></input>
                          </div>

                          <div className="d-flex justify-content-end">
                            <button
                              type="button"
                              className="border  btn m-1  border-info"
                              style={{ backgroundColor: "#b7e778" }}
                              onClick={Goup}
                            >
                              {" "}
                              Confirm{" "}
                            </button>
                          </div>

                          {/* <div>   <input type="text" id="inputField" />

<button id="confirmButton" onClick={Goup}>Confirm</button>
</div> */}
                        </div>
                      )}

                      {down && (
                        <div className="border  d-flex row justify-content-between border-info m-2 w-50 h-25">
                          <h5 className="text-center"> Jump down to step: </h5>
                          <div className="d-flex column p-3">
                            {myArray.map((elem) => (
                              <p className="m-2"> {elem}</p>
                            ))}
                          </div>
                          <div className="d-flex column ">
                            <p></p>
                            <input
                              type="number"
                              className="w-25 form-control mr-3 h-75"
                            ></input>
                            {/* <p>{number}</p> */}
                          </div>

                          <div className="d-flex justify-content-end">
                            <button
                              type="button"
                              className="border  btn m-1  border-info"
                              id={upNum}
                              style={{ backgroundColor: "#b7e778" }}
                              onClick={Godown}
                            >
                              Confirm{" "}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {visible1 && (
                    <div className="border w-75 border-info">
                      <text className=" border-bottom d-flex  justify-content-center p-2 border-info ">
                        {" "}
                        Run:detail{" "}
                      </text>
                      <div className="tables p-4">
                        <ActionTable
                          handleNodeClick={handleNodeClick}
                          name={actionName}
                          step={actionStep}
                          actionObject={actionObject}
                          id={id}
                        />
                        <Step
                          name={transitionName}
                          step={transitionStep}
                          actionObject={StepObject}
                          id={id}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {visible && (
                <div className="border w-25 border-info">
                  <ul className=" toolbox column d-flex p-0 ">
                    <li className="border small border-info">I/O-List</li>
                    <li className=" border small border-info">Signal-list</li>
                    <li className=" border small border-info">Logic-In-Out</li>
                    <li className=" border small border-info">Parameter</li>
                    <li className=" border small border-info">EM</li>
                    <li className=" border small border-info">Interlock</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Phase;
