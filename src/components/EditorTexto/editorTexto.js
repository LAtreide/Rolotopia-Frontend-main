import React from 'react';

import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import "../../css/EditorTexto.css"


export default class EditorTexto extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      texto: this.props.texto,
      

    };
  }


  handleChange = (e, editor) => {
    this.setState({ texto: editor.getData() });
    this.props.onCambio(editor.getData());
  }


  render() {
    return (
            <div className='editorBase'>

              <CKEditor

                editor={Editor}
                config={this.props.config}
                data={this.state.texto}
                onReady={editor => {}}
                onChange={this.handleChange}
                onBlur={(event, editor) => {

                }}
                onFocus={(event, editor) => {

                }}
              />
      </div>
    )
  }
}

