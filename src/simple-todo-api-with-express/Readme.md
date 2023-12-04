## **Overview:**

The purpose of this project is to assess your ability to set up a simple server using Express in Node.js and implement a basic RESTful API.

## **Requirements:**

1. Using the Express framework, create a new Node.js application.
2. Implement CRUD (Create, Read, Update, Delete) operations to manage "to-do" items.
3. Use Arrays to store the to-do items, where each to-do item will have two properties: **`id`** (Number) and **`task`** (String).

The following endpoints should be implemented:

- **`GET /todos`** - Should return a list of all to-do items.
- **`POST /todos`** - Should accept a new to-do object and add it to the list. It should return the added to-do item.
- **`PUT /todos/:id`** - Should accept an id and an updated to-do object, and update the corresponding to-do item in the list. It should return the updated to-do item.
- **`DELETE /todos/:id`** - Should accept an id and delete the corresponding to-do item from the list. It should return a message stating the deletion was successful.

## **Instructions:**

Upon completion of the project, provide instructions on how to run your application.

Please ensure you handle any potential errors gracefully - the server should never crash.
