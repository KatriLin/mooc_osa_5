/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({title:"",author:"", url:""})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
      
    }
  
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage({
          category: 'successful',
          message:`a new blog ${returnedBlog.title} by ${returnedBlog.author} was added.`
      })
      setTimeout(() => {
        setMessage(null)
      }, 3000)
        setNewBlog({ title: '', author: '', url: '' })
      }).catch((error) => {
     
        setMessage({
          category: 'error',
          message: `${error.response.data.error}`
      })
      setTimeout(() => {
        setMessage(null)
      }, 3000)
      });
  }
  const handleBlogChange = (event) => {
    setNewBlog({...newBlog,
    [event.target.name]: event.target.value})
  }
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('loggging in with', username, password)
  
  try {
    const user = await loginService.login({
      username, password,
    })
    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    ) 
    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
  }
  catch(error) {
    console.log('invalid credentials',error)
    setMessage({
      category: 'error',
      message:' wrong username or password'
  })
    setTimeout(() => {
      setMessage(null)

    }, 5000)
  }
} 

const loginForm = () => (
  

<form onSubmit={handleLogin}>
<h2>Login to the application</h2>
  <div>
  username
    <input
    type="text"
    value={username}
    name="Username"
    onChange= {({target}) => setUsername(target.value)}
    />
  </div>
  <div>
    password
    <input
    type="password"
    value={password}
    name="Password"
    onChange={({target}) => setPassword(target.value)}
    />
  </div>
  <button type="submit">Login</button>
</form>
)
const handleLogout = (event) => {
event.preventDefault()
window.localStorage.clear()
setMessage({
  category: 'successful',
  message:'logout successful'
})
setTimeout(() => {
setMessage(null)
}, 3000)
setUser(null)
}
const blogForm = () => (
  <form onSubmit={addBlog}>
    <div>
    <label>Title:
    <input 
    type="text" 
    name="title"
    onChange={handleBlogChange}
     
    />
    </label>
    </div>
    <div>
    <label>Author:
    <input 
    type="text" 
    name="author"
    onChange={handleBlogChange}
     
    />
    </label>
    </div>
    <div>
    <label>Url:
    <input 
    type="text" 
    name="url"
    onChange={handleBlogChange}
     
    />
    </label>
    </div>
    <button type="submit">Create</button>
  </form>  
)
  return (
    <div>
      {message && <Notification message={message} /> }
     {!user && loginForm()}
      {user && <div>
       <p>{user.name} logged in</p>
       <p><button onClick={handleLogout} type="submit">Logout</button></p>
       <h2>Create new blog</h2>
         {blogForm()}
         <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>}
      
      
    </div>
  )
}

export default App