import React, { useEffect, useState } from 'react'
import './App.css'
import { Amplify, API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { withAuthenticator, Button, Heading, Flex } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: '',city: '', description: '' }

const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.city || !formState.description ) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  return (
    <div style={styles.container}>
      <div className='person_user'>
      <Heading  level={1}>Hello <span className='Upp'>{user.username}</span></Heading>
      <Button className='sign-out' onClick={signOut} style={styles.button}>Sign out</Button>
      </div>
      
      <h2>Restaurant add</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={event => setInput('city', event.target.value)}
        style={styles.input}
        value={formState.city}
        placeholder="City"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button className='btn-submit' onClick={addTodo}>Create Restaurant</button>
      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            {/* <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoCity}>{todo.city}</p>
            <p style={styles.todoDescription}>{todo.description}</p> */}
            <div>
            <table style={styles.table}>
                <tr>
                  <th style={styles.table_th}>Name</th>
                  <th style={styles.table_th}>City</th>
                  <th style={styles.table_th}>Description</th>
                </tr>
                <tr>
                  <td style={styles.table_th}>{todo.name}</td>
                  <td style={styles.table_th}>{todo.city}</td>
                  <td style={styles.table_th}>{todo.description}</td>
                </tr>
            </table>
            </div>
            
          </div>
        ))
      }
    </div>
    
  )
}

const styles = {
  container: { width: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15, },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '5px 0px', width:'100px' },
  table_th: {border: '1px solid',  fontSize: 18, textAlign: "center", width:'150px',color: '#e6eaf0',},

}

export default withAuthenticator(App);