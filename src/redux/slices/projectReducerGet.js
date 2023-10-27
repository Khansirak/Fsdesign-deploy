import { createAsyncThunk } from '@reduxjs/toolkit';


export const FETCH_PROJECT = 'FETCH_PROJECT';


export function fetchProjectSuccess(projectdata) {
  return {
    type: FETCH_PROJECT,
    payload: projectdata
  };
  
}
// const url='http://localhost:8080/api/project/information/get/fe866ecb-11a8-4c91-ae5d-185d2edbf660';
// export const displayMission = createAsyncThunk(FETCH_PROJECT, async () => {
//   const response = await fetch(
//     url,
//   );
//   const data = await response.json();
//   const project = Object.keys(data).map((key) => ({
//     loading: false,
//     id: data[key].id,
//     projectName: data[key].projectName,
//     recipe: data[key].recipe,
//     operation: data[key].operation,
//     phase: data[key].phase,
//     interlock: data[key].interlock,
//     equipementModule: data[key].equipementModule,

//   }));
//   // console.log(mission)
//   return project;
// });



const initialState = {
    projectdata: []
  };

  function projectReducer(state = initialState, action) {
    switch (action.type) {
      case FETCH_PROJECT:
        return { ...state, projectdata: action.payload };
      default:
        return state;
    }
  }
  
  export default projectReducer;