import React from 'react';
import './App.css';
import SearchField from "./components/SearchField";
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from "./reducers";
import Map from "./components/Map";
import FunctionTab from "./components/FunctionTab";


const store = createStore(reducer);
class App extends React.Component{

    render(){
        return(
            <Provider store={store}>
                <div className={"map-parent"}>
                    <div className={"search-field"}>
                        <div className={"search-input"}>
                            <FunctionTab/>
                        </div>
                    </div>
                    <div className={"map-field"}>
                        <Map/>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default App;
