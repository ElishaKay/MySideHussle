import React from 'react';
import Modal from './Modal'
import ImageHead from './ImageHead'
import ImageContent from './ImageContent'

export default item => (
  <div key={item.id} className='grid__item my-md-5' >
  <div className="container">
    <h5 className="book-title">{item.title}</h5>
  </div>
    <Modal
      maxwidth={700}
      maxheight={500}
      ms={500}
    >
      <Modal.Head>
        <ImageHead {...item}/>
      </Modal.Head>
      <Modal.Content>
        <ImageContent {...item}/>
      </Modal.Content>
    </Modal>
  </div>
)