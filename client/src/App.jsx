import StudentForm from "./pages/StudentForm/StudentForm";
import {createTheme, ThemeProvider} from "@mui/material";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import StudentListing from "./pages/StudentListing/StudentListing"
import theme from "./theme";
import './App.css'

const appTheme = createTheme(theme);
const router = createBrowserRouter([{
    path: "/",
    element: <StudentForm/>,
}, {
    path: "/all",
    element: <StudentListing/>,
}
]);

function App() {
    return (
        <ThemeProvider theme={appTheme}>
            <RouterProvider router={router}/>
        </ThemeProvider>
    )
}

export default App
