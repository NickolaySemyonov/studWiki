import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
//import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";

// Editor is an uncontrolled React component

const Editor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    //const onTextChangeRef = useRef(onTextChange);
    //const onSelectionChangeRef = useRef(onSelectionChange);

    const editableToolbar = [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      ["image"],
    ];

    // useLayoutEffect(() => {
    //   onTextChangeRef.current = onTextChange;
    //   onSelectionChangeRef.current = onSelectionChange;
    // });

    //
    useEffect(() => {
      console.log("<Editor> has been mounted");
    }, []);

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      const quill = new Quill(editorContainer, {
        modules: {
          toolbar: readOnly ? false : editableToolbar,
        },
        theme: "snow",
      });

      ref.current = quill;
      quill.enable(!readOnly);

      // if (defaultValueRef.current) {
      //   quill.setContents(defaultValueRef.current);
      // }

      // quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      //   onTextChangeRef.current?.(...args);
      // });

      // quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
      //   onSelectionChangeRef.current?.(...args);
      // });

      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref, readOnly]);

    return <div ref={containerRef}></div>;
  }
);

Editor.displayName = "Editor";

export default Editor;
