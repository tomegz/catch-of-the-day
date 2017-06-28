import React from "react"
import { getFunName } from "../helpers"
class StorePicker extends React.Component {
	goToStore(e) {
		//grab the text from the box
		const text = this.storeInput.value;
		//go to url with this text
		this.context.router.transitionTo(`/store/${text}`);
		e.preventDefault();
	}
    render() {
    	return (
    		<form className="store-selector" onSubmit={ this.goToStore.bind(this) }>
    		    <h2>Please enter a Store</h2>
    		    <input type="text" required placeholder="Store name" defaultValue={ getFunName() } 
    		      ref={ (input) => this.storeInput = input } />
    		    <button type="submit">Visit Store</button>
    		</form>
    	);
    }
}

StorePicker.contextTypes = {
	router: React.PropTypes.object
};

export default StorePicker; 
