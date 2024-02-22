import React, { useState, useEffect } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, Stack, Text, VStack, HStack, Heading, useToast, List, ListItem } from "@chakra-ui/react";
import { FaPlus, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [newTodo, setNewTodo] = useState({ title: "", content: "" });
  const toast = useToast();

  const fetchTodos = async () => {
    if (!token) return;
    try {
      const response = await fetch("https://backengine-zq2g.fly.dev/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        throw new Error("Failed to fetch todos");
      }
    } catch (error) {
      setFetchError(error.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [token]);

  const handleLogin = async () => {
    try {
      const response = await fetch("https://backengine-zq2g.fly.dev/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        toast({
          title: "Login successful!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to login");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch("https://backengine-zq2g.fly.dev/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        handleLogin();
      } else {
        throw new Error("Failed to signup");
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleCreateTodo = async () => {
    if (!token) return;
    try {
      const response = await fetch("https://backengine-zq2g.fly.dev/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTodo),
      });
      if (response.ok) {
        setNewTodo({ title: "", content: "" });
        fetchTodos();
      } else {
        throw new Error("Failed to create todo");
      }
    } catch (error) {
      toast({
        title: "Creating todo failed",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (fetchError) {
    return <Text>Failed to fetch todos: {fetchError}</Text>;
  }

  if (!token) {
    return (
      <Container>
        <VStack spacing={4} align="flex-start">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <HStack>
            <Button leftIcon={<FaSignInAlt />} onClick={handleLogin}>
              Login
            </Button>
            <Button leftIcon={<FaUserPlus />} onClick={handleSignup}>
              Signup
            </Button>
          </HStack>
        </VStack>
      </Container>
    );
  }

  return (
    <Container>
      <VStack spacing={4}>
        <Heading>Todo App</Heading>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input placeholder="Todo title" value={newTodo.title} onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })} />
        </FormControl>
        <FormControl>
          <FormLabel>Content</FormLabel>
          <Input placeholder="Todo content" value={newTodo.content} onChange={(e) => setNewTodo({ ...newTodo, content: e.target.value })} />
        </FormControl>
        <Button leftIcon={<FaPlus />} onClick={handleCreateTodo}>
          Add Todo
        </Button>
        <List spacing={3}>
          {todos.map((todo, index) => (
            <ListItem key={index} p={2} borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">{todo.title}</Text>
              <Text>{todo.content}</Text>
            </ListItem>
          ))}
        </List>
      </VStack>
    </Container>
  );
};

export default Index;
