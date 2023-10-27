import React, { useState, useRef, useEffect } from "react";
import Project from "./project";
import { v4 as uuidv4 } from "uuid";
import "./phase.css";
import "./library.css";
import "reactflow/dist/style.css";
import "./logic.css";

import { mockData } from "./mocklibrary";
import { mockDataController } from "./mocklibrarycontroller";
import TextUpdaterNode from "./TextUpdaterNode.js";
import TextUpdaterNodeOutput from "./TextUpdaterNodeOutput.js";
import ImgNode from "./ImgNode.js";
import ImgNodeController from "./ImgNodeUpdController.js";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProjectSuccess } from "../redux/slices/projectReducerGet";
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  StepEdge,
  useReactFlow,
  Panel,
} from "reactflow";

//NEED TO STAY OUTSIDE
const getNodeId = () => `random${+new Date()}`;
const initialNodes = [];
const initialEdges = [];
const nodeTypes = {
  textUpdater: TextUpdaterNode,
  ImgNodeUpd: ImgNode,
  ImgNodeUpdController: ImgNodeController,
  textUpdaterO: TextUpdaterNodeOutput,
};

/////

const Logic = () => {
  const dispatch = useDispatch();
  //for the libary
  const [name, setName] = React.useState("AND_1.png");
  const [visible1, setVisible1] = useState(true);
  const [visibles, setVisibles] = useState(false);
  const [visibles2, setVisibles2] = useState(false);
  const [active, setActive] = useState(false);
  const [active1, setActive1] = useState(false);
  const removeElement1 = () => {
    setVisible1(() => true);
    setVisibles(() => false);
    setActive(true);
    setActive1(false);
  };
  const removeElements = () => {
    setVisible1(() => false);
    setVisibles(() => true);
    setActive1(true);
    setActive(false);
  };
  const removeElement = () => {
    setVisible((prev) => !prev);
  };
  const removeElement2 = () => {
    setVisibles2((prev) => !prev);
  };

  //////// FOR THE DIAGRAM LOGIC

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  /////SAVE TO MONGODB
  const { id } = useParams();
  const storedData = localStorage.getItem("RecipesFetched");
  const parsedData = JSON.parse(storedData);
  const desiredRecipe = parsedData.find((recipe) => recipe.id === id);

  const logicData = useSelector((state) => state.logicsave);
  ////SAVING THE DATA

  const handleSubmit = async () => {
    const flow = rfInstance.toObject();
    try {
      const response = await fetch(
        `http://localhost:8080/api/project/recipe/logic/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(flow),
        }
      );

      if (response.ok) {
        console.log("Data sent to server successfully");
      } else {
        console.error("Error sending data to server");
      }
      fetchData();
    } catch (error) {
      console.error("Error sending data to server", error);
    }
  };
  /////FOR THE LOGIC DIAGRAM PERSITENCE MEMORY

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      // const flow = JSON.parse(localStorage.getItem("flow"));
      const flow = desiredRecipe.logicChain.logic;

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
  }, [setNodes, setViewport, logicData]);

  ///////////////////////
  const Addnode = useCallback(() => {
    const generatedNodeId = getNodeId();
    const node = {
      id: generatedNodeId,
      targetPosition: "left",
      sourcePosition: "right",
      type: "textUpdater",
      data: { name: generatedNodeId, value: "input" },
      position: { x: 0, y: 0 },
    };
    setNodes([...nodes, node]);
  }, [nodes]);

  const AddnodeOutput = useCallback(() => {
    const generatedNodeId = getNodeId();
    const node = {
      id: generatedNodeId,
      targetPosition: "left",
      sourcePosition: "right",
      type: "textUpdaterO",
      data: { name: generatedNodeId, value: "output" },
      position: { x: 600, y: -100 },
    };
    setNodes([...nodes, node]);
  }, [nodes]);

  const getImg = useCallback(
    (e) => {
      const btnId = e.target.id;
      const node = {
        id: getNodeId(),
        sourcePosition: "right",
        targetPosition: "left",
        position: { x: 100, y: 0 },
        type: "ImgNodeUpdController",
        data: { image: require(`../images/${btnId}`) },
      };
      setNodes([...nodes, node]);
    },
    [nodes]
  );

  const getImg2 = useCallback(
    (e) => {
      const btnId = e.target.id;
      const node = {
        id: getNodeId(),
        sourcePosition: "right",
        targetPosition: "left",
        position: { x: 100, y: 0 },
        type: "ImgNodeUpd",
        data: { image: require(`../images/${btnId}`) },
      };
      setNodes([...nodes, node]);
    },
    [nodes]
  );

  ///for LIST-TOOLBOX
  const [visible, setVisible] = useState(false);

  //logic/libary change display
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(true);
  const showElement = () => {
    setShow((prev) => !prev);
    setShow1((prev) => !prev);
  };

  const url = "http://localhost:8080/api/project/recipeids";
  async function fetchData() {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      dispatch(fetchProjectSuccess(data));
      localStorage.setItem("RecipesFetched", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching missions:", error);
    }
  }
  useEffect(() => {
    fetchData();
    onRestore();
  }, []);

  return (
    <>
      <div className=" d-flex menu-body w-100 ">
        <div className=" menu-body2 d-flex flex-row w-100">
          <div className=" d-flex row  m-0 w-100 ">
            <div className=" d-flex p-2  justify-content-between ">
              <button
                type="button"
                className="border m-1 btn border-info"
                style={{ backgroundColor: "#C0C0C0" }}
                onClick={removeElement2}
              >
                Management
              </button>

              <button
                type="button"
                className="border m-1 btn border-info"
                style={{ backgroundColor: "#C0C0C0" }}
                onClick={removeElement}
              >
                List-toolbox
              </button>
            </div>
            <div className="d-flex p-0 h-100 border border-info">
              {visibles2 && (
                <div className=" m-0" style={{ width: "15%" }}>
                  <Project />
                </div>
              )}
              <div className="d-flex w-100 h-100">
                <div
                  className="row text-center m-0 border border-info"
                  style={{ width: "10%" }}
                >
                  <nav className="navbar ">
                    <ul className="nav d-flex  text-center justify-content-around navbar-nav">
                      <li className="nav-item w-75 ">
                        <button
                          type="button"
                          className="border btn btn-rounded m-4 border-info"
                          style={{ backgroundColor: "#b7e778" }}
                          onClick={showElement}
                        >
                          Library{" "}
                        </button>
                      </li>

                      <li className="nav-item w-75">
                        <button
                          type="button"
                          className="border btn btn-rounded m-4 border-info"
                          style={{ backgroundColor: "#b7e778" }}
                          onClick={Addnode}
                        >
                          New Input Parameter
                        </button>
                      </li>
                      <li className="nav-item w-75">
                        <button
                          type="button"
                          className="border btn btn-rounded m-4  border-info"
                          style={{ backgroundColor: "#b7e778" }}
                          onClick={AddnodeOutput}
                        >
                          New Output Parameter
                        </button>
                      </li>
                      <Link to="/graph">
                        <li className="nav-item w-75">
                          <button
                            type="button"
                            className="border btn btn-rounded m-4  border-info"
                            style={{ backgroundColor: "#b7e778" }}
                          >
                            New Graph
                          </button>
                        </li>
                      </Link>
                      <Link to={`/phase/${id}`}>
                        <li className="nav-item pt-5 mt-5 w-75">
                          <button
                            type="button"
                            className="border btn btn-rounded m-4  border-info"
                            style={{ backgroundColor: "#b7e778" }}
                          >
                            Back
                          </button>
                        </li>
                      </Link>
                    </ul>
                  </nav>
                </div>
                {show && (
                  <div className="d-flex border w-100 border-info">
                    <div className="d-flex h-100">
                      <div className=" d-flex border w-100 border-info">
                        <section className="d-flex p-2 justify-content-between">
                          <div>
                            <ul className="nav d-flex text-center justify-content-around navbar-nav">
                              <li className="nav-item  ">
                                <button
                                  type="button"
                                  className="border btn btn-rounded m-4 border-info"
                                  style={{
                                    backgroundColor: active
                                      ? "#C0C0C0"
                                      : "#b7e778",
                                  }}
                                  onClick={removeElement1}
                                >
                                  Logic-block{" "}
                                </button>
                              </li>
                              <li className="nav-item ">
                                <button
                                  type="button"
                                  className="border  btn  btn-rounded m-4  border-info"
                                  style={{
                                    backgroundColor: active1
                                      ? "#C0C0C0"
                                      : "#b7e778",
                                  }}
                                  onClick={removeElements}
                                >
                                  Controller
                                </button>
                              </li>
                            </ul>
                          </div>

                          {visible1 && (
                            <div className=" forscroll border w-100  border-dark ">
                              {mockData.map((data) => (
                                <button
                                  className="logic-btn"
                                  onClick={() => setName(data.src)}
                                >
                                  <img
                                    className="logic-button"
                                    alt={data.src}
                                    src={require(`../images/${data.src}`)}
                                  />
                                </button>
                              ))}
                            </div>
                          )}

                          {visibles && (
                            <div className="d-flex forscroll border w-100   align-content-start flex-wrap border-dark ">
                              {mockDataController.map((data) => (
                                <button
                                  className="logic-btn  w-25"
                                  onClick={() => setName(data.src)}
                                >
                                  <img
                                    className="logic-button "
                                    alt={data.src}
                                    src={require(`../images/${data.src}`)}
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                          {/* <div>
                              <ul className="nav m-2 d-flex w-100 text-center justify-content-around navbar-nav">
                                <li className="nav-item ">
                                  <button
                                    type="button"
                                    className="border w-75 btn m-3 border-info"
                                    style={{ backgroundColor: "#b7e778" }}
                                  >
                                    Add input
                                  </button>
                                </li>
                              </ul>
                            </div> */}

                          <div className="border w-25  border-info">
                            <img
                              className="logic-button-show  p-2"
                              src={require(`../images/${name}`)}
                            />
                            {visible1 && (
                              <button
                                type="button"
                                className="border btn m-4 border-info"
                                style={{ backgroundColor: "#b7e778" }}
                                id={name}
                                onClick={getImg2}
                              >
                                Add Logic Block
                              </button>
                            )}
                            {visibles && (
                              <button
                                type="button"
                                className="border btn m-4 border-info"
                                style={{ backgroundColor: "#b7e778" }}
                                id={name}
                                onClick={getImg}
                              >
                                Add Controller Block
                              </button>
                            )}
                          </div>
                        </section>
                      </div>
                      <div></div>
                    </div>
                  </div>
                )}
                {show1 && (
                  <div className="border w-100 border-info">
                    <div className="d-flex h-100">
                      <div className="border w-100 ">
                        <section className="d-flex h-100 justify-content-between">
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
                                className=" w-100 "
                                style={{ height: "95vh", width: "90em" }}
                              >
                                <ReactFlow
                                  nodes={nodes}
                                  edges={edges}
                                  onNodesChange={onNodesChange}
                                  onEdgesChange={onEdgesChange}
                                  onConnect={onConnect}
                                  onInit={setRfInstance}
                                  nodeTypes={nodeTypes}
                                  fitView
                                  attributionPosition="bottom-left"
                                  edgeTypes={{ default: StepEdge }}
                                  // zoomOnScroll={false}
                                  zoomOnDoubleClick={false}
                                >
                                  <MiniMap />
                                  <Controls />
                                  <div className="d-flex h-100 justify-content-between ">
                                    <div
                                      className=" border text-center  border-info"
                                      style={{ width: "15%" }}
                                    >
                                      {" "}
                                      <h4 className="border-bottom border-info">
                                        Inputs
                                      </h4>
                                    </div>
                                    <div
                                      className=" border text-center  border-info"
                                      style={{ width: "15%" }}
                                    >
                                      {" "}
                                      <h4 className="border-bottom border-info">
                                        Outputs
                                      </h4>
                                    </div>
                                  </div>

                                  <Panel
                                    style={{ paddingRight: "270px" }}
                                    position="top-right"
                                  >
                                    <button
                                      onClick={() => {
                                        handleSubmit();
                                      }}
                                    >
                                      save
                                    </button>
                                    {/* <button onClick={onRestore}>restore</button> */}
                                  </Panel>
                                </ReactFlow>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                      <div></div>
                    </div>
                  </div>
                )}

                {visible && (
                  <div className="border w-25 border-info">
                    <ul className=" toolbox column d-flex p-0 ">
                      <li className="border small border-info">I/O-List</li>
                      <li className=" border small border-info">Signal-list</li>
                      <li className=" border small border-info">
                        Logic-In-Out
                      </li>
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
      </div>
    </>
  );
};

export default Logic;
