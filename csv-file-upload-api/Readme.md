### **Problem Statement:**

Your task is to build a Node.js application that exposes an API to upload and fetch CSV files. Additionally, the application must provide an interface to retrieve specific data from the uploaded CSV files.

Your application should have the following endpoints:

1. **`POST /upload`** - This should allow file uploads (restricted to CSV files).
2. **`GET /files`** - This should list all the uploaded files (file names).
3. **`GET /files/:filename`** - This should return the content of a specific file in a JSON format. Each row in the file should become a JSON object with properties corresponding to column names.

For this exercise, you can assume the CSV files have a header row that defines the names of columns. You are not expected to persist uploaded data across server restarts - you can keep everything in your application's memory for the simplicity of the task.

You will need to use Express middleware to process file uploads. For this purpose, you may use libraries such as **`multer`**. To parse CSV files, use a library like **`csv-parser`**.

Please pay attention to correct error handling: invalid endpoints, incorrect file types, non-existing files, etc. should all be handled gracefully.

Your solution should include a brief documentation about how to run the application and how to use the API.

### **Important points:**

- The server should validate the uploaded file to check whether it's a CSV before storing and processing it.
- The server should handle errors (file not found, wrong file type, etc.) and provide useful and clear responses when errors occur.
- Automated tests are not required but will be considered as a plus.

With this task, we can evaluate the candidate’s ability in multiple dimensions, such as file handling, parsing data, validating inputs, handling different error cases, designing API endpoints, and writing instructions to utilize the API.
