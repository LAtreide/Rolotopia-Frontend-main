
import React from 'react';

import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import "../../css/EditorTexto.css"



const editorConfiguration = {
  removePlugins: ['Markdown', 'Title'],

  image: {
    resizeUnit: "px"
  },

  mediaEmbed: {
    previewsInData: "True",
    removeProviders: ['youtube', 'instagram'],
    extraProviders: [
      {
        name: "Pyoutube",
        url: /^youtu\.be\/([\w-]+)(?:\?t=(\d+))?/,
        html: t => {
          const e = t[1];
          const n = t[2];
          return (
            '<div style="position: relative;">' +
            `<iframe src="https://www.youtube.com/embed/${e}${n ? `?start=${n}` : ""}" ` +
            'style="width: 100%; height: 50px; top: 0; left: 0;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
            "</iframe>" +
            "</div>"
          )
        }

      },

      {

        name: "Gyoutube",
        url: [/^(?:m\.)?youtube\.com\/watch\?v=([\w-]+)(?:&t=(\d+))?/, /^(?:m\.)?youtube\.com\/v\/([\w-]+)(?:\?t=(\d+))?/, /^youtube\.com\/embed\/([\w-]+)(?:\?start=(\d+))?/, /^youtu\.be\/([\w-]+)(?:\?t=(\d+))?/],
        html: t => {
          const e = t[1]; const n = t[2];
          return (
            '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
            `<iframe src="https://www.youtube.com/embed/${e}${n ? `?start=${n}` : ""}" ` +
            'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
            'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
            "</iframe>" +
            "</div>")
        }
      },
      

{

      name:"instagram2",
      url:/^instagram\.com\/p\/([\w-]+)(?:)?/,
      html: t => {
        const e = t[1]
        return (
          `<iframe src="https://www.instagram.com/p/${e}/embed" width="400" height="480" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`
          
)
      }
}
    ]
  }


};

export default class EditorTextoCompleto extends React.Component {

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
      <div className='"editorBase'>

        
        <CKEditor

          editor={Editor}
          config={editorConfiguration}
          data={this.props.texto}

          onReady={editor => {
        
          }}
          onChange={(event, editor) => { this.handleChange(event, editor); }}
          onBlur={(event, editor) => {

          }}
          onFocus={(event, editor) => {

          }}


        />


      </div>
    )
  }
}