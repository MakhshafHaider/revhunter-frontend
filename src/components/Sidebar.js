"use client";

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import NavSearchBar from "./NavSearchbar";
import {
  FiTrendingUp,
  FiMenu,
  } from "react-icons/fi";
import {
  BsJournalRichtext,
  BsPeopleFill,
  } from "react-icons/bs";import { HiOutlineMail } from 'react-icons/hi';
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../redux/actions";

const LinkItems = [
  { name: "Enrich", icon: BsJournalRichtext, to: "/" },
  { name: "Jobs", icon: FiTrendingUp, to: "/jobs" },
  { name: "Clients", icon: BsPeopleFill, to: "/clients" },
  { name: "Email Setup", icon: HiOutlineMail, to: "/email-setup" },
];

const SidebarContent = ({ onClose, ...rest }) => {
  const [selectedItem, setSelectedItem] = useState(
    window.location.pathname === "/jobs"
      ? "Jobs"
      : window.location.pathname === "/"
      ? "Enrich"
      : window.location.pathname === "/clients"
      ? "Clients"
      : window.location.pathname === "/email-setup"
      ? "Email Setup"
      : "Enrich"
  );
  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
  };
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text mt="2px" fontSize="2xl">
          Dashboard
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Box mt="20px">
        {LinkItems.map((link) => (
          <NavItem
            isSelected={selectedItem === link.name}
            onClick={() => handleItemClick(link.name)}
            key={link.name}
            icon={link.icon}
            to={link.to}
          >
            {link.name}
          </NavItem>
        ))}
      </Box>
    </Box>
  );
};

const NavItem = ({ icon, children, isSelected, to, ...rest }) => {
  return (
    <Link to={to}>
      <Box style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          color={isSelected ? "blue" : "black"}
          {...rest}
        >
          {icon && (
            <Box display="flex" gap="5px">
              <Box borderLeft={isSelected ? "2px solid blue" : ""}></Box>
              <Icon mr="2" fontSize="16" as={icon} />
            </Box>
          )}

          {children}
        </Flex>
      </Box>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const Record = useSelector((state) => state.recordRedux.records)

  const dispatch = useDispatch();
  const handleLogout =() =>{
    dispatch(Logout());
  }
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "space-between" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        ml={{ base: "", md: "20px" }}
        fontSize={{ base: "md", md: "2xl" }}
        fontWeight="bold"
      >
        RevHunter Lead Enrichment Services
      </Text>

      <Text>
      {
        `${Record.length} jobs running` 
      }
      </Text>
      <HStack spacing={{ base: "0", md: "6" }}>
        <NavSearchBar />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
            
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
      
        <Outlet />
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;
