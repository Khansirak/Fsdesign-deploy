import React, { useState, useEffect } from "react";
import "./menu.css";
import Project from "./project";
import Recipe from "./recipe";
import { useDispatch, useSelector } from "react-redux";
import { updateInput } from "../redux/slices/projectReducerSave";
import { fetchProjectSuccess } from "../redux/slices/projectReducerGet";

const Menu = () => {
  ///ADD PROJECT
  const dispatch = useDispatch();

  const storedData = localStorage.getItem("fetchedData");
  const parsedData = JSON.parse(storedData);
  const [projects, setProjects] = useState([]);
  const [recipeId, setrecipeIds] = useState();
  const [todelete, setTodelete] = useState();
  const [todeleteproject, setTodeleteproject] = useState();
  const [deleteproject, setdeleteproject] = useState();
  const [recipe, setReceipe] = useState(0);
  const [operationNumberClick, setoperationNumberClick] = useState(0);
  const [phaseNumberClick, setPhaseNumberClick] = useState(0);

  /////////////FOR PROJECT

  const handleSubmitProject = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Data sent to server successfully");
        // setProjectid(responseData[0]);
      } else {
        console.error("Error sending data to server");
      }
      fetchData();
    } catch (error) {
      console.error("Error sending data to server", error);
    }
  };
  const [projectIds, setProjectIds] = useState([]);

  const handleDeleteProject = async () => {
    console.log(todeleteproject);
    try {
      const toDelete = deleteproject;
      // console.log(toDelete)
      const response = await fetch(
        "http://localhost:8080/api/project/" + toDelete,
        {
          method: "DELETE",
          headers: {
            // "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Data sent to server successfully");
      } else {
        console.error("Error sending data to server");
      }
      fetchData();
      const updatedProjects = projects.filter(
        (project) => project.id !== todeleteproject
      );
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error sending data to server", error);
    }
  };
  const handleIdChangeProject = (id) => {
    // Use the id value here in the GrandparentComponent
    setTodeleteproject(id);
  };
  const onIdChangeproject = (id) => {
    // Use the id value here in the GrandparentComponent
    setdeleteproject(id);
  };
  //////////FOR RECIPE
  const handleButtonClickReceipe = () => {
    dispatch(updateInput("recipeNumber", recipe + 1));
    setReceipe(recipe + 1);
  };
  const handleButtonClickReceipeDelete = () => {
    setReceipe(recipe - 1);
    dispatch(updateInput("recipeNumber", recipe - 1));
    setReceipe(recipe - 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/project/recipe/" + deleteproject,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json(); // Parse the response as JSON
        console.log("Data sent to server successfully");
        setrecipeIds(responseData[0]);

        console.log("Response Data:", recipeId);
      } else {
        console.error("Error sending data to server");
      }
      fetchData();
    } catch (error) {
      console.error("Error sending data to server", error);
    }
  };
  const handleSubmitReceipeDelete = async () => {
    try {
      const toDelete = todelete;
      const response = await fetch(
        `http://localhost:8080/api/project/${todeleteproject}/recipe/${toDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        console.log("Data sent to server successfully");
        console.log("Response Data:", recipeId);
      } else {
        console.error("Error sending data to server");
      }
      fetchData();
    } catch (error) {
      console.error("Error sending data to server", error);
    }
  };
  const handleIdChange = (id) => {
    // Use the id value here in the GrandparentComponent
    setTodelete(id);
  };

  const handleIdChangeOperation = (id) => {
    // Use the id value here in the GrandparentComponent
    setoperationNumberClick(id);
  };
  //////FOR OPERATION
  const handleSubmitOperation = async () => {
    const toDelete = todelete;
    try {
      const response = await fetch(
        `http://localhost:8080/api/project/${deleteproject}/recipe/${toDelete}/operation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

  const handleDeleteOperation = async () => {
    try {
   
      const response = await fetch(
        `http://localhost:8080/api/project/recipe/operation/${operationNumberClick}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
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

  /////////FOR THE PHASE
  const handleClickPhase = (id) => {

    setPhaseNumberClick(id);

  };
  const handleSubmitPhase = async () => {
    console.log(todeleteproject)
    console.log(operationNumberClick)
    try {
      const response = await fetch(
        `http://localhost:8080/api/project/${todeleteproject}/operation/${operationNumberClick}/phase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

  const handleDeletePhase = async () => {
    try {
   console.log("phase number:", phaseNumberClick)
      const response = await fetch(
        `http://localhost:8080/api/project/recipe/phase/${phaseNumberClick}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
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
  ///for LIST-TOOLBOX
  const [visible, setVisible] = useState(false);
  const removeElement = () => {
    setVisible((prev) => !prev);
  };
  const url = "http://localhost:8080/api/project/getProject";
  async function fetchData() {
    try {
      const response = await fetch(url);
      const data = await response.json();
      // console.log(data);
      dispatch(fetchProjectSuccess(data));
      setProjects(data);

      localStorage.setItem("fetchedData", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching missions:", error);
    }
  }

  useEffect(() => {
    fetchData();
   
    setReceipe(parsedData?.projectInformation?.["recipeNumber"] || 0);
  }, []);

  console.log("projects:", projects);
  return (
    <>
      <div className="">
        <div className=" menu-body2 d-flex flex-row">
        <div className="row  " style={{ position: "fixed", top: "0", width: "7%", paddingTop:"50px",  zIndex: "100" }}>
            {/* <nav className=" p-0  "> */}
              <ul className="nav  d-flex justify-content-around mt-5 navbar-nav">
                <li className="nav-item pt-5 mt-5 w-25 ">
                  <button
                    type="button"
                    className="border btn m-2 border-info"
                    style={{ backgroundColor: "#b7e778", fontSize: "12px", height:"100%" }}
                    onClick={() => {
                      handleSubmitProject();
                    }}
                  >
                    New Project
                  </button>
                </li>
                <li className="nav-item pt-2 w-25 ">
                  <button
                    type="button"
                    className="border btn m-2 border-info"
                    style={{ backgroundColor: "#b7e778",fontSize: "12px", height:"100%" }}
                    onClick={() => {
                      handleDeleteProject();
                    }}
                  >
                    Delete Project
                  </button>
                </li>
                <li className="nav-item pt-2 w-50">
                  <button
                    type="button"
                    className="border  btn m-2 border-info"
                    style={{ backgroundColor: "#b7e778", fontSize: "12px", height:"100%" ,width:"115%" }}
                    onClick={() => {
                      handleButtonClickReceipe(), handleSubmit();
                    }}
                  >
                    New recipe
                  </button>
                </li>
                <li className="nav-item pt-2 w-25">
                  <button
                    type="button"
                    className="border  btn m-2 border-info"
                    style={{ backgroundColor: "#b7e778", fontSize: "12px", height:"100%" }}
                    onClick={() => {
                      handleButtonClickReceipeDelete(),
                        handleSubmitReceipeDelete();
                    }}
                  >
                    Delete recipe
                  </button>
                </li>
                <li className="nav-item pt-2 w-75">
                  <button
                    type="button"
                    className="border  btn m-2 p-0 border-info"
                    style={{ backgroundColor: "#b7e778", fontSize: "12px", height:"110%",width:"75%" }}
                    onClick={() => {
                      handleSubmitOperation();
                    }}
                  >
                    New Operation
                  </button>
                </li>
                <li className="nav-item pt-3 w-75">
                  <button
                    type="button"
                    className="border  btn m-2 p-0 border-info"
                    style={{ backgroundColor: "#b7e778", fontSize: "12px" , height:"110%",width:"75%"}}
                    onClick={() => {
                      handleDeleteOperation();
                    }}
                  >
                    Delete Operation
                  </button>
                </li>
                <li className="nav-item pt-3 w-50">
                  <button
                    type="button"
                    className="border  btn m-2 border-info"
                    style={{ backgroundColor: "#b7e778", fontSize: "12px", height:"100%",width:"115%" }}
                    onClick={() => {
                      handleSubmitPhase();
                    }}
                  >
                    New Phase
                  </button>
                </li>
                <li className="nav-item pt-2 w-25">
                  <button
                    type="button"
                    className="border  btn m-2 border-info"
                    style={{ backgroundColor: "#b7e778", fontSize: "12px", height:"100%" }}
                    onClick={() => {
                      handleDeletePhase();
                    }}
                  >
                    Delete Phase
                  </button>
                </li>
              </ul>
            {/* </nav> */}
          </div>
          <div className=" w-100 ml-5 border-info" style={{ marginLeft: "100px" }}>
            <div className=" d-flex row justify-content-between m-1">
              <div className="col text-center ">
                <h4 className=" p-2 font-weight-bold"> Management</h4>
              </div>
              <div className="col text-end">
                <button
                  type="button"
                  className="border right m-1 btn border-info"
                  style={{ backgroundColor: "#C0C0C0" }}
                  onClick={removeElement}
                >
                  List-toolbox
                </button>
              </div>
            </div>

            <div className="d-flex flex-row border w-100 justify-content-center border-info">
              <div className="d-flex  flex-column  border w-100 justify-content-center border-info">
                {projects.map((item, index) => (
                  <Project
                    recipeId={recipeId}
                    projectId={item.id}
                    recipe={recipe}
                    key={index}
                    projectindex={index}
                    onIdChange={handleIdChange}
                    onIdChangeOperation={handleIdChangeOperation}
                    onIdChangeProject={handleIdChangeProject}
                    onIdChangeproject={onIdChangeproject}
                    onIdChangePhase={handleClickPhase}
                    projectids={projectIds}
                    item={item}
                  />
                ))}
              </div>
              <div className="border w-50 border-info"></div>

              {visible && (
                <div className="border border-info" style={{ width: "30%" }}>
                  <ul className=" toolbox d-flex  m-0 p-0 ">
                    <li className="border  border-info">I/O-List</li>
                    <li className=" border  border-info">Signal-list</li>
                    <li className=" border  border-info">Logic-In-Out</li>
                    <li className=" border  border-info">Parameter</li>
                    <li className=" border  border-info">EM</li>
                    <li className=" border  border-info">Interlock</li>
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
export default Menu;
