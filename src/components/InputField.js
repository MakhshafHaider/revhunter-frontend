import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "@chakra-ui/react";
import {
  updateSelectedClients,
  removeSelectedCampaigns,
} from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
export default function InputField({ clients, loadingClients, setProgressCount, setTotalCount }) {

  const dispatch = useDispatch();
  const [selectedClient, setSelectedClient] = useState(null);
  const [inputValue1, setInputValue1] = useState("");
  const [dropdownStates, setDropdownStates] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [highlightedOption, setHighlightedOption] = useState(null);
  const dropdownRef = useRef(null);

  const selectedClients = useSelector((state) => state.clients.selectedClients);

  useEffect(() => {
    if (!selectedClients) {
      setSelectedClient("");
    }
  }, [selectedClients]);

  const handleInputClick = (event, index) => {
    const value = event.target.value;
    setSelectedClient(value);
    setTotalCount(null);
    setProgressCount(null);
    dispatch(updateSelectedClients(value));

    dispatch(removeSelectedCampaigns());

    setDropdownStates(true);

    if (showOptions) {
      setShowOptions(false);
    } else {
      setShowOptions(true);
      setDropdownStates(true);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    dispatch(removeSelectedCampaigns());
    dispatch(updateSelectedClients(value));

    setSelectedClient(value);
    localStorage.setItem("clientData", value);
    setInputValue1(value);
  };
  const handleOptionClick = (option) => {
    dispatch(removeSelectedCampaigns());
    dispatch(updateSelectedClients(option?.name));

    setSelectedClient(option?.name);
    setShowOptions(false);
    localStorage.setItem("clientData", option?.name);

    setDropdownStates(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownStates(false);
      }
    };

    if (dropdownStates) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownStates]);

  const handleKeyDown = (event) => {
    if (showOptions) {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedOption((prev) =>
          prev === null
            ? clients.length - 1
            : (prev + clients.length - 1) % clients.length
        );
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedOption((prev) =>
          prev === null ? 0 : (prev + 1) % clients.length
        );
      } else if (event.key === "Enter" && highlightedOption !== null) {
        handleOptionClick(clients[highlightedOption]);
      }
    }
  };

  return (
    <div>
      <div ref={dropdownRef}>
        <input
          type="text"
          style={{
            height: 35,
            width: 270,

            border: "1px solid #ddd",
            padding: 10,
            borderRadius: 10,
          }}
          value={selectedClient}
          onChange={(e) => handleInputChange(e)}
          placeholder="Select Client"
          onClick={(e) => handleInputClick(e)}
          onKeyDown={handleKeyDown}
        />
        <div style={{ cursor: "pointer" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-caret-up"
            viewBox="0 0 16 16"
            onClick={handleInputClick}
            style={{ position: "absolute", left: 535, top: 175 }}
          >
            <path d="M14 6H2l6 8 6-8z" />
          </svg>
        </div>
        {dropdownStates && (
          <ul
            style={{
              listStyle: "none",
              position: "absolute",
              backgroundColor: "white",
              margin: 0,
              padding: 0,
              zIndex: 1,
              width: 270,

              maxHeight: "450px",
              overflowY: "auto",
              // top: 200,
            }}
          >
            {loadingClients ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                  alignItems: "center",
                }}
              >
                <Spinner />
              </div>
            ) : (
              clients
                .filter((client) =>
                  client.name
                    .toLowerCase()
                    .includes(inputValue1 && inputValue1.toLowerCase())
                )
                .map((client, index) => (
                  <li
                    onClick={() => handleOptionClick(client)}
                    style={{
                      backgroundColor:
                        highlightedOption === index ? "#f0f0f0" : "transparent",
                      padding: "10px",
                      // paddingBottom: "10px",
                      border: "1px solid #ddd",
                      width: 250,
                    }}
                  >
                    {client.name}
                  </li>
                ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
