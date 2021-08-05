import React, { useState } from "react";
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useRowSelect,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useAsyncDebounce
} from "react-table";
import "core-js/stable";
import "regenerator-runtime/runtime";

export default function TableComponent({data}) {
  data = React.useMemo(
    () => data, []
  );
  console.log("data", data);
  const columns = React.useMemo( 
    () => Object.keys(data[0]).filter((e) => !e.startsWith("__")).map((e) => ({Header: e, accessor: e, sortable: true})),
    []
  );
  console.log("columns", columns);

  function GlobalFilter({preGlobalFilteredRows, globalFilter, setGlobalFilter}) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
      setGlobalFilter(value || undefined);
    }, 200);

    return (<span>
      Search:{" "}
      <input value={value || ""} onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }} placeholder={`${count} records...`} style={{
          fontSize: "1.1rem",
          border: "0"
        }}/>
    </span>);
  }

  function DefaultColumnFilter({
    column: {
      filterValue,
      preFilteredRows,
      setFilter
    }
  }) {
    const count = preFilteredRows.length;

    return (<input value={filterValue || ""} onChange={e => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }} placeholder={`Search ${count} records...`}/>);
  }

  const defaultColumn = React.useMemo(() => ({
    // Let's set up our default Filter UI
    Filter: DefaultColumnFilter
  }), []);

  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    visibleColumns,
    state,
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable({
    columns, data, defaultColumn // Be sure to pass the defaultColumn option
  }, useSortBy, useFilters, // useFilters!
      useGlobalFilter // useGlobalFilter!
  );

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
            {
              headerGroup.headers.map((column) => (
              // Add the sorting props to control sorting. For this example
              // we can add them into the header props
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span>
                  {
                    column.isSorted
                      ? (
                        column.isSortedDesc
                        ? "<"
                        : ">")
                      : "="
                  }
                </span>
              </th>))
            }
          </tr>))
        }
        <tr>
          <th colSpan={visibleColumns.length} style={{
              textAlign: "left"
            }}>
            <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter}/>
          </th>
        </tr>
      </thead>
      <tbody {...getTableBodyProps()}>
        {
          rows.map((row, i) => {
            console.log("row:", row);
            prepareRow(row);
            console.log("prepared_row", row);
            try {
              return (<tr {...row.getRowProps()}>
                {
                  row.cells.map((cell) => {
                    return Array.isArray(cell.value)
                      ? (<td {...cell.getCellProps()}>
                        {JSON.stringify(cell.value)}
                      </td>)
                      : (<td {...cell.getCellProps()}>{cell.render("Cell")}</td>);
                  })
                }
              </tr>);
            } catch (e) {
              console.log(e);
            }
          })
        }
      </tbody>
    </table>
  </div>);
}
