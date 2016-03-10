/**
 * Created by shahulhameed on 3/7/16.
 */
var TodoInput = React.createClass({
    getInitialState: () => ({ inputText: '' }),
    handleChange(event) {
      this.setState({
          inputText: event.target.value
      })
    },
    handleSubmit(event) {
        event.preventDefault();
        this.props.addTodo(this.state.inputText)
        this.setState({
            inputText: ''
        });
    },
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <input type="text"
                        placeholder="Type in you tood"
                        value={this.state.inputText}
                        onChange={this.handleChange.bind(this)}/>
                    <button className="green grey">Submit</button>
                </form>
            </div>
        )
    }
});
