import React, { useEffect, useState } from 'react';
import './App.css'
import BlankInput from './Components/BlankInput';
import './Firebase Setup/Firebase'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';
import { db } from './Firebase Setup/Firebase';

function App() {
  const [listItem, setListItem] = useState([]);
  const [inputItem, setInputItem] = useState('');
  const [checkedItemCount, setCheckedItemCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
      setListItem(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    });

    return () => unsubscribe();
  }, []);

  const inputChange = (e) => {
    setInputItem(e.target.value);
  };

  const todoSubmit = (e) => {
    e.preventDefault();
    if (inputItem.trim() === '') {
      return;
    }
    addDoc(collection(db, 'todos'), {
      todo: inputItem,
      completed: false,
    }).then(() => {
      setInputItem('');
    }).catch(error => {
      console.error('Error adding document: ', error);
    });
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
    setListItem(updatedItems);
    setCheckedItemCount(updatedItems.filter(item => item.completed).length);

    const docRef = doc(db, 'todos', updatedItems[index].id);
    await updateDoc(docRef, {
      completed: updatedItems[index].completed,
    });
  };

  const editItem = async (index, newText) => {
    const updatedItems = [...listItem];
    updatedItems[index].todo = newText;
    setListItem(updatedItems);

    const docRef = doc(db, 'todos', updatedItems[index].id);
    await updateDoc(docRef, {
      todo: newText,
    });
  };

  const itemsLength = listItem.length;

  return (
    <>
      <body>
        <div className="container">
          <h1>To-Do List</h1>
          <div className="details">
            <div className="tile1">
              <h3>Total Tasks :</h3>
              <p>{itemsLength}</p>
            </div>
            <div className="tile2">
              <h3>Total Tasks :</h3>
              <p>{checkedItemCount}</p>
            </div>
          </div>
          <form onSubmit={todoSubmit}>
            <div>
              <input placeholder='Enter your task' type="text" value={inputItem} onChange={inputChange} />
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
                    {item.completed ? (
                      <p className='text-overflow'><s>{item.todo}</s></p>
                    ) : (
                      <p className='text-overflow'>{item.todo}</p>
                    )}
                  </div>
                  <button className='deleteBtn' onClick={() => deleteItem(item.id)}>Delete</button>
                  <button
                    className='editBtn'
                    onClick={() => {
                      const newText = prompt('Edit the item:', item.todo);
                      if (newText !== null) {
                        editItem(index, newText);
                      }
                    }}
                  >
                    Edit
                  </button>
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
