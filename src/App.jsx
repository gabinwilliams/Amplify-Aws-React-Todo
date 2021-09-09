import React, {useState} from 'react';
import {API} from 'aws-amplify';
import {createTodo} from './graphql/mutations';
// import {getTodo} from './graphql/queries';
import {withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';

function App() {

  const [todo, setTodo] = useState([])
  const [todoData, setTodoData] = useState({name: '', description: ''})

  const handleAddTodo = () => {
    const name = window.prompt('Enter a name');
    const description = window.prompt('Enter a description');

   


    setTodo([{name, description}, ...todo])

    API.graphql({
      query: createTodo, 
      variables: {input: {name, description, tags: []}},
    }).then((response) => console.log(response))

 
  }

 


  

  return (
    <div className="App">
      <div>
        <AmplifySignOut/>
      </div>
      <h1>Todos</h1>
      <button onClick={handleAddTodo}>Add Task</button>
      <main>
        <article>
          <h3>Todo Title</h3>
          <p>Todo Description</p>
        </article>
      </main>
    </div>
  );
}

export default withAuthenticator(App);
