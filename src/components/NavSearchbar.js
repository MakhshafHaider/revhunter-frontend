import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Box,
} from "@chakra-ui/react";
import { BiSearchAlt2 } from "react-icons/bi";

const NavSearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef(null);

  const toggleSearch = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  const handleClickOutside = useCallback(
    (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        !event.target.classList.contains("search-icon")
      ) {
        setIsOpen(false);
      }
    },
    [searchValue]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  const handelSubmit = () => {
    console.log(searchValue);
  };

  return (
    <Box position="relative">
      {!isOpen && (
        <IconButton
          aria-label="Search"
          icon={<BiSearchAlt2 />}
          onClick={toggleSearch}
          position="absolute"
          right="0"
          zIndex="2"
        />
      )}

      <Box
        className="search-icon"
        w={isOpen ? ["120px", "350px"] : "0"}
        style={{
          opacity: isOpen ? 1 : 0,
          transition: "width 0.3s ease-in-out, opacity 0.3s ease-in-out",
        }}
        overflow="hidden"
      >
        <InputGroup className="search-icon">
          <Input
            className="search-icon"
            placeholder="Search"
            onClick={(e) => e.stopPropagation()}
            ref={inputRef}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <InputRightElement className="search-icon">
            <BiSearchAlt2
              cursor="pointer"
              onClick={handelSubmit}
              className="search-icon"
            />
          </InputRightElement>
        </InputGroup>
      </Box>
    </Box>
  );
};

export default NavSearchBar;
