import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import ScatterPlot from './charts/ScatterPlot';


function App() {
  return (
    <div className="App">
      <header className="App-header">React Charts Collection</header>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" component={LineChart  } exact={true} />
            <Route path="/bar-chart" component={BarChart} exact={true} />
            <Route path="/line-chart" component={LineChart} exact={true} />
            <Route path="/scatter-plot" component={ScatterPlot} exact={true} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
