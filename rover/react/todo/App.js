let nextTodoId = 0;

var initialState = {
    todos: [{
        id: 0,
        completed: false,
        text: 'Initial todo for demo purpose'
    }]
};

let store = configureStore(initialState);

const getVisibleTodos = (todos, filter) => {
    switch(filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed);
        case 'SHOW_NOT_COMPLETED':
            return todos.filter(t => !t.completed);            
    }
}

const { Component } = React;

var AddTodo = () => {
    let input;
    return (
        <div>
            <input type='text' ref={ node => {
                input = node;
            }} />
            <button onClick= {() => { 
                store.dispatch({
                    type:'ADD_TODO',
                    id: ++nextTodoId,
                    text: input.value
                })
                input.value = '';
            }}>
             Add Todo
            </button>
        </div>
    );
};

const Link = ({
    active,
    onClick,
    children
}) => {
    if( active ) {
        return <span>{children} </span>;
    }
    return ( 
        <a href='#' onClick={ (e) => {
                e.preventDefault();
                onClick(filter);
            }} >

            {children}
        </a>)
};

class FilterLink extends Component {
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => 
            this.forceUpdate()
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const state = store.getState();

        return (
            <Link 
                active = { props.filter === state.visibilityFilter }
                onClick = { () => 
                     store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter
                    })
                } 
            >
                {props.children}
            </Link>
        )
    };
};

var Footer = () => {
    return (
        <p>
            Show: 
            { ' ' }
            <FilterLink 
                filter='SHOW_ALL'>
                All 
            </FilterLink>
            
            { ' ' }
            <FilterLink 
                filter='SHOW_COMPLETED'>
                COMPLETED
            </FilterLink>
            
            { ' ' }
            <FilterLink 
                filter='SHOW_NOT_COMPLETED'>
                NOT COMPLETED
            </FilterLink>                    

        </p>    
    )
};

const Todo = ({ onClick, completed, text }) => (
    <li onClick={onClick} style={{textDecoration: completed ? 'line-through' : 'none'}}>
     {text}
    </li>    
);

const TodoList = ({ todos, onTodoClick }) => (
    <ul>
        {todos.map( todo =>
            <Todo key={todo.id}
                {...todo}
                onClick = {() => onTodoClick(todo.id)}
            />
        )}
    </ul>  
);

const mapStateToProps = (state) => {
    return {
        todos: getVisibleTodos(
            state.todos, 
            state.visibilityFilter
        )
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch({
                type: 'TOGGLE_TODO',
                id
            })
        }
    }
};

const {connect} = ReactRedux;
const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);

const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer/>
    </div>
);