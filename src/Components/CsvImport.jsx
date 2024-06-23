import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import Papa from "papaparse";
import { useState } from "react";
import {
  faArrowUp,
  faArrowDown,
  faRotateRight,
  faSearch,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const CSVUpload = () => {
  const [data, setData] = useState([]);
  const [columnArray, setColumnArray] = useState([]);
  const [valuesArray, setValuesArray] = useState([]);

  const [invalidData, setInvalidData] = useState([]);
  const [validCount, setValidCount] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);

  // For validation
  const validateRow = (row) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;

    if (
      row.name &&
      emailPattern.test(row.email) &&
      phonePattern.test(row.phone) &&
      row.city &&
      row.address
    ) {
      return true;
    }
    return false;
  };

  const handleUrlupload = async (url) => {
    try {
      const response = await fetch(url);
      const textData = await response.text();
      Papa.parse(textData, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const parsedData = results.data;
          const columns = Object.keys(parsedData[0]);
          const values = parsedData.map(Object.values);
          setData(parsedData);
          setColumnArray(columns);
          setValuesArray(values);

          let validRowsCount = 0;
          let invalidRows = [];

          results.data.forEach((row) => {
            if (validateRow(row)) {
              validRowsCount++;
            } else {
              invalidRows.push(row);
            }
          });

          setInvalidData(invalidRows);
          setValidCount(validRowsCount);
          setInvalidCount(invalidRows.length);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "text/csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            const columns = Object.keys(results.data[0]);
            const values = results.data.map(Object.values);
            setData(results.data);
            setColumnArray(columns);
            setValuesArray(values);
          },
        });
      } else {
        alert("Please upload a valid CSV file");
      }
    } else {
      alert("Please select a file or enter a URL.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="upload-container">
          <style>{`
        .container {
          height: 100vh;
          width: 100%;
        }
        .upload-container {
          display: flex;
          flex-direction: column;
          align-items: start;
          border: 1px solid #ccc;
          border-radius: 8px;
          max-width: 400px;
          height: 400px;
          padding: 30px;
          margin: auto;
          margin-top: 100px;
        }
        .upload-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 2px dashed #ccc;
          padding: 40px;
          border-radius: 8px;
          width: 310px;
          text-align: center;
          cursor: pointer;
        }
        .upload-label {
          font-size: 16px;
          color: #333;
          margin-bottom: 10px;
          margin-top: 10px;
        }
        span {
          color: #ccc;
        }
        .icon {
          font-size: 48px;
          color: lightgray;
        }
        .upload-url {
          display: flex;
          gap: 10px;
          width: 100%;
          background-color: #f9f9f9;
        }
        .upload-url input {
          flex-grow: 1;
          padding: 8px;
          border: none;
          border-radius: 4px;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          outline: none;
          background-color: transparent;
          box-shadow: none;
        }
        .upload-url button {
          padding: 8px 16px;
          color: #ccc;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
        }
        .upload-url button:hover {
          background-color: #333;
        }
      `}</style>
          <div className="container">
            <h1>Upload CSV</h1>
            <div
              className="upload-box"
              onClick={() => document.getElementById("file-upload").click()}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleUpload}
                id="file-upload"
                style={{ display: "none" }}
              />
              <FontAwesomeIcon icon={faCloudUploadAlt} className="icon" />
              <label htmlFor="file-upload" className="upload-label">
                Select a CSV file to upload
              </label>
              <span>or drag and drop it here</span>
            </div>
            <p>Or upload from URL</p>
            <div className="upload-url">
              <input
                type="text"
                placeholder="Enter URL to upload"
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleUrlupload(e.target.value);
                }}
              />
              <button
                onClick={() =>
                  handleUrlupload(
                    document.querySelector(".upload-url input").value
                  )
                }
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
      <br />
      {/* Data Table :  */}
      <div className="table-container">
        <style>{`
        .importbox {
          height: 100%;
          width: 100%;
        }
      .table-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
      }

      h1 {
        text-align: center;
        margin-bottom: 20px;
        font-size: 24px;
        color: #333;
        background-color: #f2f2f2;
        padding: 10px;
        border-radius: 8px;
        width: 100%;
      }

      .search {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        margin-bottom: 10px;
        padding: 5px;
      }

      .search input[type="text"] {
        padding: 8px;
        border: none;
        border-radius: 4px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        outline: none;
        background-color: transparent;
        box-shadow: none;
        flex: 1;
      }

      .search button {
        padding: 8px 16px;
        cursor: pointer;
        background-color: transparent;
        border: none;
      }
      .table-container {
        width: 100%;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .table th,
      .table td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
      }

      .table th {
        background-color: #f2f2f2;
        color: #333;
      }

      .table tbody tr:nth-child(even) {
        background-color: #f2f2f2;
      }

      .table-icons {
        display: flex;
        gap: 20px;
        justify-content: end;
        padding: 10px;
        width: 100%;
        margin-right: 10px;
      }

      .table-icons span {
        cursor: pointer;
        font-size: 20px;
        margin-top: 5px;
      }
        .more {
          width : fit-content;
          text-align: center;
          margin-top: 10px;
          font-size: 24px;
          border : none ; 
          color: #333;
          padding: 10px;
          background-color: transparent;
          box-shadow: none;
          cursor: pointer;
        }
    `}</style>
        <div className="importbox">
          <h1>My Users</h1>
          <div className="table-icons">
            <div className="search">
              <input type="text" placeholder="Type in a last name" />
              <button>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            <span>
              <FontAwesomeIcon icon={faRotateRight} />
            </span>
            <div>
              <span>
                <FontAwesomeIcon icon={faArrowUp} />
                <FontAwesomeIcon icon={faArrowDown} />
              </span>
            </div>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  {columnArray.map((column, index) => (
                    <th key={index}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {valuesArray.map((value, index) => (
                  <tr key={index}>
                    {value.map((val, subIndex) => (
                      <td key={subIndex}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="more">More</button>
          </div>
        </div>
      </div>
      <br />
      {/* imported successfully */}
      <div className="import-summary">
        <style>{`
      .import-summary {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 30px;
      }

      .success-icon {
        font-size: 30px;
        color: green;
        width: 50px;
        height: 50px;
        padding: 10px;
        border: 3px solid green;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        display: flex;
      }

      .message {
        font-size: 24px;
        font-weight: bold;
        margin-top: 10px;
        color: #808080;        
      }

      .import-summary-link {
        margin-top: 10px;
        font-size: 18px;
        color: green;
        cursor: pointer;
      }

      .employee {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        width: 100%;
        padding: 10px;
        border-radius: 5px;
      }

      .header {
        font-size: 20px; 
        margin-bottom: 10px;
        border-bottom: 1px solid #808080;
        width: 100%;
        color: blue;
      }

      .employee button {
        padding: 10px 20px;
        font-size: 18px;
        color: black;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      .table table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      .success {
        color: blue;
      }

      .failure {
        color: red;
      }
      .num {
        color: green;
        cursor: pointer;
        margin-left: 600px;
      }

      .access-report {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 10px;
        border-radius: 5px;
      }

      .access-report button {
        padding: 10px 20px;
        font-size: 18px;
        background-color: green;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .access-report button:hover {
        background-color: darkgreen;
      }

    `}</style>
        <div className="success-icon">
          <FontAwesomeIcon icon={faCheck} />
        </div>
        <div className="message">Data imported successfully</div>
        <div className="import-summary-link">
          <a href="#import-summary">Import Summary</a>
        </div>
        <div className="employee">
            <p className="header">Employee Details</p>
            <button>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
        <div className="table">
          <table>
            <tbody>
              <tr>
                <td>Employee Details <span className="num"></span></td>
                <td className="success">Success: <span className="num">{valuesArray.length}</span></td>
              </tr>
              <tr>
                <td>Total No. of Records <span className="num">{valuesArray.length}</span></td>
                <td className="failure">Failure: <span className="num">{invalidCount}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="access-report">
        <button>Access the report</button>
      </div>
    </>
  );
};

export default CSVUpload;
