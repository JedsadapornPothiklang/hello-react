import { useState } from "react";
function TaskInput({ onAddTask }) {
const [inputText, setInputText] = useState("");
function handleSubmit(e) {
e.preventDefault();
const trimmed = inputText.trim();
if (trimmed !== "") { onAddTask(trimmed); setInputText(""); }
}
return (
<form onSubmit={handleSubmit} className="task-form">
<input type="text" value={inputText}
onChange={(e) => setInputText(e.target.value)} placeholder="What needs to be done?" className="task-input"/>
<button type="submit" className="add-btn">Add Task</button>
</form>
);
}
export default TaskInput;