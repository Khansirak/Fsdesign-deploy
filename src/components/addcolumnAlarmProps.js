import React, { useState } from "react";


import { updateAlarmPropsTable } from "../redux/slices/alarmpropsReducer";
import { useDispatch } from "react-redux";

const AddcolumnAlarmProps = (props) => {
  const storedData = localStorage.getItem("RecipesFetched");
  const parsedData = JSON.parse(storedData);
  const desiredRecipe = parsedData.find((recipe) => recipe.id === props.id);

  //ADDING THE INFORMATION OF PARAMETER TO SERVER

  const dispatch = useDispatch();
  const handleInputChange = (event, fieldId) => {
    const key = event.target.name;
    const value = event.target.value;
    dispatch(updateAlarmPropsTable(key, value));
  };
  const combinedClassName = `w-100 small p-0 m-0 no-border ${props.className}`;
  const propName = JSON.stringify(props.param2) + JSON.stringify(props.param);
  const hg=JSON.stringify(desiredRecipe?.alarmPropsData?.alarmpropsData?.table?.[propName] || 10)?.length
 
  return (
    <>

      <th scope="col p-0 m-0">
        <textarea
          type="text"
          name={JSON.stringify(props.param2) + JSON.stringify(props.param)}
          defaultValue={
            (() => {
              const propName = JSON.stringify(props.param2) + JSON.stringify(props.param);
              if (propName === "10") return desiredRecipe?.alarmPropsData?.alarmpropsData?.table?.[propName] || "Alarm Tag";
              if (propName === "11") return desiredRecipe?.alarmPropsData?.alarmpropsData?.table?.[propName] || "Status";
              if (propName === "12") return desiredRecipe?.alarmPropsData?.alarmpropsData?.table?.[propName] || "Description";
              if (propName === "13") return desiredRecipe?.alarmPropsData?.alarmpropsData?.table?.[propName] || "Type";
              if (propName === "14") return desiredRecipe?.alarmPropsData?.alarmpropsData?.table?.[propName] || "Priority";
              if (propName === "15") return desiredRecipe?.alarmPropsData?.alarmpropsData?.table?.[propName] || "Def: low-Alarm";
              if (propName === "16") return desiredRecipe?.alarmPropsData?.alarmpropsData?.table?.[propName] || "Def: High Alarm";
              if (propName === "17") return desiredRecipe?.alarmPropsData?.alarmpropsData?.table?.[propName] || "Def: High-High-Alarm";

              return (
                desiredRecipe?.alarmPropsData?.alarmpropsData?.table?.[propName] || "-"
              );
            })()
          }
          className={combinedClassName}
          style={{ minHeight: "20px",  height: `${(hg) *2 +5}px` || '5px', }} // Set the initial minimum height
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
export default AddcolumnAlarmProps;
