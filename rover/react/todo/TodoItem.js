/**
 * Created by shahulhameed on 3/8/16.
 */
/**
 * Created by shahulhameed on 3/7/16.
 */
var TodoItem = React.createClass({
    handleDelete(){

    },

    handleComplete(){

    },

    render() {
        return (
            <li>
                <span>{this.props.todo.text}</span>
                <button className="button green" onClick={this.handleComplete.bind(this)}>Mark as completed</button>
                <button className="button red" onClick={this.handleDelete.bind(this)}>Delete todo</button>
            </li>
        )
    }
});
