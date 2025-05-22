import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useModuleContext } from "../Context/ModuleContext";

const EditModules = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const moduleName = query.get("name");
  const { modules, setModules } = useModuleContext();

  const module = modules.find((mod) => mod.moduleName === moduleName);

  const [newRow, setNewRow] = useState(
    module.fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {})
  );

  const [editingRow, setEditingRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const addRow = () => {
    if (!isEditing) {
      const newModule = {
        ...module,
        fields: module.fields.map((field) => ({
          ...field,
          value: [...field.value, newRow[field.name]],
        })),
      };
      setModules(
        modules.map((mod) => (mod.moduleName === moduleName ? newModule : mod))
      );
      setNewRow(
        module.fields.reduce((acc, field) => {
          acc[field.name] = "";
          return acc;
        }, {})
      );
      console.log("Added row:", newRow);
    } else {
      saveRow(editingRow);
    }
  };

  const deleteRow = (rowIndex) => {
    const newModule = {
      ...module,
      fields: module.fields.map((field) => ({
        ...field,
        value: field.value.filter((_, index) => index !== rowIndex),
      })),
    };
    setModules(
      modules.map((mod) => (mod.moduleName === moduleName ? newModule : mod))
    );
    console.log("Deleted row:", rowIndex);
  };

  const editRow = (rowIndex) => {
    setIsEditing(true);
    setEditingRow(rowIndex);
  };

  const saveRow = (rowIndex) => {
    setIsEditing(false);
    const newModule = {
      ...module,
      fields: module.fields.map((field) => ({
        ...field,
        value: field.value.map((val, index) =>
          index === rowIndex ? newRow[field.name] : val
        ),
      })),
    };
    setModules(
      modules.map((mod) => (mod.moduleName === moduleName ? newModule : mod))
    );
    setNewRow(
      module.fields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {})
    );
    setEditingRow(null);
    console.log("Edited row:", rowIndex);
  };

  return (
    <div className="d-flex flex-grow-1 flex-column">
      <div className="header">Edit Modules</div>
      <div>
        <span onClick={addRow}>
          <i className="fa fa-plus"></i> Add Row
        </span>
      </div>
      {module && (
        <table className="table">
          <thead>
            <tr>
              {module.fields.map((field) => (
                <th key={field.name}>{field.name}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {module.fields[0].value.map((_, rowIndex) => (
              <tr key={rowIndex}>
                {editingRow === rowIndex
                  ? module.fields.map((field) => (
                      <td key={field.name}>
                        <input
                          type="text"
                          value={newRow[field.name]}
                          onChange={(e) =>
                            setNewRow({
                              ...newRow,
                              [field.name]: e.target.value,
                            })
                          }
                        />
                      </td>
                    ))
                  : module.fields.map((field) => (
                      <td key={field.name}>{field.value[rowIndex]}</td>
                    ))}
                <td>
                  {editingRow === rowIndex ? (
                    <>
                      <i
                        className="fa fa-check"
                        onClick={() => saveRow(rowIndex)}
                      ></i>
                      <i
                        className="fa fa-times"
                        onClick={() => setEditingRow(null)}
                      ></i>
                    </>
                  ) : (
                    <i
                      className="fa fa-pencil"
                      onClick={() => editRow(rowIndex)}
                    ></i>
                  )}
                  <i
                    className="fa fa-trash"
                    onClick={() => deleteRow(rowIndex)}
                  ></i>
                </td>
              </tr>
            ))}
            <tr>
              {module.fields.map((field) => (
                <td key={field.name}>
                  <input
                    type="text"
                    value={newRow[field.name]}
                    onChange={(e) =>
                      setNewRow({ ...newRow, [field.name]: e.target.value })
                    }
                  />
                </td>
              ))}
              <td>
                <i className="fa fa-check" onClick={addRow}></i>
                <i
                  className="fa fa-times"
                  onClick={() =>
                    setNewRow(
                      module.fields.reduce((acc, field) => {
                        acc[field.name] = "";
                        return acc;
                      }, {})
                    )
                  }
                ></i>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EditModules;
