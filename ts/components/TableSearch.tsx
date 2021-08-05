import React from "react";
import styled from "styled-components";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce
} from "react-table";
// A great library for fuzzy filtering/sorting items

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0"
        }}
      />
    </span>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}


const get_renderer = (obj) => {
    const gql_render = {
        Implementation: JSON.stringify
    };

    try{
        return gql_render[obj[0]["__typename"]];
    } catch{
        return (i) => i;
    };
};
const strip__fields = (e) => {
    Object.keys(e).map(k => k.startsWith("__") && delete e[k]) 
};

const flatten = (data) => {
    data.map((e) => {
        Object.keys(e).map((k) => {
            if (Array.isArray(e[k])) {
                console.log("subfield", e[k]);
                const renderer = get_renderer(e[k])
                e[k].map((i) => strip__fields(i))
                e[k] = renderer(e[k]);
            }
        })
    });
    return data;
};
//
const getColumns = (data, parent="") => {
    console.log("getColumns", data);
    return Object.keys(data[0]).filter((e) => !e.startsWith("__")).map(
        (e) => {
                parent = parent ? parent + "." : "";
                var h = { Header: e, sortable: true };
                h["accessor"] = parent + e; 
                try {
                    const subcell = data[0][e];
                    if (subcell[0].hasOwnProperty('__typename')) {
                        h["columns"] = getColumns(subcell, e);
                        delete h["accessor"];
                    }
                } catch (e) {
                    console.debug(e);
                }
                return h;
            }
        )
};
// Our table component
export default function TableSearch({ data }) {
  data = React.useMemo(
    () => flatten(data), []
  );

  console.log("TableSearch.data", data);
  const columns = React.useMemo( 
    () => getColumns(data),
    []
  );
  console.log("TableSearch.columns", columns);

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes
    },
    useFilters, // useFilters!
    useGlobalFilter // useGlobalFilter!
  );

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  const firstPageRows = rows.slice(0, 30);

  const renderCell = (cell) => {
    if (Array.isArray(cell.value)) {
        return JSON.stringify(cell.value);
    }
    const ret = cell.render("Cell");
    console.log("render cell", ret);
    return ret;
  };

  console.log("TableSearch: rendering table");
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: "left"
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
              console.log("preparing row: ", row);
            prepareRow(row);
            console.log("Prepared row:", row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{renderCell(cell)}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div>
    </>
  );
}
