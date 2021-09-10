import React, {useState} from 'react';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import {createTodo} from './graphql/mutations';
import {todosByData } from './graphql/queries';
import {withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';

function App() {

  const [nextToken, setNextToken] = useState(null);
  const [todo, setTodo] = useState([])
  const [todoData, setTodoData] = useState({name: '', description: ''})
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState('');

  async function fetchContacts() {
    setLoading(true);
    try {
      const { id: owner } = await Auth.currentAuthenticatedUser();
      const data = await API.graphql(
        graphqlOperation(todosByData, { limit: 3, nextToken, owner })
      );
      setTodo([...todo, ...data.data.todosByData.items]);
      setNextToken(data.data.todosByData.nextToken);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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
      <button onClick={fetchContacts}>Fetch tasks</button>
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
