// src/utils/AsyncHandler.js

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

















// Step 1: Define the asyncHandler function
// const asyncHandler = (requestHandler) => {
  
    // Step 2: Return a new function that takes req, res, and next
    // return (req, res, next) => {
      
      // Step 3: Execute the requestHandler with req, res, and next
    //   const result = requestHandler(req, res, next);
      
      // Step 4: Wrap the result in a Promise
    //   Promise.resolve(result)
        
        // Step 5: Handle the successful resolution (implicitly handled)
        
        // Step 6: Catch any errors that occur
//         .catch((err) => {
//           next(err); // Pass the error to the next middleware
//         });
//     };
//   };
  
  // Step 7: Export the asyncHandler function
//   export { asyncHandler };