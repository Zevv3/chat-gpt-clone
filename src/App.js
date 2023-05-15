import { useState, useEffect } from 'react'

const App = () => {
  const [ value, setValue ] = useState(null)
  const [ message, setMessage ] = useState(null)
  const [ previousChats, setPreviousChats ] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)

  const createNewChat = () => {
    // clearing chat logs to start fresh
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      console.log(data)
      if (data.choices && data.choices.length > 0) {
        setMessage(data.choices[0].message)
      } else {
        console.error("No messages found in response:", data)
      }
    } catch (error) {
      console.error(error)
    }
  }
  

  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        // when we create a new chat, we are...
        [...prevChats, 
          {
            // setting the title to save all the chats by the first prompt
            title: currentTitle,
            // assigning the role as us the user
            role: "user",
            // saving what we asked the ai
            content: value
          },
          {
            // and saving the response from the ai
            title: currentTitle,
            role: message.role,
            content: message.content
          }]
      ))
    }
  }, [message, currentTitle])

  console.log(previousChats);

  // displaying the chats on the page
  const currentChat = previousChats.filter(previousChat => previousChat.title == currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  console.log(uniqueTitles)

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className='history'>
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by zelly</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>zellyGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">
            Chat GPT Mar 14 Version. Free Research Preview.
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
