function Message() {
    // JSX: JavaScript XML, allows us to write HTML-like syntax in our JavaScript code. It is used in React to describe what the UI should look like. In this case, we are returning a simple heading element with the text "Hello World".
    const name = "Mars"; // This is a variable that holds the string "World". We can use this variable in our JSX to dynamically display content.
    if (name)
        return <h1>Hello {name}</h1>;
    return <h1>Hello World</h1>;
}

export default Message;