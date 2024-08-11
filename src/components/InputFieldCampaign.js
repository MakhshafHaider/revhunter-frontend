import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "@chakra-ui/react";
import { updateSelectedCampaigns } from "../redux/actions";
import { useDispatch } from "react-redux";
export default function InputFieldCampaign({ campaigns, loadingCampaign }) {

  const [highlightedCampaignOption, setHighlightedCampaignOption] =
    useState(null);
  const [inputValue2, setInputValue2] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState('');
  const [showCampaignOptions, setShowCampaignOptions] = useState(false);

  const dispatch = useDispatch();
  const campaignRef = useRef(null);

  const handleCampaignInputChange = (event) => {
    const value = event.target.value;
    setSelectedCampaigns(value)
    dispatch(updateSelectedCampaigns(value));
    setInputValue2(value);

    localStorage.setItem("campaignData", value);
  };

  const handleCampaignOptionClick = (option) => {
    dispatch(updateSelectedCampaigns(option?.name));
    setSelectedCampaigns(option?.name)
    setShowCampaignOptions(false);
    localStorage.setItem("campaignData", option?.name);
  };

  const handleCampaignInputClick = (event, index) => {
    const value = event.target.value;
    setSelectedCampaigns(value)
    setShowCampaignOptions(true);
    dispatch(updateSelectedCampaigns(value));
  };

  const handleCampaignKeyDown = (event) => {
    if (showCampaignOptions) {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedCampaignOption((prev) =>
          prev === null
            ? campaigns.length - 1
            : (prev + campaigns.length - 1) % campaigns.length
        );
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedCampaignOption((prev) =>
          prev === null ? 0 : (prev + 1) % campaigns.length
        );
      } else if (event.key === "Enter" && highlightedCampaignOption !== null) {
        handleCampaignOptionClick(campaigns[highlightedCampaignOption]);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (campaignRef.current && !campaignRef.current.contains(event.target)) {
        setShowCampaignOptions(false);
      }
    };

    if (showCampaignOptions) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showCampaignOptions]);
  return (
    <div>
      {" "}
      <div ref={campaignRef}>
        <input
          type="text"
          style={{
            height: 35,
            width: 270,
            border: "1px solid #ddd",
            padding: 10,
            borderRadius: 10,
            marginLeft: 20,
          }}
          value={selectedCampaigns}
          onChange={(e) => handleCampaignInputChange(e)}
          placeholder="Select Campaign"
          onClick={(e) => handleCampaignInputClick(e)}
          onKeyDown={handleCampaignKeyDown}
        />

        <div style={{ cursor: "pointer" }}>
          {/* Add the SVG icon here */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-caret-up"
            viewBox="0 0 16 16"
            onClick={(e) => handleCampaignInputClick(e)}
            style={{ position: "absolute", left: 830, top: 175 }}
          >
            <path d="M14 6H2l6 8 6-8z" />
          </svg>
        </div>

        {showCampaignOptions && (
          <ul
            style={{
              listStyle: "none",
              backgroundColor: "white",
              margin: 0,
              padding: 0,
              zIndex: 1,
              marginLeft: 20,
              width: 270,
              position: "absolute",
              maxHeight: "450px",
              overflowY: "auto",
            }}
          >
            {loadingCampaign ? (
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Spinner />
              </div>
            ) : (
              campaigns &&
              campaigns
                .filter((campaign) =>
                  campaign.name
                    .toLowerCase()
                    .includes(inputValue2 && inputValue2.toLowerCase())
                )
                .map((campaign, index) => (
                  <li
                    onClick={() => handleCampaignOptionClick(campaign, index)}
                    style={{
                      backgroundColor:
                        highlightedCampaignOption === index
                          ? "#f0f0f0"
                          : "transparent",
                      padding: "10px",
                      border: "1px solid #ddd",
                      width: 270,
                    }}
                  >
                    {campaign.name}
                  </li>
                ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
