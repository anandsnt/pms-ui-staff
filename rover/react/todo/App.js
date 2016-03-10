/**
 * Created by shahulhameed on 3/8/16.
 */

function mapStateToProps(state){
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        actions: Redux.bindActionCreators(actions, dispatch)
    }
}

var App = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(React.createClass({
    render() {
        return (
            <div>
                <h1>Todo List Redux App </h1>
                <TodoInput addTodo={this.props.actions.addTodo}/>
                <TodoList todos={this.props.todos}/>
            </div>
        )
    }
}));
