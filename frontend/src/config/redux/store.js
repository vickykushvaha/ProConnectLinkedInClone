import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducer/authReducer"
import postReducer from "./reducer/postReducer"


// *   STEP fror state management
// submit actions
// handle action in it's reducer
// register -> here reducer



export const store=configureStore({
    reducer:{
        auth:authReducer,
        postReducer:postReducer
    }
})