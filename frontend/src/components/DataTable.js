import React, { useState, useMemo, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const DataTable = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    team: "",
    activity: "",
    subActivity: "",
    taskSearch: "",
    activitySearch: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/allData`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchAllData();
  }, []);

  const [pelaksanaanDateRange, setPelaksanaanDateRange] = useState([null, null]);
  const [dueDateRange, setdueDateRange] = useState([null, null]);

  const [pelaksanaanStartDate, pelaksanaanEndDate] = pelaksanaanDateRange;
  const [dueStartDate, dueEndDate] = dueDateRange;

  const teams = useMemo(() => {
    return [...new Set(data.map((team) => team.name))];
  }, [data]);

  const activities = useMemo(() => {
    if (!filter.team) return [];
    const teamData = data.find((team) => team.name === filter.team);
    if (!teamData) return [];
    return [...new Set(teamData.activities.map((activity) => activity.name))];
  }, [data, filter.team]);

  const subActivities = useMemo(() => {
    if (!filter.activity || !filter.team) return [];
    const teamData = data.find((team) => team.name === filter.team);
    if (!teamData) return [];
    const activityData = teamData.activities.find((activity) => activity.name === filter.activity);
    if (!activityData) return [];
    return [...new Set(activityData.subActivities.map((subActivity) => subActivity.name))];
  }, [data, filter.team, filter.activity]);

  const filteredData = useMemo(() => {
    return data
      .flatMap((team) =>
        team.activities.flatMap((activity) =>
          activity.subActivities.flatMap((subActivity) =>
            subActivity.tasks.map((task) => ({
              team: team.name,
              activity: activity.name,
              tanggal_pelaksanaan: activity.tanggal_pelaksanaan,
              subActivity: subActivity.name,
              task: task.name,
              dateCreated: task.dateCreated,
              dueDate: task.dueDate,
              completed: task.completed,
            }))
          )
        )
      )
      .filter((row) => {
        const matchesTaskSearch = row.task.trim().toLowerCase().includes(filter.taskSearch.trim().toLowerCase());
        const matchesActivitySearch = row.activity.trim().toLowerCase().includes(filter.activitySearch.trim().toLowerCase());

        const taskPelaksanaanDate = new Date(row.tanggal_pelaksanaan);
        const taskdueDate = new Date(row.dueDate);

        // Adding one day to the end dates to include the entire end date
        const adjustedPelaksanaanEndDate = pelaksanaanEndDate ? new Date(pelaksanaanEndDate.getTime() + 86400000) : null;
        const adjustedDueEndDate = dueEndDate ? new Date(dueEndDate.getTime() + 86400000) : null;

        const matchesPelaksanaanDateRange = !pelaksanaanStartDate || (taskPelaksanaanDate >= pelaksanaanStartDate && taskPelaksanaanDate < (adjustedPelaksanaanEndDate || new Date()));
        const matchesdueDateRange = !dueStartDate || (taskdueDate >= dueStartDate && taskdueDate < (adjustedDueEndDate || new Date()));

        return (
          matchesTaskSearch &&
          matchesActivitySearch &&
          matchesPelaksanaanDateRange &&
          matchesdueDateRange &&
          (!filter.team || row.team === filter.team) &&
          (!filter.activity || row.activity === filter.activity) &&
          (!filter.subActivity || row.subActivity === filter.subActivity)
        );
      });
  }, [data, filter, pelaksanaanStartDate, pelaksanaanEndDate, dueStartDate, dueEndDate]);

  const completedCount = filteredData.filter((row) => row.completed).length;
  const incompleteCount = filteredData.filter((row) => !row.completed).length;

  const columns = useMemo(
    () => [
      { Header: "Tim", accessor: "team" },
      { Header: "Kegiatan", accessor: "activity" },
      {
        Header: "Tanggal Pelaksanaan Kegiatan",
        accessor: "tanggal_pelaksanaan",
        Cell: ({ value }) => formatDate(value),
      },
      { Header: "Sub Kegiatan", accessor: "subActivity" },
      { Header: "Tugas", accessor: "task" },
      {
        Header: "Created Date",
        accessor: "dateCreated",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Due Date",
        accessor: "dueDate",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: (
          <>
            Status
            <span style={{ marginLeft: "10px" }}>
              <span style={{ color: "blue" }}>({completedCount})</span>
              <span style={{ color: "red", marginLeft: "5px" }}>({incompleteCount})</span>
            </span>
          </>
        ),
        accessor: "completed",
        Cell: ({ value }) => (value ? "Selesai" : "Belum Selesai"),
        sortType: (rowA, rowB, columnId, desc) => {
          const statusA = rowA.original.completed;
          const statusB = rowB.original.completed;
          return statusA === statusB ? 0 : statusA ? 1 : -1;
        },
      },
    ],
    [completedCount, incompleteCount]
  );

  const tableInstance = useTable({ columns, data: filteredData, initialState: { sortBy: [{ id: "team", desc: false }] } }, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  // Pagination Logic
  const startRow = currentPage * rowsPerPage;
  const endRow = startRow + rowsPerPage;
  const paginatedRows = rows.slice(startRow, endRow);

  const pageCount = Math.ceil(rows.length / rowsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="filter-container">
        <div className="filters">
          <div className="filter-select">
            <Select
              options={teams.map((team) => ({ value: team, label: team }))}
              onChange={(selectedOption) => {
                setFilter({
                  ...filter,
                  team: selectedOption?.value || "",
                  activity: "",
                  subActivity: "",
                });
              }}
              value={filter.team ? { value: filter.team, label: filter.team } : null}
              placeholder="Filter by Team"
              isClearable
            />
            <Select
              options={activities.map((activity) => ({ value: activity, label: activity }))}
              onChange={(selectedOption) => {
                setFilter({
                  ...filter,
                  activity: selectedOption?.value || "",
                  subActivity: "",
                });
              }}
              value={filter.activity ? { value: filter.activity, label: filter.activity } : null}
              placeholder="Filter by Activity"
              isClearable
              isDisabled={!filter.team}
            />
            <Select
              options={subActivities.map((subActivity) => ({ value: subActivity, label: subActivity }))}
              onChange={(selectedOption) => setFilter({ ...filter, subActivity: selectedOption?.value || "" })}
              value={filter.subActivity ? { value: filter.subActivity, label: filter.subActivity } : null}
              placeholder="Filter by Sub Activity"
              isClearable
              isDisabled={!filter.activity}
            />
          </div>
          <div className="search-inputs">
            <input type="text" className="search-bar" value={filter.taskSearch} onChange={(e) => setFilter({ ...filter, taskSearch: e.target.value })} placeholder="Search tugas" />
            <input type="text" className="search-bar" value={filter.activitySearch} onChange={(e) => setFilter({ ...filter, activitySearch: e.target.value })} placeholder="Search kegiatan" />
          </div>

          <div className="date-filters" style={{ display: "flex", justifyContent: "flex-start", gap: "10px", marginTop: "-10px", marginLeft: "20px" }}>
            <div>
              <DatePicker
                placeholderText=" Tanggal Pelaksanaan"
                selected={pelaksanaanStartDate}
                onChange={(dates) => setPelaksanaanDateRange(dates)}
                startDate={pelaksanaanStartDate}
                endDate={pelaksanaanEndDate}
                selectsRange
                isClearable
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div>
              <DatePicker placeholderText=" Deadline" selected={dueStartDate} onChange={(dates) => setdueDateRange(dates)} startDate={dueStartDate} endDate={dueEndDate} selectsRange isClearable dateFormat="yyyy-MM-dd" />
            </div>
          </div>
        </div>
      </div>

      <table {...getTableProps()} className="data-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {paginatedRows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination-controls" style={{ display: "flex", justifyContent: "flex-start", marginTop: "20px", gap: "10px" }}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
          &lt;
        </button>
        <span>
          Page {currentPage + 1} of {pageCount}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageCount - 1}>
          &gt;
        </button>
      </div>
    </>
  );
};

export default DataTable;
