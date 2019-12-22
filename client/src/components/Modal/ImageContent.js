import _ from "lodash";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { saveBook, deleteBook  } from "../../actions";
import bookFormFields from '../../helpers/bookFormFields'
import renderDatePicker from '../../helpers/renderDatePicker'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

class ImageContent extends Component {
  componentWillMount () {
    let {initialize, title, content, author, published, id } = this.props;
    initialize({ title, content, author, published, id});
  }

  renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <label className="text-primary">{field.label}</label>
        <input className="form-control" type="text" {...field.input} />
        <div className="error-text">
          {touched ? error : ""}
        </div>
      </div>
    );
  }

  onSubmit = async values => {
    let {checkTitle, saveBook, id, img, modal: { close }} = this.props;
    try {
      let res = await checkTitle(values);
      if (res.exists) {
          confirmAlert({
                    title: 'Title already exists',
                    message: 'Please choose a different title.',
                    buttons: [
                      {
                        label: 'Ok',
                      }
                    ]
          })
      } else {
          saveBook({...values, id, img})
          return close()
      }
    } catch(e) {
        console.log(e)
    }
  } 

  onDeleteClick() {
    let {deleteBook, id, modal: { close }} = this.props;
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this book?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => 
             deleteBook(id, () => 
                close()
            )
        },
        {
          label: 'No'
        }
      ]
    })
  }

  render() {
    const { handleSubmit, newBook } = this.props;

    return (
    <div className="container book-form" >
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
      
      <Field
          label="Title For Book"
          name="title"
          component={this.renderField}
        />
        <Field
          label="Author"
          name="author"
          component={this.renderField}
        />
        <Field
          label="Summary"
          name="content"
          component={this.renderField}
        />
         <label className="text-primary">Published</label>
        <Field
          label="Published"
          name="published"
          component={renderDatePicker}
          format={(value, name) => value === '' ? null : value}
        />

        <button type="submit" className="btn btn-primary mt-md-3">Save</button>      
      </form>
      {!newBook ? <button className="btn btn-danger float-right delete-book"
          onClick={this.onDeleteClick.bind(this)}
        >Delete</button> : ""}
    </div>
    );
  }
}

function validate(values) {
  const errors = {};

  _.each(bookFormFields, (type, field) => {
      if(!values[field]){
        if(field==='title'){
          errors[field] = 'Please include a Title'
        } else if(field==='author') {
          errors[field] = 'Who wrote it?'
        } else if(field==='published') {
          errors[field] = 'When was it Published?'
        } else {
          errors[field] = 'Please include a Short Summary/Teaser'
        }
      }
  })

  return errors;
}

export default reduxForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  form: "BooksNewForm",
  fields: _.keys(bookFormFields)
})(connect(null, { saveBook,deleteBook })(ImageContent));
