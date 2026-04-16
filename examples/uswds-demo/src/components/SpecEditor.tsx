import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

interface SpecEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SpecEditor({ value, onChange }: SpecEditorProps) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={[json()]}
      height="100%"
      className="h-full text-sm"
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        bracketMatching: true,
        foldGutter: true,
      }}
    />
  );
}
