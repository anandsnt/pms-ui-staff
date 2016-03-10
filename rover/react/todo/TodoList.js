/**
 * Created by shahulhameed on 3/8/16.
 */
/**
 * Created by shahulhameed on 3/7/16.
 */
var TodoList = React.createClass({
    render() {
        return (
            <ul>
                {
                    this.props.todos.map((todo) => {
                        return <TodoItem todo={todo} key={todo.id}/>
                    })
                }
            </ul>
        )
    }
});
