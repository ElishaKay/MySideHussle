import React from 'react'


export default ({ children, length }) => (
  <React.Fragment>
    <div className="title">
      <h1>ReactJS Book Library</h1>
    </div>
    
    {children}
    <div className="credits">Created with <span className="love"></span> by <a href="https://github.com/ElishaKay?tab=repositories">Elisha Kramer</a></div>
  </React.Fragment>
)