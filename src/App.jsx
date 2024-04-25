import React, { useEffect, useState } from 'react';
import './App.css'
import BlankInput from './Components/BlankInput';
import './Firebase Setup/Firebase'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';
import { db } from './Firebase Setup/Firebase';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [listItem, setListItem] = useState([]);
  const [inputItem, setInputItem] = useState('');
  const [checkedItemCount, setCheckedItemCount] = useState(0);
  const [error, setError] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
      const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListItem(todos);
  
      // Calculate the total number of checked items
      const totalCheckedItems = todos.reduce((total, todo) => {
        return total + (todo.completed ? 1 : 0);
      }, 0);
      setCheckedItemCount(totalCheckedItems);
    });
  
    return () => unsubscribe();
  }, []);

  const inputChange = (e) => {
    setInputItem(e.target.value);
    setError('');
  };

  const todoSubmit = (e) => {
    e.preventDefault();
    if (inputItem.trim() === '') {
      setError('Please enter some value'); 
      return;
    }
    addDoc(collection(db, 'todos'), {
      todo: inputItem,
    }).then(() => {
      setInputItem('');
    }).catch(error => {
      console.error('Error adding document: ', error);
    });
  
    
    setListItem(prevListItems => [...prevListItems].reverse());
  }

  const deleteItem = async (docId) => {
    const docRef = doc(db, 'todos', docId);
    await deleteDoc(docRef);
  };

  const deleteAll = async () => {
    try {
      const todosRef = collection(db, 'todos');
      const snapshot = await getDocs(todosRef);
    
      snapshot.forEach(async (doc) => {
        try {
          await deleteDoc(doc.ref);
        } catch (error) {
          console.error(`Error deleting document with ID ${doc.id}:`, error);
        }
      });
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const toggleComplete = async (index) => {
    const updatedItems = [...listItem];
    updatedItems[index].completed = !updatedItems[index].completed;
  
    const checkedCount = updatedItems.filter(item => item.completed).length;
    console.log("Checked Count:", checkedCount); // Log the checked count
    setCheckedItemCount(checkedCount);

  
    const docRef = doc(db, 'todos', updatedItems[index].id);

    await updateDoc(docRef, {
      completed: updatedItems[index].completed,
      checkedCount: checkedCount, 
    });
  };


  const editItem = async (index) => {
    setEditingIndex(index);
    setEditText(listItem[index].todo);
  };

  const saveEdit = async () => {
    if (editText.trim() === '') {
      setError('Please enter some value'); 
      return;
    }
    const updatedItems = [...listItem];
    updatedItems[editingIndex].todo = editText;
    setListItem(updatedItems);
    setEditingIndex(null);

    const docRef = doc(db, 'todos', updatedItems[editingIndex].id);
    await updateDoc(docRef, {
      todo: editText,
    });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
    setError('');
  };

  const itemsLength = listItem.length;

  return (
    <>
      <body>
        <div className="container">
          <h1>To-Do List</h1>
          <div className="details row mt-4 d-flex align-center">
            <div className="col-6 tile1">
              <h6>Total Tasks :</h6>
              <h2>{itemsLength}</h2>
            </div>
            <div className="col-6 tile2">
              <h6>Total Completed Tasks :</h6>
              <h2>{checkedItemCount}</h2>
            </div>
          </div>
          <form onSubmit={todoSubmit}>
            <div>
              <input placeholder='Enter your task' type="text" value={inputItem} onChange={inputChange} />
              {error && <p className="error" style={{color:"red"}}>{error}</p>}

            </div>
            <button type="submit">Add</button>
            <button className='deleteAllBtn' type="button" onClick={deleteAll}>Delete All</button>
          </form>
          <ul>
            <div className="listItems">
              {listItem.map((item, index) => (
                <li className='listItem' key={index}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleComplete(index)}
                  />
                  <div className='textSpace'>
              {editingIndex === index ? (
                <input 
                  className="form-control" 
                  type="text" 
                  value={editText} 
                  onChange={(e) => setEditText(e.target.value)} 
                />
              ) : (
                <div className='text-overflow'>{item.completed ? <s>{item.todo}</s> : item.todo}</div>
              )}
            </div>
                  {editingIndex === index ? (
              <div>
                <button className="editBtn" onClick={saveEdit}>Save</button>
                <button className="deleteBtn ml-2" onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <button className="editBtn" onClick={() => editItem(index)}>Edit</button>
                <button className="deleteBtn ml-2" onClick={() => deleteItem(item.id)}>Delete</button>
              </div>
            )}
                </li>
              ))}
            </div>
          </ul>
        </div>
      </body>
    </>
  );
}

export default App;
