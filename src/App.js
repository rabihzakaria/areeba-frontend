
import './App.css';
import CustomerPage from './components/CustomerPage/customerPage';
import AddCustomer from './components/AddCustomer/addCustomer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


// Your main App component
const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={CustomerPage} />
                <Route path="/edit" exact component={AddCustomer} />
            </Switch>
        </Router>
    );
};
export default App;
