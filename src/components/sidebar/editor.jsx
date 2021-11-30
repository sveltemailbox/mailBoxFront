import { useState } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TOOL_BAR_OPTION = {
  options: [
    "inline",
    "blockType",
    "fontSize",
    "list",
    "textAlign",
    "emoji",
    "image",
    "history",
  ],
};

function EditorComponent() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState) => {
    const data = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setEditorState(editorState);
  };
  return (
    <>
      <Editor
        name="editor"
        placeholder="Enter the content"
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={TOOL_BAR_OPTION}
      />
    </>
  );
}
export default EditorComponent;
