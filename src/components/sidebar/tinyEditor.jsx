// import React, { useRef, useState } from 'react';
// import { Editor } from '@tinymce/tinymce-react';
// import { Editor } from '../../Assets/tiny/tinymce';
// import axios from 'axios';
// import './App.css';

import { useEffect } from "react";

export default function EditorComponent(props) {
  const handleEditorChange = (e) => {
    // props.setBodyData(content)
  };

  useEffect(() => {
    let tinymce = window.tinymce;
    tinymce.remove();
    tinymce.init({
      initialValue: "<p>dsfdsfs<p>",
      setup: function (editor) {
        editor.on("init", function (e) {
          editor.setContent(props.containerValue);
        });
        editor.on("input NodeChange", function (e) {
          props.updateContainerValue(editor.getContent());
        });
      },
      plugins: "autoresize",
      autoresize_min_height: 100,
      autoresize_max_height: 1000,
      autoresize_bottom_margin: 0,
      onchange_callback: "tinyChangeHandler",
      selector: "#mytextarea",
      base_url: "/tiny/",
      // height: 440,
      // maxHeight: 350,
      // overflow: "auto",
      border: "0px",
      paste_data_images: true,
      menubar: false,
      convert_urls: true,
      plugins:
        " print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists imagetools textpattern noneditable help charmap quickbars emoticons",
      toolbar: "",
      content_style: "body { font-size:14px;height:100vh;}p{margin: 0px 0px; }",
    });
    // tinymce.execCommand('mceInsertRawHTML', false, data);
  }, []);

  return (
    <>
      {/* <Editor
          initialValue="<p></p>"
          init={{
            base_url: '/tiny/',
            height: 300,
            border: "0px",
            menubar: false,
            selector: 'textarea#full-featured-non-premium',
            plugins: ' print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists imagetools textpattern noneditable help charmap quickbars emoticons',
            imagetools_cors_hosts: ['picsum.photos'],
            // menubar: 'file edit view insert format tools table help',
            toolbar: '',
            toolbar_sticky: false,
            // external_plugins: {"ruler": "http://localhost:3000/tiny/plugins/newRuler/plugins.js"},
            // nanospell_server: "php",
            toggleState: false,
            browser_spellcheck: false,
            nanospell_autostart: false,
            contextmenu_never_use_native :false,
            nonbreaking_force_tab: false,
            autosave_ask_before_unload: false,
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_restore_when_empty: false,
            autosave_retention: '2m',
            image_advtab: false
          }}
          onEditorChange={handleEditorChange}
        /> */}
      <textarea
        id="mytextarea"
        onpaste="handleEditorChange()"
        style={{ height: "300px", width: "100%" }}
      ></textarea>
    </>
  );
}
