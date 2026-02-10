// import { useState } from "react";

// /**
//  * Props:
//  * - items: string[]                (list state from parent)
//  * - setItems: (next: string[]) => void   (setter from parent)
//  * - placeholder?: string
//  * - buttonText?: string
//  */
// export default function EditableFeatureList({
//   items,
//   setItems,
//   placeholder = "Enter feature...",
//   buttonText = "Add",
// }) {
//   const [inputValue, setInputValue] = useState("");
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editingValue, setEditingValue] = useState("");

//   const addItem = () => {
//     const value = inputValue.trim();
//     if (!value) return;

//     setItems([...items, value]);
//     setInputValue("");
//   };

//   const removeItem = (index) => {
//     setItems(items.filter((_, i) => i !== index));
//     // if removing the item being edited, reset edit mode
//     if (editingIndex === index) {
//       setEditingIndex(null);
//       setEditingValue("");
//     }
//   };

//   const startEdit = (index) => {
//     setEditingIndex(index);
//     setEditingValue(items[index]);
//   };

//   const cancelEdit = () => {
//     setEditingIndex(null);
//     setEditingValue("");
//   };

//   const saveEdit = () => {
//     const value = editingValue.trim();
//     if (!value) return;

//     const next = items.map((item, i) => (i === editingIndex ? value : item));
//     setItems(next);
//     setEditingIndex(null);
//     setEditingValue("");
//   };

//   const handleInputKeyDown = (e) => {
//     if (e.key === "Enter") addItem();
//   };

//   const handleEditKeyDown = (e) => {
//     if (e.key === "Enter") saveEdit();
//     if (e.key === "Escape") cancelEdit();
//   };

//   return (
//     <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
//       {/* Add section */}
//       <div style={{ display: "flex", gap: 8 }}>
//         <input
//           value={inputValue}
//           placeholder={placeholder}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyDown={handleInputKeyDown}
//           style={{ flex: 1, padding: 8 }}
//         />
//         <button onClick={addItem} style={{ padding: "8px 12px" }}>
//           {buttonText}
//         </button>
//       </div>

//       {/* List section */}
//       <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
//         {items.map((item, index) => (
//           <li key={index} style={{ display: "flex", gap: 8, alignItems: "center" }}>
//             {editingIndex === index ? (
//               <>
//                 <input
//                   value={editingValue}
//                   onChange={(e) => setEditingValue(e.target.value)}
//                   onKeyDown={handleEditKeyDown}
//                   style={{ flex: 1, padding: 6 }}
//                   autoFocus
//                 />
//                 <button onClick={saveEdit} style={{ padding: "6px 10px" }}>
//                   Save
//                 </button>
//                 <button onClick={cancelEdit} style={{ padding: "6px 10px" }}>
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <>
//                 <span style={{ flex: 1 }}>{item}</span>
//                 <button onClick={() => startEdit(index)} style={{ padding: "6px 10px" }}>
//                   Edit
//                 </button>
//                 <button onClick={() => removeItem(index)} style={{ padding: "6px 10px" }}>
//                   Remove
//                 </button>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }




import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Shadcn UI version
 *
 * Props:
 * - items: string[]                         (list state from parent)
 * - setItems: (next: string[]) => void      (setter from parent)
 * - placeholder?: string
 * - buttonText?: string
 */
export default function EditableFeatureList({
  items,
  setItems,
  placeholder = "Enter feature...",
  buttonText = "Add",
}) {
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const addItem = () => {
    const value = inputValue.trim();
    if (!value) return;

    setItems([...items, value]);
    setInputValue("");
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditingValue(items[index] ?? "");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const saveEdit = () => {
    const value = editingValue.trim();
    if (!value || editingIndex === null) return;

    const next = items.map((item, i) => (i === editingIndex ? value : item));
    setItems(next);
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") addItem();
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <div className="grid gap-3">
      {/* Add section */}
      <div className="flex gap-2 w-fit">
        <Input
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <Button onClick={addItem}>{buttonText}</Button>
      </div>

      {/* List section */}
      <ul className="gap-2 w-fit flex flex-wrap">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-2 rounded-md border p-2"
          >
            {editingIndex === index ? (
              <>
                <Input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  autoFocus
                />
                <Button onClick={saveEdit} size="sm">
                  Save
                </Button>
                <Button onClick={cancelEdit} size="sm" variant="secondary">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">{item}</span>
                <Button onClick={() => startEdit(index)} size="sm" variant="outline">
                  Edit
                </Button>
                <Button onClick={() => removeItem(index)} size="sm" variant="destructive">
                  Remove
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
