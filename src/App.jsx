import React, {useState, useEffect} from 'react';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import {createTodo} from './graphql/mutations';
import {todosByData, listTodos } from './graphql/queries';
import {withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';


function App() {

  const [nextToken, setNextToken] = useState(null);
  const [todo, setTodo] = useState([])
  const [todoData, setTodoData] = useState([])
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState('');


  useEffect(() => {
    async function login() {
      try {
        await API.graphql({
                query: listTodos 
              }).then((response) => {
                setTodo(response.data.listTodos.items)
                console.log(response.data.listTodos.items);
              })
      } catch (error) {
        console.log(error);
      }
    }

    login();
  }, []);

    // async function fetch() {
    //   try {
    //     await API.graphql({
    //       query: listTodos 
    //     }).then((response) => {
    //       setTodo([response])
    //       console.log(response);
    //     }
    //     )
    //   } catch (error) {
    //     console.log(error);
    //   }
    // API.graphql({
    //       query: listTodos 
    //     }).then((response) => {
    //       setTodo([response])
    //       console.log(response);
    //     }
    //     )

  // }, []);
  

  // const fetchContacts = () => {

  //   API.graphql({
  //     query: listTodos 
  //   }).then((response) => {
  //     setTodo(response, ...todo)
  //   }

  //   )}

  const handleAddTodo = () => {
    const name = window.prompt('Enter a name');
    const description = window.prompt('Enter a description');
    const owner = 'todo';
   


    setTodo([{name, description}, ...todo])

    API.graphql({
      query: createTodo, 
      variables: {input: {name, owner, description, tags: []}},
    }).then((response) => console.log(response))
    
 
  }

  return (
    <div className="App">
      <div>
        <AmplifySignOut/>
      </div>
      <h1>Todos</h1>
      <button onClick={handleAddTodo}>Add Task</button>
      <button>Fetch tasks</button>
      <main>
        {JSON.stringify(todo)}
      {todo.map(task => (
        <article 
        key={task.id}
        >
          <p>Todo Title: {task.name}</p>
          <p>Todo Description: {task.description}</p>
        </article>
           
        ))}
      </main>
    </div>
  );
}

export default withAuthenticator(App);
