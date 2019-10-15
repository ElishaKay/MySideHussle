import React, { Component } from 'react';

class FileUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      file: ''
    }

    this.loadFiles = this.loadFiles.bind(this);
  }

  componentDidMount() {
    this.loadFiles();
  }

  loadFiles() {
    fetch('/api/files')
      .then(res => res.json())
      .then(files => {
        if (files.message) {
          console.log('No Files');
          this.setState({ files: [] })
        } else {
          this.setState({ files })
        }
      });
  }

  fileChanged(event) {
    const f = event.target.files[0];
    this.setState({
      file: f
    });
  }

  deleteFile(event) {
    event.preventDefault();
    const id = event.target.id;

    fetch('/api/files/'+id, {
      method: 'DELETE'
    }).then(res => res.json())
      .then(response => {
        console.log(response);
        if (response.success) this.loadFiles()
        else alert('Delete Failed');
      })
  }

  uploadFile(event) {
    event.preventDefault();
    let data = new FormData();
    data.append('file', this.state.file);

    fetch('/api/files', {
      method: 'POST',
      body: data
    }).then(res => res.json())
      .then(data => {
        if (data.success) {
          this.loadFiles();
        } else {
          alert('Upload failed');
        }
      });
  }

  render() {
    const { files } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-content">
          <input type="file" onChange={this.fileChanged.bind(this)}/>
          <button onClick={this.uploadFile.bind(this)}>Upload</button>
          <table className="App-table">
            <thead>
              <tr>
                  <th>File</th>
                  <th>Uploaded</th>
                  <th>Size</th>
                  <th></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => {
                console.log('loaded this div');
                console.log('file: ',file);
                var d = new Date(file.uploadDate);
                return (
                  <tr key={index}>
                    <td><a href={`http://localhost:5000/api/files/${file.filename}`}>
                    <img src={`http://localhost:5000/api/files/${file.filename}`}/></a></td>
                    <td>{`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`}</td>
                    <td>{(Math.round(file.length/100) / 10)+'KB'}</td>
                    <td><button onClick={this.deleteFile.bind(this)} id={file._id}>Remove</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default FileUpload;
