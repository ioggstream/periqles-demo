import React from "react";
import {useTable, useResizeColumns, useFlexLayout, useRowSelect} from "react-table";

export default function TableComponent({data}) {
  const columns = Object.keys(data[0]).filter((e) => !e.startsWith("__")).map((e) => ({Header: e, accessor: e, sortable: true}));
  console.log("columns", columns);
  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow // Prepare the row (this function needs to be called for each row before getting the row props)
  } = useTable({
    columns,
    data
  }, useResizeColumns, useFlexLayout, useRowSelect);

  /*
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
  */

  return (<div>
    <h2>{data[0].__typename}</h2>
    <table {...getTableProps()}>
      <thead>
        {
          headerGroups.map((headerGroup) => (<tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (<th {...column.getHeaderProps()}>{column.render("Header")}</th>))}
          </tr>))
        }
      </thead>
      <tbody {...getTableBodyProps()}>
        {
          rows.map((row, i) => {
            // console.log("row:", row);
            prepareRow(row);
            // console.log("prepared_row", row);
            return (<tr {...row.getRowProps()}>
              {
                row.cells.map((cell) => {
                  return Array.isArray(cell.value)
                    ? (<TableComponent data={cell.value}/>)
                    : (<td {...cell.getCellProps()}>{cell.render("Cell")}</td>);
                })
              }
            </tr>);
          })
        }
      </tbody>
    </table>
  </div>);
}
