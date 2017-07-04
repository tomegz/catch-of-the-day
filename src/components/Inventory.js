import React from "react"
import AddFishForm from "./AddFishForm"
import base from "../base"


class Inventory extends React.Component {
	constructor() {
		super();
		this.renderInventory = this.renderInventory.bind(this);
		this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      uid: null,
      owner: null
    }
	}
  componentDidMount() {
    base.onAuth((user) => {
      if(user) {
        this.authHandler(null, { user });
      }
    });
  }
	handleChange(e, key) {
		const fish = this.props.fishes[key];
		const updatedFish = {
			...fish,
			[e.target.name]: e.target.value
		};
		this.props.updateFish(key, updatedFish);
	}
	renderInventory(key) {
		const fish = this.props.fishes[key];
        return (
        	  <div className="fish-edit" key={key}>
                  <input type="text" name="name" value={fish.name} placeholder="Fish Name" 
                         onChange={(e) => this.handleChange(e, key)} />
                  <input type="text" name="price" value={fish.price} placeholder="Fish Price"
                         onChange={(e) => this.handleChange(e, key)} />
                  <select type="text" name="status" value={fish.status} onChange={(e) => this.handleChange(e, key)}>
                  	<option value="available">Fresh!</option>
                  	<option value="unavailable">Sold Out!</option>
                  </select>                  
                  <textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc..."
                            onChange={(e) => this.handleChange(e, key)}></textarea>
                  <input type="text" name="image" value={fish.image} placeholder="Fish Image"
                         onChange={(e) => this.handleChange(e, key)} />
                  <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
              </div>
        );
	}
  authenticate(provider) {
    base.authWithOAuthPopup(provider, this.authHandler);
  }
  authHandler(err, authData) {
    if(err) {
      return console.error(err);
    }
    //grab the store info
    const storeRef = base.database().ref(this.props.storeId);
    //query firebase once for store data
    storeRef.once("value", (snapshot) => {
      const data = snapshot.val() || {};
      //if there's no owner, claim it as our own
      if(!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }
      //do it locally also
      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      });
    });
  }
  logout() {
    base.unauth();
    //logout locally
    this.setState({
      uid: null
    });
  }
  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to your store's inventory</p>
        <button className="github" onClick={() => this.authenticate("github")}>Log In with Github</button>
        <button className="facebook" onClick={() => this.authenticate("facebook")}>Log In with Facebook</button>
        <button className="twitter" onClick={() => this.authenticate("twitter")}>Log In with Twitter</button>
      </nav>
    );
  }
  render() {
    const logout = <button onClick={this.logout}>Log Out</button>;
    //check if user is not logged in
    if(!this.state.uid) {
      return <div>{this.renderLogin()}</div>;
    }
    //check if user is the owner
    if(this.state.uid !== this.state.owner){
      return (
        <div>
          <p>Sorry, you are not the owner of this Store</p>
          {logout}
        </div>
      );
    }
    return (
      <div>
        	 {Object
        	   .keys(this.props.fishes)
        	   .map(this.renderInventory)}
        	 <p>Inventory</p>
           {logout}
        	 <AddFishForm addFish={this.props.addFish} />
        	 <button onClick={this.props.loadSample}>Load Sample Fishes</button>
      </div>
    );
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  addFish: React.PropTypes.func.isRequired,
  loadSample: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired
}

export default Inventory;