import React from "react"
import Header from "./Header"
import Order from "./Order"
import Inventory from "./Inventory"
import Fish from "./Fish"
import sampleFishes from "../sample-fishes"
import base from "../base"

class App extends React.Component {
	constructor() {
		super();
		this.addFish = this.addFish.bind(this);
		this.loadSample = this.loadSample.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.state = {
            fishes: {},
            order: {}
		};
	}
	componentWillMount() {
		const storeId = this.props.params.storeId;
		this.ref = base.syncState(`${storeId}/fishes`
			, {
				context: this,
				state: "fishes"
			});
		const localStorageRef = localStorage.getItem(`order-${storeId}`);
		if(localStorageRef) {
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}
	}
	componentWillUnmount() {
		base.removeBinding(this.ref);
	}
	componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
	}
	addFish(fish) {
		const fishes = {...this.state.fishes};
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		this.setState({ fishes });
	}
	loadSample() {
		this.setState({
			fishes: sampleFishes
		});
	}
	addToOrder(key) {
		const order = {...this.state.order};
		order[key] = order[key] + 1 || 1;
		this.setState({ order });
	}
	render() {
		return (
			<div className="catch-of-the-day">
			    <div className="menu">
			        <Header tagline="Fresh Seafood Market" />
			        <ul className="list-of-fishes">
			            {Object
			            	.keys(this.state.fishes)
			                .map(key => <Fish key={key} 
			                	              index={key} //key is for react, index for me
			                	              details={this.state.fishes[key]} 
			                	              addToOrder={this.addToOrder} />)}
			        </ul>
			    </div>
			    <Order fishes={this.state.fishes} 
			           order={this.state.order} 
			           params={this.props.params} />
			    <Inventory addFish={this.addFish} loadSample={this.loadSample} />
			</div>
		);
	}
}

export default App;