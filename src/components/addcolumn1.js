import React, { useState } from "react";
import { updateParameterTable } from "../redux/slices/parameterReducerSave";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Addcolumn1 = (props) => {
  const storedData = localStorage.getItem("RecipesFetched");
  const parsedData = JSON.parse(storedData);
  const desiredRecipe = parsedData.find((recipe) => recipe.id === props.id);


  //ADDING THE INFORMATION OF PARAMETER TO SERVER

  const dispatch = useDispatch();
  const handleInputChange = (event, fieldId) => {
    const key = event.target.name;
    const value = event.target.value;
    dispatch(updateParameterTable(key, value));
  };
  const combinedClassName = `w-100 small m-0 p-0 no-border ${props.className}`;
  const propName = JSON.stringify(props.param2) + JSON.stringify(props.param);
  // console.log(desiredRecipe.parameterTables.parameterData.table1[propName])
  const hg=JSON.stringify(desiredRecipe?.parameterTables?.parameterData?.tableP?.[propName] || 10).length 
 
  return (
    <>
      <th scope=" p-0 m-0">
        <textarea
          type="text"
          name={JSON.stringify(props.param2) + JSON.stringify(props.param)}
          defaultValue={
            (() => {
              const propName = JSON.stringify(props.param2) + JSON.stringify(props.param);
              if (propName === "10") return desiredRecipe?.parameterTables?.parameterData?.tableP?.[propName] || "Parameter";
              if (propName === "11") return desiredRecipe?.parameterTables?.parameterData?.tableP?.[propName] || "Default";
              if (propName === "12") return desiredRecipe?.parameterTables?.parameterData?.tableP?.[propName] || "Unit";
              if (propName === "13") return desiredRecipe?.parameterTables?.parameterData?.tableP?.[propName] || "Description";
              if (propName === "14") return desiredRecipe?.parameterTables?.parameterData?.tableP?.[propName] || "Min Wert";
              if (propName === "15") return desiredRecipe?.parameterTables?.parameterData?.tableP?.[propName] || "Max Wert";
             
              return (
                desiredRecipe?.parameterTables?.parameterData?.tableP?.[propName] || "-"
              );
            })()
           
          }
          className={combinedClassName}
     
          style={{ minHeight: "20px",  height: `${(hg) *2}px` || '5px', }} // Set the initial minimum height
          onChange={(event) => {
            event.target.style.height = "10px"; // Reset the height to auto
            event.target.style.height = event.target.scrollHeight + "px"; // Set the height to fit the content
            handleInputChange(event, "1");
          }}
        />
      </th>
    </>
  );
};
export default Addcolumn1;
